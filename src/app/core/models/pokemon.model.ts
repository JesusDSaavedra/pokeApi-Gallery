// Modelos para PokéAPI

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  displayName: string;
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  height: number;
  weight: number;
  species: PokemonSpecies;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string;
  front_shiny: string;
  other: {
    'official-artwork': {
      front_default: string;
    };
    dream_world: {
      front_default: string;
    };
  };
}

export interface PokemonSpecies {
  name: string;
  url: string;
}

export interface PokemonSpeciesDetail {
  flavor_text_entries: FlavorTextEntry[];
  evolution_chain: {
    url: string;
  };
  genera: Genera[];
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

export interface Genera {
  genus: string;
  language: {
    name: string;
    url: string;
  };
}

export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}

export interface ChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: ChainLink[];
}

// Modelo simplificado para la galería
export interface PokemonCard {
  id: number;
  name: string;
  displayName: string;
  image: string;
  types: string[];
  abilities: string[];
}

// Modelo completo para el detalle
export interface PokemonDetail extends Pokemon {
  description?: string;
  aiDescription?: string;
  evolutionChain?: string[];
  category?: string;
}

// Estado de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Favoritos
export interface FavoritePokemon extends PokemonCard {
  addedAt: Date;
}
