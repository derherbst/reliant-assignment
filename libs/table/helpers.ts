import { ModifiedPokemonType, PokemonType } from './types';

function _formatString(inputString: string): string {
  // Replace underscores with spaces
  let formattedString = inputString.replace(/_/g, ' ');
  // Capitalize the first letter of the first word
  formattedString =
    formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
  return formattedString;
}

// prepare data only for the first row where we have selects
export function prepareDataSelect(data: PokemonType): ModifiedPokemonType {
  return {
    name: _formatString(data.name),
    pokemon: data.pokemon.map((el) => ({
      value: el.pokemon.name,
      label: _formatString(el.pokemon.name),
    })),
    damage_relations: Object.keys(data.damage_relations).map((el) => ({
      value: el,
      label: _formatString(el),
    })),
    moves: data.moves.map((el) => ({
      value: el.name,
      label: _formatString(el.name),
    })),
    names: data.names.map((el) => ({
      value: el.name,
      label: el.name,
    })),
  };
}

// prepare data for the rest of the rows
export const makeRestData = (data: PokemonType) => {
  return Array(6)
    .fill({})
    .map((_, idx) => {
      return {
        name: _formatString(data.name),
        pokemon: _formatString(data.pokemon[idx].pokemon.name),
        damage_relations: _formatString(
          Object.keys(data.damage_relations)[idx]
        ),
        moves: _formatString(data.moves[idx].name),
        names: _formatString(data.names[idx].name),
      };
    });
};
