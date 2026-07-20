//useParams is a react Router (Router is whatever is after the domain in the address bar, like /collection) hook that reads the dynamic part of the URL. useParams always returns a string.
import { useParams, Link } from 'react-router-dom'

function CreatureDetailPage({ collection }) {
  //const{id} destructures the id (reaches into the object returned by useParams and pulls out the id property, which is the dynamic part of the URL) so we can use it directly instead of having to write params.id every time
  const { id } = useParams()

  //collection.find searches the collection array for a creature whose id matches the id from the URL, converting the string to a number for comparison. If no match is found, creature will be undefined.
  const creature = collection.find(
    (c) => c.id === Number(id)
  )

  if (!creature) {
    return (
      <div className="app">
        <p>Creature not found in your collection.</p>
        <Link to="/collection">Back to Collection</Link>
      </div>
    )
  }

  return (
    <div className="app">
      <div
        className="result-card"
        style={{ '--rarity-color': `var(--color-${creature.rarity})` }}
      >
        <div className="emoji">{creature.emoji}</div>
        <h2>{creature.name}</h2>
        <p className="rarity">Rarity: {creature.rarity}</p>
      </div>
      <Link to="/collection">Back to Collection</Link>
    </div>
  )
}

export default CreatureDetailPage