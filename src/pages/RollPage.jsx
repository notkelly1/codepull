//holds current roll logic
{/*used to remember things between renders instead of forgetting them instantly*/}
import {useState, useEffect, useRef} from 'react' 
import {getRandomCreature, RARE_PITY_THRESHOLD, LEGENDARY_PITY_THRESHOLD } from '../creatures'
//import custom UI
import catHungry from '../assets/cat-hungry.png'
import catFed from '../assets/cat-fed.png'
import handleUp from '../assets/handle-up.png'
import handleTurned from '../assets/handle-turned.png'
import capsulesFrame1 from '../assets/capsules-1.png'
import capsulesFrame2 from '../assets/capsules-2.png'
import capsulesFrame3 from '../assets/capsules-3.png'

/*TEMPORARY TEST — remove after verifying
if (typeof window !== 'undefined' && !window.__pityTested) {
  window.__pityTested = true
  console.log('--- Pity test: pityCounter=0 (should be mostly common) ---')
  for (let i = 0; i < 10; i++) {
    console.log(getRandomCreature(0).rarity)
  }
  console.log('--- Pity test: pityCounter=25 (should ALWAYS be rare or legendary) ---')
  for (let i = 0; i < 10; i++) {
    console.log(getRandomCreature(25).rarity)
  }
  console.log('--- Pity test: pityCounter=95 (should ALWAYS be legendary) ---')
  for (let i = 0; i < 10; i++) {
    console.log(getRandomCreature(95).rarity)
  }
}*/

function RollPage({ addToCollection, pullsAvailable, spendPull, totalMinutesCoded, canClaimDaily, claimDailyBonus, rarePityCounter, setRarePityCounter, legendaryPityCounter, setLegendaryPityCounter, shards, setShards }) {
  const [stage, setStage] = useState('idle') //rolling gachapon granular state: idle → coin-inserted → twisting → capsule-dropped → capsule-shaking → capsule-open → revealed
  const [selectedCreature, setSelectedCreature] = useState(null)
  const [ballFrame, setBallFrame] = useState(0) //current frame of the shaking capsule animation
  const timeoutRef = useRef([]) //ref to hold the timeout ID for clearing later
  //timeoutRef is used to store the IDs of the timeouts so that they can be cleared if the component unmounts (for example, if the user navigates away from roll page mid animation)
  //shake capsules
  const CAPSULE_FRAMES = [capsulesFrame1, capsulesFrame2, capsulesFrame3]
  
  // clears pending timeouts for components
  useEffect(() => {
    return () => {
      timeoutRef.current.forEach(clearTimeout)
    }
  }, []) 

  //cycles frames while shaking
  useEffect(() => {
    if (stage !== 'twisting' && stage !== 'capsule-shaking') return

    const interval = setInterval(() => {
      setBallFrame((prev) => (prev + 1) % CAPSULE_FRAMES.length)
    }, 150) // swap frame every 150ms — tune for shake speed

    return () => clearInterval(interval)
  }, [stage])


{/* function that handles the gacha roll, picks a random index into the CREATURES array and calls setSelectedCreature, triggering react to update the UI with new value*/}
    function handleRoll() {
      //check if there are pulls available before allowing a roll
      if (pullsAvailable <= 0) {
        alert('No pulls available! Earn more by coding!')
        return
      }

      setStage('twisting')

      const dropTimeout = setTimeout(() => {
        const creature = getRandomCreature(rarePityCounter, legendaryPityCounter) //passes the pityCounter to getRandomCreature to influence roll odds based on pity system
        setSelectedCreature(creature)
        setStage('capsule-dropped')

        //update pity counter based on rarity of the creature rolled
        //commit 6: split pity into rare and legendary counters seperately. Previously a single pityCounter was used and reset on any non-common pull, meaning that a rare pull would also wipe legendary pity progress. Now, rarePityCounter and legendaryPityCounter are creaetd to track pity seperately, so obtaning a rare ro legendary would notimpact each tier's respective pity progress. getRandomCreature and handleRoll accept both counters accordingly.
        if (creature.rarity === 'common'){
          setRarePityCounter((prev) => prev + 1)
          setLegendaryPityCounter((prev) => prev + 1)
        } else if (creature.rarity === 'rare') {
          setRarePityCounter(0) //reset pity counter if a rare creature is rolled
          setLegendaryPityCounter((prev) => prev + 1)
        } else if (creature.rarity === 'legendary') {
          setLegendaryPityCounter(0) //reset pity counter if alegendary creature is rolled
        }
      }, 1400) //close the setTimeout for dropping the capsule

      const shakeTimeout = setTimeout(() => setStage('capsule-shaking'), 1900)
      timeoutRef.current.push(dropTimeout, shakeTimeout)
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
  
        <span className={legendaryPityCounter >= LEGENDARY_PITY_THRESHOLD - 3 ? 'warning' : ''}>🍀 Pity: {legendaryPityCounter}/{LEGENDARY_PITY_THRESHOLD}</span> {/*the span gains an extra warning class when the pity counter is within 3 of the legendary pity threshold */}
      </div>
      {/*temporary debug line for pity counter: track pity counter: increment on common pulls, reset on rare/legendary. Adds rarity-based logic to handleRoll so pityCounter is increased with each common pull and resets to 0 when a rare or legendary creature is rolled. Counter is not currently used to influence roll odds. <p>Pity: {legendaryPityCounter}</p>*/}

      {canClaimDaily && (
        <button onClick={claimDailyBonus}>Claim Daily Bonus Pull</button>
      )}
      <div className="machine-dome">
        {/*gachapon balls, positioned to show through the transparent glass on the machine art*/}
        <div className="balls-layer">
          <img src={CAPSULE_FRAMES[ballFrame]} className="capsules-image" alt="" />
        </div>

        <div className="gachapon-machine">
          {stage === 'idle' && (
            <>
              <img 
                src={catHungry}
                className="layer cat-clickable"
                alt="Feed the cat for one pull!"
                onClick={handleRoll}
                style={{cursor: pullsAvailable <= 0 ? 'not-allowed' : 'pointer'}}
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
}//close RollPage function

export default RollPage