import { LABEL_TO_HS } from '../../shared/leadStatus.js'
import { sessions } from '../index.js'
import { US_STATES } from '../../shared/states.js';

const stateByName = new Map(US_STATES.map(s => [s.name.toLowerCase(), s]));
const stateByAbbr = new Map(US_STATES.map(s => [s.abbr.toLowerCase(), s]));

function resolveVariant(loc) {
  const lower = loc.trim().toLowerCase();
  return stateByName.get(lower) || stateByAbbr.get(lower) || { name: loc, abbr: null };
}

function contactMatchesLocations(props, variants) {
  const state = (props.state || '').toLowerCase();
  const city  = (props.city  || '').toLowerCase();

  return variants.some(({ name, abbr }) => {
    const n = name.toLowerCase();
    if (state.includes(n) || city.includes(n)) return true;
    if (abbr) {
      const wordRe = new RegExp(`\\b${abbr.toLowerCase()}\\b`);
      if (wordRe.test(state) || wordRe.test(city)) return true;
    }
    return false;
  });
}

const HS_SEARCH_URL = 'https://api.hubapi.com/crm/v3/objects/contacts/search'
const PROPERTIES = [
  'firstname', 'lastname', 'email', 'phone', 'company',
  'lifecyclestage', 'hs_lead_status', 'hubspot_owner_id',
  'address', 'city', 'state', 'zip', 'photo_url'
]

export default async function contactRoutes(fastify) {

  fastify.get('/contacts', async (request, reply) => {
    const sessionId = request.headers['x-session-id']
    const accessToken = sessions.get(sessionId)?.tokens?.accessToken
    if (!accessToken) return reply.status(401).send({ error: 'Not authenticated' })

    const { statuses, lifecycles, locations, ownerId } = request.query

    // Build server-side filter groups for status, lifecycle, and owner
    const filters = []

    const hsStatuses = statuses
      ? statuses.split(',').map(s => LABEL_TO_HS[s.trim()]).filter(Boolean)
      : []

    if (hsStatuses.length > 0) {
      filters.push({ propertyName: 'hs_lead_status', operator: 'IN', values: hsStatuses })
    }

    const hsLifecycles = lifecycles
      ? lifecycles.split(',').map(l => l.trim().toLowerCase()).filter(Boolean)
      : []

    if (hsLifecycles.length > 0) {
      filters.push({ propertyName: 'lifecyclestage', operator: 'IN', values: hsLifecycles })
    }

    if (ownerId) {
      filters.push({ propertyName: 'hubspot_owner_id', operator: 'EQ', value: ownerId })
    }

    const filterGroups = filters.length > 0 ? [{ filters }] : []

    console.log(`[contacts] filters — statuses: [${hsStatuses.join(', ') || 'none'}] | lifecycles: [${hsLifecycles.join(', ') || 'none'}] | owner: ${ownerId || 'any'}`)

    try {
      const MAX_CONTACTS = 200
      let allContacts = []
      let after = null
      let page = 0

      do {
        const remaining = MAX_CONTACTS - allContacts.length
        const body = {
          filterGroups,
          sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
          properties: PROPERTIES,
          limit: Math.min(100, remaining),
          ...(after ? { after } : {}),
        }

        const response = await fetch(HS_SEARCH_URL, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        const data = await response.json()

        if (!response.ok) {
          console.error('[contacts] HubSpot error:', response.status, data)
          return reply.status(response.status).send({ error: 'HubSpot search failed', detail: data })
        }

        page++
        allContacts = allContacts.concat(data.results || [])
        after = data.paging?.next?.after ?? null
        console.log(`[contacts] page ${page}: +${data.results?.length ?? 0} (total so far: ${allContacts.length})`)

      } while (after && allContacts.length < MAX_CONTACTS)

      console.log(`[contacts] fetched ${allContacts.length} from HubSpot`);
      console.log(`[contacts] Client side filtering for locations: ${locations || 'none'}`);

      // Client-side location filtering on the full result set
      let contacts = allContacts
      if (locations) {
        const locationValues = locations.split(',').map(l => l.trim()).filter(Boolean)
        if (locationValues.length > 0) {
          const variants = locationValues.map(resolveVariant)
          contacts = contacts.filter(c => contactMatchesLocations(c.properties, variants))
          console.log(`[contacts] after location filter: ${contacts.length} (dropped ${allContacts.length - contacts.length})`)
        }
      }

      console.log(`[contacts] sending ${contacts.length} contacts to client`)
      reply.send({ results: contacts })

    } catch (err) {
      reply.status(500).send({ error: 'Failed to fetch contacts', detail: err.message })
    }
  })
}