import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, catchError, retry, shareReplay, switchMap } from 'rxjs/operators';
import {
  Pokemon,
  PokemonListResponse,
  PokemonCard,
  PokemonDetail,
  PokemonSpeciesDetail,
  EvolutionChain,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly API_BASE = 'https://pokeapi.co/api/v2';
  private readonly cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de pokémon
   */
  getPokemonList(limit: number = 1000): Observable<PokemonListResponse> {
    const cacheKey = `list-${limit}`;

    if (!this.cache.has(cacheKey)) {
      const request$ = this.http
        .get<PokemonListResponse>(`${this.API_BASE}/pokemon?limit=${limit}`)
        .pipe(retry(3), catchError(this.handleError), shareReplay(1));
      this.cache.set(cacheKey, request$);
    }

    return this.cache.get(cacheKey)!;
  }

  /**
   * Obtiene los detalles de un pokémon por ID
   */
  getPokemonById(id: number): Observable<Pokemon> {
    const cacheKey = `pokemon-${id}`;

    if (!this.cache.has(cacheKey)) {
      const request$ = this.http
        .get<Pokemon>(`${this.API_BASE}/pokemon/${id}`)
        .pipe(retry(3), catchError(this.handleError), shareReplay(1));
      this.cache.set(cacheKey, request$);
    }

    return this.cache.get(cacheKey)!;
  }

  /**
   * Obtiene múltiples pokémon por IDs en paralelo
   */
  getMultiplePokemon(ids: number[]): Observable<Pokemon[]> {
    const requests = ids.map((id) => this.getPokemonById(id));
    return forkJoin(requests);
  }

  /**
   * Convierte un Pokémon completo a PokemonCard para la galería
   */
  toPokemonCard(pokemon: Pokemon): PokemonCard {
    return {
      id: pokemon.id,
      name: pokemon.name,
      displayName: this.normalizeString(pokemon.name),
      image:
        pokemon.sprites.other['official-artwork'].front_default ||
        pokemon.sprites.front_default,
      types: pokemon.types.map((t) => t.type.name),
      abilities: pokemon.abilities
        .filter((a) => !a.is_hidden)
        .slice(0, 3)
        .map((a) => this.normalizeString(a.ability.name)),
    };
  }

  /**
   * Obtiene detalles completos de un pokémon incluyendo especie y evoluciones
   */
  getPokemonDetail(id: number): Observable<PokemonDetail> {
    return this.getPokemonById(id).pipe(
      switchMap((pokemon) => {
        return forkJoin({
          pokemon: of(pokemon),
          species: this.getPokemonSpecies(id),
          evolution: this.getPokemonSpecies(id).pipe(
            switchMap((species) =>
              this.getEvolutionChain(species.evolution_chain.url)
            )
          ),
        });
      }),
      map(({ pokemon, species, evolution }) => {
        const description = this.getFlavorText(species);
        const category = this.getCategory(species);
        const evolutionChain = this.extractEvolutionNames(evolution.chain);

        return {
          ...pokemon,
          displayName: this.normalizeString(pokemon.name),
          description,
          category,
          evolutionChain,
          aiDescription: this.generateAIDescription(pokemon, description),
        };
      }),
      catchError((error) => {
        console.error('Error getting pokemon detail:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene información de la especie del pokémon
   */
  private getPokemonSpecies(id: number): Observable<PokemonSpeciesDetail> {
    const cacheKey = `species-${id}`;

    if (!this.cache.has(cacheKey)) {
      const request$ = this.http
        .get<PokemonSpeciesDetail>(`${this.API_BASE}/pokemon-species/${id}`)
        .pipe(retry(3), catchError(this.handleError), shareReplay(1));
      this.cache.set(cacheKey, request$);
    }

    return this.cache.get(cacheKey)!;
  }

  /**
   * Obtiene la cadena de evolución
   */
  private getEvolutionChain(url: string): Observable<EvolutionChain> {
    const cacheKey = `evolution-${url}`;

    if (!this.cache.has(cacheKey)) {
      const request$ = this.http
        .get<EvolutionChain>(url)
        .pipe(retry(3), catchError(this.handleError), shareReplay(1));
      this.cache.set(cacheKey, request$);
    }

    return this.cache.get(cacheKey)!;
  }

  /**
   * Extrae nombres de pokémon de la cadena de evolución
   */
  private extractEvolutionNames(chain: any): string[] {
    const names: string[] = [];
    let current = chain;

    while (current) {
      names.push(this.normalizeString(current.species.name));
      current = current.evolves_to?.[0];
    }

    return names;
  }

  /**
   * Obtiene el texto de descripción en español o inglés
   */
  private getFlavorText(species: PokemonSpeciesDetail): string {
    const esEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === 'es'
    );

    const enEntry = species.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    );

    const text = (esEntry || enEntry)?.flavor_text || '';
    return text.replace(/\f/g, ' ').replace(/\n/g, ' ').trim();
  }

  /**
   * Obtiene la categoría del pokémon
   */
  private getCategory(species: PokemonSpeciesDetail): string {
    const esGenus = species.genera.find((g) => g.language.name === 'es');
    const enGenus = species.genera.find((g) => g.language.name === 'en');
    return (esGenus || enGenus)?.genus || '';
  }

  /**
   * Genera una descripción con IA (mock por ahora)
   */
  private generateAIDescription(
    pokemon: Pokemon,
    originalDesc: string
  ): string {
    const types = pokemon.types
      .map((t) => this.normalizeString(t.type.name))
      .join(' y ');
    const mainAbility = this.normalizeString(
      pokemon.abilities[0]?.ability.name || ''
    );

    return (
      `${this.normalizeString(
        pokemon.name
      )} es un Pokémon de tipo ${types}. ${originalDesc} ` +
      `Sus estadísticas destacan en ${this.getTopStat(
        pokemon
      )}, y su habilidad principal ` +
      `es ${mainAbility}, lo que lo hace único en combate.`
    );
  }

  /**
   * Obtiene la estadística más alta
   */
  private getTopStat(pokemon: Pokemon): string {
    const topStat = pokemon.stats.reduce((prev, current) =>
      prev.base_stat > current.base_stat ? prev : current
    );
    return this.normalizeString(topStat.stat.name);
  }

  /**
   * Normaliza un string: primera letra mayúscula, reemplaza guiones por espacios
   */
  normalizeString(str: string): string {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Maneja errores de HTTP
   */
  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);

    let errorMessage = 'Ha ocurrido un error al cargar los datos';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }

  /**
   * Limpia el caché
   */
  clearCache(): void {
    this.cache.clear();
  }
}
