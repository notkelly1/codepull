//holds current roll logic
{/*used to remember things between renders instead of forgetting them instantly*/}
import {useState} from 'react' 
import {CREATURES} from '../creatures'

function RollPage() {
  const [selectedCreature, setSelectedCreature] = useState(null)

  {/* function that handles the gacha roll, picks a random index into the CREATURES array and calls setSelectedCreature, triggering react to update the UI with new value*/}
  function handleRoll() {
    const randomIndex = Math.floor(Math.random() * CREATURES.length)
    setSelectedCreature(CREATURES[randomIndex])
  }

  return (
    <div className="app">
      <h1>Codepull</h1>
      {/* button that calls handleRoll function when clicked, triggering a new gacha roll */}
      <button onClick={handleRoll}>Roll</button>
      {/* if selectedCreature is not null, display the creature's emoji, name, and rarity */}
      {selectedCreature && (
        <div
          //key used so each new creature  is treated as a separate entity, re-triggering the animation
          key={selectedCreature.id}
          className="result-card"
          style={{ '--rarity-color': `var(--color-${selectedCreature.rarity})` }}
        >
          <div className='emoji'>{selectedCreature.emoji}</div>
          <h2>{selectedCreature.name}</h2>
          <p className="rarity">Rarity: {selectedCreature.rarity}</p>
        </div>
      )}
    </div>
  )
}

export default RollPage