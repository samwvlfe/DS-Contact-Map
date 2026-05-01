import { LABEL_TO_HS } from '../../shared/leadStatus.js';
import { US_STATES } from '../../shared/states.js';

const stateByName = new Map(US_STATES.map(s => [s.name.toLowerCase(), s]));
const stateByAbbr = new Map(US_STATES.map(s => [s.abbr.toLowerCase(), s]));

function resolveVariant(loc) {
  const lower = loc.trim().toLowerCase();
  return stateByName.get(lower) || stateByAbbr.get(lower) || { name: loc, abbr: null };
}

function contactMatchesLocations(props, variants) {
  const state   = (props.state   || '').toLowerCase();
  const address = (props.address || '').toLowerCase();
  return variants.some(({ name, abbr }) => {
    const n = name.toLowerCase();
    if (state.includes(n) || address.includes(n)) return true;
    if (abbr) {
      const wordRe = new RegExp(`\\b${abbr.toLowerCase()}\\b`);
      if (wordRe.test(state) || wordRe.test(address)) return true;
    }
    return false;
  });
}

export default async function contactRoutes(fastify) {

  fastify.get('/contacts', async (request, reply) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      return reply.status(401).send({ error: 'No token provided' })
    }

    const accessToken = authHeader.replace('Bearer ', '')
    const { statuses, locations } = request.query

    const filterGroups = []
    if (statuses) {
      const hsStatuses = statuses.split(',').map(s => LABEL_TO_HS[s.trim()]).filter(Boolean)
      if (hsStatuses.length > 0) {
        filterGroups.push({
          filters: [{ propertyName: 'hs_lead_status', operator: 'IN', values: hsStatuses }]
        })
      }
    }

    try {
      const HS_SEARCH_URL = 'https://api.hubapi.com/crm/v3/objects/contacts/search'
      const requestBody = {
        filterGroups,
        sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
        properties: ['firstname', 'lastname', 'email', 'phone', 'company', 'lifecyclestage', 'hs_lead_status', 'hs_owner_id', 'address', 'city', 'state', 'zip', 'photo_url'],
        limit: 100
      }

      let allContacts = []
      let after = null
      const MAX_PAGES = 20

      for (let page = 0; page < MAX_PAGES; page++) {
        const body = after ? { ...requestBody, after } : requestBody
        const response = await fetch(HS_SEARCH_URL, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        const data = await response.json()
        if (!response.ok) {
          console.error('[contacts] HubSpot error:', response.status, data)
          break
        }
        console.log(`[contacts] page ${page + 1}: got ${data.results?.length ?? 0} contacts (total so far: ${allContacts.length + (data.results?.length ?? 0)})`)
        allContacts = allContacts.concat(data.results || [])
        after = data.paging?.next?.after ?? null
        if (!after) break
      }

      let contacts = allContacts

      if (locations) {
        const locationValues = locations.split(',').map(l => l.trim()).filter(Boolean)
        if (locationValues.length > 0) {
          const variants = locationValues.map(resolveVariant)
          contacts = contacts.filter(c => contactMatchesLocations(c.properties, variants))
        }
      }

      reply.send({ results: contacts })

    } catch (err) {
      reply.status(500).send({ error: 'Failed to fetch contacts', detail: err.message })
    }
  })
}
