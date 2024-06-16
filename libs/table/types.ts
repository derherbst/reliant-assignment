export type NameAndTitle = {
  value: string;
  label: string;
};

export type ModifiedPokemonType = {
  [K in keyof Pick<
    PokemonType,
    'damage_relations' | 'moves' | 'pokemon' | 'names' | 'name'
  >]: NameAndTitle[] | string;
};

export interface Type {
  name: string;
  url: string;
}

export interface Generation {
  name: string;
  url: string;
}

export interface Move {
  name: string;
  url: string;
}

export interface Language {
  name: string;
  url: string;
}

export interface Name {
  language: Language;
  name: string;
}

export interface GameIndex {
  game_index: number;
  generation: Generation;
}

export interface MoveDamageClass {
  name: string;
  url: string;
}

export interface Pokemon {
  pokemon: Type;
  slot: number;
}

export interface DamageRelations {
  double_damage_from: Type[];
  double_damage_to: Type[];
  half_damage_from: Type[];
  half_damage_to: Type[];
  no_damage_from: Type[];
  no_damage_to: Type[];
}

export interface PokemonType {
  damage_relations: DamageRelations;
  game_indices?: GameIndex[];
  generation?: Generation;
  id?: number;
  move_damage_class?: MoveDamageClass;
  moves: Move[];
  name: string;
  names: Name[];
  pokemon: Pokemon[];
}
