export async function getData() {
  const res = await fetch('https://pokeapi.co/api/v2/type/3');

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
