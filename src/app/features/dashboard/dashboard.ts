import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArtistService } from '../../core/services/artist.service';
import { AttendeeService } from '../../core/services/attendee.service';
import { ConcertService } from '../../core/services/concert.service';
import { TicketService } from '../../core/services/ticket.service';
import { Concert } from '../../models/concert.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  // Estadísticas básicas
  totalArtists = signal<number>(0);
  totalConcerts = signal<number>(0);
  totalAttendees = signal<number>(0);
  totalSales = signal<number>(0);

  // Estadísticas de Tickets
  totalTickets = signal<number>(0);
  vipTickets = signal<number>(0);
  generalTickets = signal<number>(0);
  usedTickets = signal<number>(0);

  // Lista de próximos conciertos
  nextConcerts = signal<Concert[]>([]);

  // Cálculos de porcentajes (Signals computados)
  vipPercent = computed(() => this.totalTickets() > 0 ? (this.vipTickets() / this.totalTickets()) * 100 : 0);
  generalPercent = computed(() => this.totalTickets() > 0 ? (this.generalTickets() / this.totalTickets()) * 100 : 0);
  usedPercent = computed(() => this.totalTickets() > 0 ? (this.usedTickets() / this.totalTickets()) * 100 : 0);
  unusedTicketsCount = computed(() => this.totalTickets() - this.usedTickets());

  constructor(
    private artistService: ArtistService,
    private attendeeService: AttendeeService,
    private concertService: ConcertService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Obtenemos los totales desde los metadatos de paginación
    this.artistService.getAll(0, 1).subscribe(res => this.totalArtists.set(res.totalElements));
    this.attendeeService.getAll(0, 1).subscribe(res => this.totalAttendees.set(res.totalElements));
    this.concertService.getAll(0, 3, '', 'startTime', 'asc').subscribe(res => {
      this.totalConcerts.set(res.totalElements);
      this.nextConcerts.set(res.content);
    });

    // Para las estadísticas detalladas de tickets, lo ideal es un endpoint dedicado en el backend.
    // Si no existe, podemos obtener la primera página para el total:
    this.ticketService.getAll(0, 1000).subscribe(res => {
      this.totalTickets.set(res.totalElements);
      const tickets = res.content;

      // Cálculos manuales sobre la muestra (esto debería venir del backend para precisión total)
      this.vipTickets.set(tickets.filter(t => t.type === 'VIP').length);
      this.generalTickets.set(tickets.filter(t => t.type === 'GENERAL').length);
      this.usedTickets.set(tickets.filter(t => t.used).length);
      this.totalSales.set(tickets.reduce((acc, t) => acc + (t.price || 0), 0));
    });
  }
}
