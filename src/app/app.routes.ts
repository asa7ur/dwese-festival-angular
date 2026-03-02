import { Routes } from '@angular/router';
import {Forbidden} from './features/forbidden/forbidden';
import {Error404} from './features/error404/error404';
import {ArtistListComponent} from './features/artists/artist-list/artist-list';
import {ArtistFormComponent} from './features/artists/artist-form/artist-form';
import {LoginComponent} from './features/auth/login/login';
import {guestGuard} from './core/guards/guest-guard';
import {authGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'artists',
    component: ArtistListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'artists/new',
    component: ArtistFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'artists/edit/:id',
    component: ArtistFormComponent,
    canActivate: [authGuard]
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
