import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/pokemon/components/pokemon-gallery/pokemon-gallery.component')
        .then(m => m.PokemonGalleryComponent)
  },
  {
    path: 'pokemon/:id',
    loadComponent: () =>
      import('./features/pokemon/components/pokemon-gallery/pokemon-gallery.component')
        .then(m => m.PokemonGalleryComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
