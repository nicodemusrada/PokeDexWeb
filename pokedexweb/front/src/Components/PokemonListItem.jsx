import { API_BASE_URL } from "../../ApiConfig";

export function PokemonListItem({ pokemon, onEdit }) {
    const handleCardClick = () => {
      onEdit(pokemon);
    }

  return (
    <div className="pokemon-card" onClick={handleCardClick}>
      <img
        src={API_BASE_URL + pokemon.thumbnail_url}
        alt={pokemon.english_name}
        className="pokemon-list-item-thumbnail"
      />
      <h3 className="pokemon-name">{pokemon.english_name}</h3>
      <div className="pokemon-types">
        {pokemon.types.map((type, index) => (
          <span key={index} className="pokemon-type">
            {type}
          </span>   
        ))}
      </div>
    </div>
  );
}
