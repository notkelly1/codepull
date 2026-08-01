import emberling from './assets/creatures/emberling.png'
import aqualet from './assets/creatures/aqualet.png'
import sproutle from './assets/creatures/sproutle.png'
import voltbit from './assets/creatures/voltbit.png'
import frostbyte from './assets/creatures/frostbyte.png'
import shadewisp from './assets/creatures/shadewisp.png'

export const CREATURES = [
  { id: 1, name: "Emberling", rarity: "common", image: emberling },
  { id: 2, name: "Aqualet", rarity: "common", image: aqualet },
  { id: 3, name: "Sproutle", rarity: "common", image: sproutle },
  { id: 4, name: "Voltbit", rarity: "rare", image: voltbit },
  { id: 5, name: "Frostbyte", rarity: "rare", image: frostbyte },
  { id: 6, name: "Shadewisp", rarity: "legendary", image: shadewisp },
]

//overall odds per rarity tier (adds up to 100%)
const RARITY_ODDS = {
  common: 0.70,
  rare: 0.25,
  legendary: 0.05,
}

//function that picks a random creature based on rarity odds
export function getRandomCreature() {
  const roll = Math.random()

  //go through the rarity odds and subtract each ones weight from the roll
  let cumulativeProbability = 0
  let chosenRarity = 'common' //default to common in case of rounding errors

  for (const rarity in RARITY_ODDS) {
    cumulativeProbability += RARITY_ODDS[rarity]
    if (roll < cumulativeProbability) {
      chosenRarity = rarity
      break
    }
  }

  //filter the creatures by the chosen rarity
  const pool = CREATURES.filter(creature => creature.rarity === chosenRarity)

  //pick a random creature from the pool
  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex]

} // close the getRandomCreature function