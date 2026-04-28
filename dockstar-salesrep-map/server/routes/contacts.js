export default async function contactRoutes(fastify) {

  fastify.get('/contacts', async (request, reply) => {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      return reply.status(401).send({ error: 'No token provided' })
    }

    const accessToken = authHeader.replace('Bearer ', '')

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
            sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
            properties: ['firstname', 'lastname', 'email', 'phone', 'lifecyclestage', 'hs_lead_status', 'hs_owner_id', 'address', 'city', 'state', 'zip', 'photo_url', 'twitterprofilephoto', 'hs_avatar_filemanager_key'],
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