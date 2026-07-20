import { Link } from 'react-router-dom'

function CollectionPage({ collection, favorites, toggleFavorite }) {
  return (
    <div className="app">
      <h1>Collection</h1>
      {/*ternary, JS shorthand for if/else inside an expression.*/}
      {collection.length === 0 ? (
        <p>No creatures yet — go roll!</p>
      ) : (
        <div className="collection-grid">
          {/*map transforms every item in the creature array into a component*/}
          {collection.map((creature, index) => (
            <div
              key={index}
              className="collection-item"
              style={{ '--rarity-color': `var(--color-${creature.rarity})` }}
            >
              <Link to={`/creature/${creature.id}`}>
                <div className="emoji">{creature.emoji}</div>
                <p>{creature.name}</p>
              </Link>
              {/*link moved so that clicking star won't navigate */}
              <button onClick={() => toggleFavorite(index)}>
                {favorites.includes(index) ? '★' : '☆'}
              </button>
            </div>
          ))} {/*closes the map*/}
        </div>
      )}
    </div>
  )
}

export default CollectionPage