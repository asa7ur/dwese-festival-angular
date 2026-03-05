import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ticket-list.html'
})
export class TicketListComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  keyword = signal('');
  sortBy = signal('id');
  sortDirection = signal('asc');
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 6;
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getAll(
      this.currentPage(),
      this.pageSize,
      this.keyword(),
      this.sortBy(),
      this.sortDirection()
    ).subscribe({
      next: (response) => {
        this.tickets.set(response.content);
        this.totalPages.set(response.totalPages);
      },
      error: (err) => {
        console.error('Error al cargar entradas', err);
        this.errorMessage.set('No se pudo cargar la lista de entradas.');
      }
    });
  }

  onSearch(): void {
    this.currentPage.set(0); // Reiniciar a la primera página
    this.loadTickets();
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadTickets();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta entrada?')) {
      this.ticketService.delete(id).subscribe({
        next: () =>{
          this.successMessage.set('Entrada eliminada correctamente.');
          this.loadTickets();
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: (err) => {
          this.errorMessage.set('No se pudo borrar la entrada. Es posible que tenga asistente asociado.');
          setTimeout(() => this.errorMessage.set(null), 5000);
        }
      });
    }
  }

}
