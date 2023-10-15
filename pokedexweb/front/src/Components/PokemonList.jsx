import { PokemonListItem } from "./PokemonListItem";

export function PokemonList({ pokemonData, onEdit }) {
  return (
    <div className="pokemon-grid">
      {pokemonData.map((pokemon) => (
        <PokemonListItem key={pokemon.id} pokemon={pokemon} onEdit={onEdit}/>
      ))}
    </div>
  );
}
