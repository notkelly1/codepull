//dotenv package to force load .env.local file so that the environment variables are available in this serverless function
import dotenv from 'dotenv'
dotenv.config({path: '.env.local'})

//setting up oauth so that other users can bind their own hackatime accounts
export default async function handler(req, res) { //Vercel's required shape for a serverless function (receives incoming request and sends a response)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  console.log('req.body:', req.body)
  console.log('client_id present:', !!process.env.HACKATIME_CLIENT_ID)
  console.log('client_secret present:', !!process.env.HACKATIME_CLIENT_SECRET)

  //req.body is the data that the frontend will send (authorization code in this case)
  const { code } = req.body || {}

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' })
  }

  try {
    const response = await fetch('https://hackatime.hackclub.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.HACKATIME_CLIENT_ID,
        client_secret: process.env.HACKATIME_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.HACKATIME_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({ error: data })
    }

    return res.status(200).json({ access_token: data.access_token })
  } catch (error) {
    console.error('Token exchange error:', error)
    return res.status(500).json({ error: error.message })
  }
}