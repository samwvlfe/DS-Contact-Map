export default async function contactRoutes(fastify) {

  const STATUS_MAP = {
    'Connected': 'CONNECTED',
    'Attempted': 'ATTEMPTED_TO_CONTACT',
    'New': 'NEW',
  }

  fastify.get('/contacts', async (request, reply) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      return reply.status(401).send({ error: 'No token provided' })
    }

    const accessToken = authHeader.replace('Bearer ', '')
    const { statuses } = request.query

    const filterGroups = []
    if (statuses) {
      const hsStatuses = statuses.split(',').map(s => STATUS_MAP[s.trim()]).filter(Boolean)
      if (hsStatuses.length > 0) {
        filterGroups.push({
          filters: [{ propertyName: 'hs_lead_status', operator: 'IN', values: hsStatuses }]
        })
      }
    }

    try {
      const response = await fetch(
        'https://api.hubapi.com/crm/v3/objects/contacts/search',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filterGroups,
            sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
            properties: ['firstname', 'lastname', 'email', 'phone', 'company', 'lifecyclestage', 'hs_lead_status', 'hs_owner_id', 'address', 'city', 'state', 'zip', 'photo_url', 'twitterprofilephoto', 'hs_avatar_filemanager_key'],
            limit: 100
          })
        }
      )

      const data = await response.json()
      const contacts = data.results || []


      reply.send({ results: contacts })

    } catch (err) {
      reply.status(500).send({ error: 'Failed to fetch contacts', detail: err.message })
    }
  })
}