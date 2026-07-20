import { useState, useEffect } from 'react'
import { fetchCodingStats } from './hackatime' 
//BrowserRouter enables routing between pages in the app, decides which page to show based on current URL
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import RollPage from './pages/RollPage'
import CollectionPage from './pages/CollectionPage'
import CreatureDetailPage from './pages/CreatureDetailPage'
//CSS imports globally to the whole page (always rendered because it wraps to every route)
import './App.css'

function App() {
  //declaring it in App.jsx moves the collection state up to the App component so it can be shared between RollPage and CollectionPage, instead of being local to RollPage
  const [collection, setCollection] = useState(() => {
    //persist the collection to localstorage (not lost on refresh) and load it from localstorage on app start
    const savedCollection = localStorage.getItem('collection')
    return savedCollection ? JSON.parse(savedCollection) : []
  }) //close useState

  //useEffect runs after every render, so it can be used to persist the collection to localstorage whenever it changes
  useEffect(() => {
    localStorage.setItem('collection', JSON.stringify(collection))
  }, [collection])

  //moves the codingStats state up to the App component (similarly to the others)
  const [codingStats, setCodingStats] = useState(null)
  
  useEffect(() => {
    fetchCodingStats()
      .then(data => setCodingStats(data))
      .catch(error => console.error(error))
  }, [])

  //compute currency as dervied state
  //following derived values calculate total minutes coded and total pulls earned based on the codingStats data fetched from Hackatime API (freshly fetched data is stored in codingStats state variable, which is updated when the fetchCodingStats function resolves successfully)
  const MINUTES_PER_PULL = 10

  const totalMinutesCoded = codingStats
    ? Math.floor(codingStats.data.total_seconds / 60)
    : 0

  const totalPullsEarned = Math.floor(totalMinutesCoded / MINUTES_PER_PULL)
  
  //track how many pulls have already been spent and persist it to local storage
  const [pullsSpent, setPullsSpent] = useState(() => {
    const saved = localStorage.getItem('codepull-pulls-spent')
    return saved ? Number(saved) : 0
  })

  useEffect(() => {
    localStorage.setItem('codepull-pulls-spent', pullsSpent)
  }, [pullsSpent])
  
  //calculate pulls available by subtracting pulls spent from total pulls earned
  const pullsAvailable = totalPullsEarned - pullsSpent

  function spendPull() {
    setPullsSpent((prev) => prev + 1)
  }

  //creating new array with the new creature added to the end of the previous collection
  function addToCollection(creature) {
    setCollection(prevCollection => [...prevCollection, creature])
  }

  //daily bonus pull state
  const [lastClaimDate, setLastClaimDate] = useState(() => {
    return localStorage.getItem('last-claim-date') || null
  })

  const today = new Date().toDateString() //logic only depends on calendar day
  const canClaimDaily = lastClaimDate !== today

  function claimDailyBonus() {
    setPullsSpent((prev) => prev - 1) //instead of creating a new state variable for daily bonus pulls, we can just subtract 1 from pullsSpent to give the user an extra pull
    setLastClaimDate(today)
    localStorage.setItem('last-claim-date', today)
  }
  
  // favouriting creatures state
  //favourites are an array of indexes in the collection array
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])
  //toggleFavorite function uses a ternary (compact if then statement) to check if it is already favorited
  function toggleFavorite(index) {
    setFavorites((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    )
  }
  return (
    <BrowserRouter>
    {/* render as <a> tags, clicking them changes the URL without reloading the page, instead by swapping components (renders a differrent screen, without asking the browser to fetch a whole new HTML page) */}
      <nav>
        <Link to="/">Roll</Link>
        <Link to="/collection">Collection</Link>
      </nav>

      {/*temporary debug tool*/}
      {/*{codingStats && <pre>{JSON.stringify(codingStats, null, 2)}</pre>}*/}

      <Routes>
        {/*passing the property (prop) to the RollPage*/}
        <Route path="/" element={<RollPage 
              //pass balance information down to RollPage
              addToCollection={addToCollection} 
              pullsAvailable={pullsAvailable} 
              spendPull={spendPull} 
              totalMinutesCoded={totalMinutesCoded}
              canClaimDaily={canClaimDaily}
              claimDailyBonus={claimDailyBonus}
            />
          } 
        /> {/*closes route for RollPage*/}
        
        {/*passing the property (prop) to the CollectionPage*/}
        <Route path="/collection" element={<CollectionPage
              collection={collection}
              //pass favourites down to CollectionPage
              favorites={favorites}
              toggleFavorite={toggleFavorite} 
            />
          } 
        />
        
        {/*passing the property to creatureDetailPage,id is a dynamic parameter, can be any value, used to identify which creature to show details for*/}
        <Route path="/creature/:id" element={<CreatureDetailPage collection={collection} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App