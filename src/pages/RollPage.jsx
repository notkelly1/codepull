//holds current roll logic
{/*used to remember things between renders instead of forgetting them instantly*/}
import {useState} from 'react' 
import {CREATURES} from '../creatures'

function RollPage({ addToCollection, pullsAvailable, spendPull, totalMinutesCoded, canClaimDaily, claimDailyBonus }) {
  const [stage, setStage] = useState('idle') //rolling gachapon granular state: idle → coin-inserted → twisting → capsule-dropped → capsule-shaking → capsule-open → revealed
  const [selectedCreature, setSelectedCreature] = useState(null)

  //gachapon balls
  const [balls] = useState(() => {
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22']
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      top: Math.random() * 80,
      left: Math.random() * 80,
      size: 20 + Math.random() * 16,
    }))
  })

{/* function that handles the gacha roll, picks a random index into the CREATURES array and calls setSelectedCreature, triggering react to update the UI with new value*/}
    function handleRoll() {
      //check if there are pulls available before allowing a roll
      if (pullsAvailable <= 0) {
        alert('No pulls available! Earn more by coding!')
        return
      }

      setStage('coin-inserted')

      setTimeout(() => setStage('twisting'), 500)

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * CREATURES.length)
        const creature = CREATURES[randomIndex]
        setSelectedCreature(creature)
        setStage('capsule-dropped')
      }, 1400)

      setTimeout(() => setStage('capsule-shaking'), 1900)
    } //end of handleRoll function
    
    function handleOpenCapsule() {
      setStage('capsule-open')
      setTimeout(() => {
        setStage('revealed')
        addToCollection(selectedCreature)
        spendPull()
      }, 400)
    }

    function handleReset() {
      setStage('idle')
      setSelectedCreature(null)
    }

  return (
    <div className="app">
      <h1>Codepull</h1>
      <p style={{ color: 'yellow' }}>DEBUG - current stage: {stage}</p>
      <div className="stats-bar">
        <span>⏱ {totalMinutesCoded}m coded</span>
        <span>🎟 {pullsAvailable} pulls</span>
      </div>
      {canClaimDaily && (
        <button onClick={claimDailyBonus}>Claim Daily Bonus Pull</button>
      )}
      <div className="machine-dome">
        {balls.map((ball) => (
          <div
            key={ball.id}
            className="dome-ball"
            style={{
              backgroundColor: ball.color,
              top: `${ball.top}%`,
              left: `${ball.left}%`,
              width: `${ball.size}px`,
              height: `${ball.size}px`,
            }}
          />
        ))}
        <div className="gachapon-machine">
          {stage === 'idle' && (
            <button onClick={handleRoll} disabled={pullsAvailable <= 0}>
              Insert Coin
            </button>
          )}

          {(stage === 'coin-inserted' || stage === 'twisting') && (
            <div className={`handle ${stage === 'twisting' ? 'turning' : ''}`}>
              🔘
            </div>
          )}

          {/*renders capsule during the stages of capsule-dropped, capsule-shaking, and capsule-open */}
          {(stage === 'capsule-dropped' || stage === 'capsule-shaking' || stage === 'capsule-open') && (
            <div
              className={`capsule-container ${stage === 'capsule-shaking' ? 'shake' : ''} ${stage === 'capsule-open' ? 'opening' : ''}`}
              onClick={stage !== 'capsule-open' ? handleOpenCapsule : undefined}
              style={{ '--capsule-color': selectedCreature ? `var(--color-${selectedCreature.rarity})` : 'var(--color-common)' }}
            >
              <div className="capsule-half top" />
              <div className="capsule-half bottom" />
            </div>
          )}
        </div> {/*close gachapon machine div*/}
      </div> {/*close machine dome div*/}
      {stage === 'revealed' && selectedCreature && (
            <div
              className="result-card"
              style={{ '--rarity-color': `var(--color-${selectedCreature.rarity})` }}
            >
              <img className="creature-image" src={selectedCreature.image} alt={selectedCreature.name} />
              <h2>{selectedCreature.name}</h2>
              <p className="rarity">Rarity: {selectedCreature.rarity}</p>
              <button onClick={handleReset}>Roll Again</button>
            </div> //close result-card div
          )} {/*close revealed stage conditional*/}
    </div>
  ) //close return
}

export default RollPage