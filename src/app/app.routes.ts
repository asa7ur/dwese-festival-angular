import { Routes } from '@angular/router';
import {Forbidden} from './features/forbidden/forbidden';
import {Error404} from './features/error404/error404';
import {ArtistListComponent} from './features/artists/artist-list/artist-list';
import {ArtistFormComponent} from './features/artists/artist-form/artist-form';

export const routes: Routes = [
  {
    path: 'artists',
    component: ArtistListComponent,
  },
  {
    path: 'artists/new',
    component: ArtistFormComponent
  },
  {
    path: 'artists/edit/:id',
    component: ArtistFormComponent
  },
  {
    path: 'forbidden',
    component: Forbidden,
  },
  {
    path: "**",
    component: Error404,
  }
];
