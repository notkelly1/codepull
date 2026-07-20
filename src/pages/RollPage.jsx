//holds current roll logic
{/*used to remember things between renders instead of forgetting them instantly*/}
import {useState} from 'react' 
import {CREATURES} from '../creatures'

function RollPage({ addToCollection, pullsAvailable, spendPull, totalMinutesCoded, canClaimDaily, claimDailyBonus }) {
    const [selectedCreature, setSelectedCreature] = useState(null)

{/* function that handles the gacha roll, picks a random index into the CREATURES array and calls setSelectedCreature, triggering react to update the UI with new value*/}
    function handleRoll() {
      //check if there are pulls available before allowing a roll
      if (pullsAvailable <= 0) {
        alert('No pulls available! Earn more by coding!')
        return
      }
        const randomIndex = Math.floor(Math.random() * CREATURES.length)
        const creature = CREATURES[randomIndex]
        setSelectedCreature(creature)
        addToCollection(creature)
        spendPull() //spend a pull when a roll is made
    }

  return (
    <div className="app">
      <h1>Codepull</h1>
      <p>Total minutes coded: {totalMinutesCoded}</p>
      <p>Pulls available: {pullsAvailable}</p>
      {/* button that calls handleRoll function when clicked, triggering a new gacha roll */}
      <button onClick={handleRoll} disabled={pullsAvailable <= 0}>
        Roll
      </button>
      {/* daily bonus button */}
      {canClaimDaily && (
        <button onClick={claimDailyBonus}>Claim Daily Bonus Pull</button>
      )}
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