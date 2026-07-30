const API_KEY = import.meta.env.VITE_HACKATIME_KEY
const USERNAME = import.meta.env.VITE_HACKATIME_USERNAME

//fetchCodingStats now reads the connected user's own token from localStorage instead of a hardcoded personal key, so this works for any user who's connected their account
export async function fetchCodingStats() {
  //instead of requiring api key and username, only read token to authorize request
  const token = localStorage.getItem('hackatime-token')

  //if no token exists, the user hasn't connected their Hackatime account yet
  if (!token) {
    return null
  }

  //fetch makes an HTTP request to the URL. Note: authenticated endpoint doesn't need a username in the URL, since the token itself identifies which user is asking
  const response = await fetch(
    //switched to per-user endpoint that doesn't require username, since the token itself identifies which user is asking
    'https://hackatime.hackclub.com/api/v1/authenticated/hours',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch Hackatime stats')
  }

  //response.json() parses the response body as JSON and returns a promise that resolves to the parsed data
  const data = await response.json()
  return data
}