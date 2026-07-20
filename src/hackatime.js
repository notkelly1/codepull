const API_KEY = import.meta.env.VITE_HACKATIME_KEY
const USERNAME = import.meta.env.VITE_HACKATIME_USERNAME

//fetchCodingStats is an async function, which means this function as asynchronous, so that it can wait for things that take time (network request) withough freezing the rest of the app. export makes it importable from other files
export async function fetchCodingStats() {
    //fetch makes an HTTP request to the URL
    const response = await fetch(
    `https://hackatime.hackclub.com/api/v1/users/${USERNAME}/stats`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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