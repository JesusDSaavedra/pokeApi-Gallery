import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FavoritePokemon, PokemonCard } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'pokemon-favorites';
  private favoritesSubject = new BehaviorSubject<FavoritePokemon[]>(this.loadFavorites());

  favorites$: Observable<FavoritePokemon[]> = this.favoritesSubject.asObservable();

  /**
   * Carga favoritos desde localStorage
   */
  private loadFavorites(): FavoritePokemon[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  /**
   * Guarda favoritos en localStorage
   */
  private saveFavorites(favorites: FavoritePokemon[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
      this.favoritesSubject.next(favorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  /**
   * Añade un pokémon a favoritos
   */
  addFavorite(pokemon: PokemonCard): void {

    console.log('addFavorite', pokemon);
    const favorites = this.favoritesSubject.value;

    if (!this.isFavorite(pokemon.id)) {
      const newFavorite: FavoritePokemon = {
        ...pokemon,
        addedAt: new Date()
      };
      this.saveFavorites([...favorites, newFavorite]);
    }
  }

  /**
   * Elimina un pokémon de favoritos
   */
  removeFavorite(id: number): void {
    const favorites = this.favoritesSubject.value;
    this.saveFavorites(favorites.filter(f => f.id !== id));
  }

  /**
   * Alterna el estado de favorito
   */
  toggleFavorite(pokemon: any): void {
    console.log('toggleFavorite', pokemon);
    if (this.isFavorite(pokemon.id)) {
      this.removeFavorite(pokemon.id);
    } else {
      this.addFavorite(pokemon);
    }
  }

  /**
   * Verifica si un pokémon es favorito
   */
  isFavorite(id: number): boolean {
    return this.favoritesSubject.value.some(f => f.id === id);
  }

  /**
   * Obtiene todos los favoritos
   */
  getFavorites(): FavoritePokemon[] {
    return this.favoritesSubject.value;
  }

  /**
   * Limpia todos los favoritos
   */
  clearFavorites(): void {
    this.saveFavorites([]);
  }
}
