import { Routes } from '@angular/router';
import {Forbidden} from './features/forbidden/forbidden';
import {Error404} from './features/error404/error404';
import {ArtistListComponent} from './features/artists/artist-list/artist-list';

export const routes: Routes = [
  {
    path: 'artists',
    component: ArtistListComponent,
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
