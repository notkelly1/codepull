//holds current roll logic
{/*used to remember things between renders instead of forgetting them instantly*/}
import {useState} from 'react' 
import {CREATURES} from '../creatures'
//import custom UI
import catHungry from '../assets/cat-hungry.png'
import catFed from '../assets/cat-fed.png'
import handleUp from '../assets/handle-up.png'
import handleTurned from '../assets/handle-turned.png'

function RollPage({ addToCollection, pullsAvailable, spendPull, totalMinutesCoded, canClaimDaily, claimDailyBonus }) {
  const [stage, setStage] = useState('idle') //rolling gachapon granular state: idle → coin-inserted → twisting → capsule-dropped → capsule-shaking → capsule-open → revealed
  const [selectedCreature, setSelectedCreature] = useState(null)

  /*gachapon balls
  const [balls] = useState(() => {
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#e67e22']
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      top: Math.random() * 80,
      left: Math.random() * 80,
      size: 20 + Math.random() * 16,
    }))
  })*/

{/* function that handles the gacha roll, picks a random index into the CREATURES array and calls setSelectedCreature, triggering react to update the UI with new value*/}
    function handleRoll() {
      //check if there are pulls available before allowing a roll
      if (pullsAvailable <= 0) {
        alert('No pulls available! Earn more by coding!')
        return
      }

        setStage('twisting')

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
      <div className="stats-bar">
        <span>⏱ {totalMinutesCoded}m coded</span>
        <span>🎟 {pullsAvailable} pulls</span>
      </div>
      {canClaimDaily && (
        <button onClick={claimDailyBonus}>Claim Daily Bonus Pull</button>
      )}
      <div className="machine-dome">
        {/*gachapon balls, positioned to show through the transparent glass on the machine art*/}
        <div className="balls-layer">
          <div className="dome-ball" style={{ background: '#e74c3c', top: '25%', left: '35%' }} />
          <div className="dome-ball" style={{ background: '#3498db', top: '30%', left: '50%' }} />
          <div className="dome-ball" style={{ background: '#f1c40f', top: '35%', left: '42%' }} />
        </div>

        <div className="gachapon-machine">
          {stage === 'idle' && (
            <>
              <img 
                src={catHungry}
                className="layer cat-clickable"
                alt="Feed the cat for one pull!"
                onClick={handleRoll}
                style={{cursor: pullsAvailable <= 0 ? 'not-allowed' : 'pointer', opacity: pullsAvailable <= 0 ? 0.5 : 1}}
              />
              <img src={handleUp} className="layer" alt="Handle" />
            </>
          )} {/*close idle stage conditional*/}

          {(stage === 'twisting' || stage === 'capsule-dropped' || stage === 'capsule-shaking' || stage === 'capsule-open' || stage === 'revealed') && (
            <>
              <img src={catFed} className="layer" alt="Cat fed" />
              <img src={handleTurned} className="layer" alt="Handle turned" />
            </>
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

          {/*renders the revealed creature card over top of the gachapon machine asset */}
          {stage === 'revealed' && selectedCreature && (
            <div
              className="result-card result-card-overlay"
              style={{ '--rarity-color': `var(--color-${selectedCreature.rarity})` }}
            >
              <img className="creature-image" src={selectedCreature.image} alt={selectedCreature.name} />
              <h2>{selectedCreature.name}</h2>
              <p className="rarity">Rarity: {selectedCreature.rarity}</p>
              <button onClick={handleReset}>Roll Again</button>
            </div>
          )}
        </div> {/*close gachapon machine div*/}
      </div> {/*close machine dome div*/}
    </div>
  )//close return
}

export default RollPage