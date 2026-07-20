import { useState } from 'react'
//enables routing between pages in the app, decides which page to show based on current URL
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import RollPage from './pages/RollPage'
import CollectionPage from './pages/CollectionPage'
import CreatureDetailPage from './pages/CreatureDetailPage'
//CSS imports globally to the whole page (always rendered because it wraps to every route)
import './App.css'

function App() {
  //moves the collection state up to the App component so it can be shared between RollPage and CollectionPage, instead of being local to RollPage
  const [collection, setCollection] = useState([])
  
  //creating new array with the new creature added to the end of the previous collection
  function addToCollection(creature) {
    setCollection(prevCollection => [...prevCollection, creature])
  }

  return (
    <BrowserRouter>
    {/* render as <a> tags, clicking them changes the URL without reloading the page, instead by swapping components (renders a differrent screen, without asking the browser to fetch a whole new HTML page) */}
      <nav>
        <Link to="/">Roll</Link>
        <Link to="/collection">Collection</Link>
      </nav>

      <Routes>
        <Route path="/" element={<RollPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        {/*id is a dynamic parameter, can be any value, used to identify which creature to show details for*/}
        <Route path="/creature/:id" element={<CreatureDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App