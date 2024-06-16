import { Table } from '@/libs/table/components/table';
import { ModifiedPokemonType, PokemonType } from '@/libs/table/types';
import RootLayout from './layout';

function formatString(inputString: string): string {
  // Replace underscores with spaces
  let formattedString = inputString.replace(/_/g, ' ');
  // Capitalize the first letter of the first word
  formattedString =
    formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
  return formattedString;
}

function prepareData(data: PokemonType): ModifiedPokemonType {
  return {
    pokemon: data.pokemon.map((el) => ({
      value: el.pokemon.name,
      label: formatString(el.pokemon.name),
    })),
    damage_relations: Object.keys(data.damage_relations).map((el) => ({
      value: el,
      label: formatString(el),
    })),
    moves: data.moves.map((el) => ({
      value: el.name,
      label: formatString(el.name),
    })),
    name: formatString(data.name),
    names: data.names.map((el) => ({
      value: el.name,
      label: el.name,
    })),
  };
}

async function getData() {
  const res = await fetch('https://pokeapi.co/api/v2/type/3');
  console.log('🚀 ~ getData ~ res:', res);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Page() {
  const data: PokemonType = await getData();

  return (
    <RootLayout>
      <div className="bg-white h-screen">
        <Table initialData={prepareData(data)} />
      </div>
    </RootLayout>
  );
}
