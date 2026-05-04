export default async function authRoutes(fastify) {

  // Redirect to HubSpot login
  fastify.get('/login', async (request, reply) => {
    const params = new URLSearchParams({
      client_id: process.env.HUBSPOT_CLIENT_ID,
      redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
      scope: 'crm.objects.contacts.read crm.objects.contacts.write crm.objects.owners.read crm.lists.read crm.lists.write',
    })
    reply.redirect(`https://app.hubspot.com/oauth/authorize?${params}`)
  })

  // HubSpot redirects back here with a code
  fastify.get('/callback', async (request, reply) => {
    const { code } = request.query

    if (!code) {
      return reply.status(400).send({ error: 'No code provided' })
    }

    try {
      const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.HUBSPOT_CLIENT_ID,
          client_secret: process.env.HUBSPOT_CLIENT_SECRET,
          redirect_uri: process.env.HUBSPOT_REDIRECT_URI,
          code,
        })
      })

      const tokens = await response.json()

      if (tokens.error) {
        return reply.status(400).send(tokens)
      }

      // Fetch token info to get user identity
      const tokenInfoRes = await fetch(
        `https://api.hubapi.com/oauth/v1/access-tokens/${tokens.access_token}`
      )
      const tokenInfo = await tokenInfoRes.json()

      // Fetch owner details for full name
      const ownerRes = await fetch(
        `https://api.hubapi.com/crm/v3/owners/${tokenInfo.user_id}?idProperty=userId`,
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      )
      const ownerData = await ownerRes.json()

      // Store everything server-side in the session
      request.session.tokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      }
      request.session.user = {
        email: tokenInfo.user,
        userId: tokenInfo.user_id,
        hubId: tokenInfo.hub_id,
        firstName: ownerData.firstName ?? '',
        lastName: ownerData.lastName ?? '',
        displayName: `${ownerData.firstName ?? ''} ${ownerData.lastName ?? ''}`.trim(),
      }

      reply.redirect(`http://localhost:5173/auth-success`)

    } catch (err) {
      reply.status(500).send({ error: 'Token exchange failed', detail: err.message })
    }
  })

  // Frontend calls this to get current user
  fastify.get('/me', async (request, reply) => {
    if (!request.session?.user) {
      return reply.status(401).send({ error: 'Not authenticated' })
    }
    reply.send(request.session.user)
  })

  fastify.post('/refresh', async (request, reply) => {
    const refreshToken = request.session.tokens?.refreshToken;
    if (!refreshToken) return reply.status(401).send({ error: 'No refresh token in session' });

    try {
      const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: process.env.HUBSPOT_CLIENT_ID,
          client_secret: process.env.HUBSPOT_CLIENT_SECRET,
          refresh_token: refreshToken,
        }),
      });

      const tokens = await response.json();
      if (tokens.error) return reply.status(400).send(tokens);

      request.session.tokens.accessToken = tokens.access_token;
      if (tokens.refresh_token) request.session.tokens.refreshToken = tokens.refresh_token;

      reply.send({ ok: true });
    } catch (err) {
      reply.status(500).send({ error: 'Token refresh failed', detail: err.message });
    }
  })

  fastify.post('/logout', async (request, reply) => {
    await request.session.destroy()
    reply.send({ ok: true })
  })
}