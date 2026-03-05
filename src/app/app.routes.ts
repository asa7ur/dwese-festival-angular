import { Routes } from '@angular/router';
import {Forbidden} from './features/forbidden/forbidden';
import {Error404} from './features/error404/error404';
import {ArtistListComponent} from './features/artists/artist-list/artist-list';
import {ArtistFormComponent} from './features/artists/artist-form/artist-form';
import {LoginComponent} from './features/auth/login/login';
import {guestGuard} from './core/guards/guest-guard';
import {authGuard} from './core/guards/auth-guard';
import {AttendeeListComponent} from './features/attendees/attendee-list/attendee-list';
import {AttendeeFormComponent} from './features/attendees/attendee-form/attendee-form';
import {ConcertListComponent} from './features/concerts/concert-list/concert-list';
import {ConcertFormComponent} from './features/concerts/concert-form/concert-form';
import {TicketListComponent} from './features/tickets/ticket-list/ticket-list';
import {TicketFormComponent} from './features/tickets/ticket-form/ticket-form';
import {StageListComponent} from './features/stages/stage-list/stage-list';
import {StageFormComponent} from './features/stages/stage-form/stage-form';
import {DashboardComponent} from './features/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard]},

  // Rutas de artistas
  { path: 'artists', component: ArtistListComponent, canActivate: [authGuard]},
  { path: 'artists/new', component: ArtistFormComponent, canActivate: [authGuard]},
  { path: 'artists/edit/:id', component: ArtistFormComponent, canActivate: [authGuard]},

  // Rutas de asistentes
  { path: 'attendees', component: AttendeeListComponent, canActivate: [authGuard]},
  { path: 'attendees/new', component: AttendeeFormComponent, canActivate: [authGuard] },
  { path: 'attendees/edit/:id', component: AttendeeFormComponent, canActivate: [authGuard] },

  // Rutas de asistentes
  { path: 'concerts', component: ConcertListComponent, canActivate: [authGuard]},
  { path: 'concerts/new', component: ConcertFormComponent, canActivate: [authGuard] },
  { path: 'concerts/edit/:id', component: ConcertFormComponent, canActivate: [authGuard] },

  // Rutas de entradas
  { path: 'tickets', component: TicketListComponent, canActivate: [authGuard]},
  { path: 'tickets/new', component: TicketFormComponent, canActivate: [authGuard] },
  { path: 'tickets/edit/:id', component: TicketFormComponent, canActivate: [authGuard] },

  // Rutas de escenarios
  { path: 'stages', component: StageListComponent, canActivate: [authGuard]},
  { path: 'stages/new', component: StageFormComponent, canActivate: [authGuard] },
  { path: 'stages/edit/:id', component: StageFormComponent, canActivate: [authGuard] },

  { path: 'forbidden', component: Forbidden },
  { path: "**", component: Error404 }
];
