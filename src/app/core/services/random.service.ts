import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomService {
  /**
   * Genera un array de números aleatorios únicos dentro de un rango
   * @param count Cantidad de números a generar
   * @param max Valor máximo (exclusivo)
   * @param min Valor mínimo (inclusivo)
   */
  getRandomNumbers(count: number, max: number, min: number = 1): number[] {
    if (count > (max - min)) {
      throw new Error('Cannot generate more unique numbers than the range allows');
    }

    const numbers = new Set<number>();

    while (numbers.size < count) {
      const random = Math.floor(Math.random() * (max - min)) + min;
      numbers.add(random);
    }

    return Array.from(numbers);
  }

  /**
   * Mezcla un array aleatoriamente usando Fisher-Yates
   */
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  /**
   * Obtiene un elemento aleatorio de un array
   */
  getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
}
