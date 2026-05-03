import type { ReactNode } from "react";

export interface Item {
  id: number;
  name: string;
  description: string;
  image?: string;
  height?: number;
  weight?: number;
  types?: string[];
}

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

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other?: {
      "official-artwork"?: {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
}

export interface AppState {
  searchTerm: string;
  items: Item[];
  loading: boolean;
  error: string | null;
}

export interface SearchProps {
  onSearch: (term: string) => void;
  initialSearchTerm?: string;
}

export interface SearchState {
  inputValue: string;
}

export interface ResultsProps {
  items: Item[];
}

export interface CardProps {
  name: string;
  description: string;
  image?: string;
  height?: number;
  weight?: number;
  types?: string[];
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export interface ErrorTestButtonState {
  shouldThrow: boolean;
}
