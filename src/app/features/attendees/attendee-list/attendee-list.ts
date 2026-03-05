import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Attendee } from '../../../models/attendee.model';
import { AttendeeService } from '../../../core/services/attendee.service';
import { PageResponse } from '../../../models/page-response.model';

@Component({
  selector: 'app-attendee-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './attendee-list.html'
})
export class AttendeeListComponent implements OnInit {
  attendees = signal<Attendee[]>([]);
  keyword = signal<string>('');
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  pageSize = 6;
  sortBy = signal<string>('id');
  sortDirection = signal<string>('asc');
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private attendeeService: AttendeeService) {}

  ngOnInit(): void {
    this.loadAttendees();
  }

  /**
   * Carga los datos desde el servicio.
   */
  loadAttendees(): void {
    this.attendeeService.getAll(
      this.currentPage(),
      this.pageSize,
      this.keyword(),
      this.sortBy(),
      this.sortDirection()
    ).subscribe({
      next: (response: PageResponse<Attendee>) => {
        this.attendees.set(response.content);
        this.totalPages.set(response.totalPages);
      },
      error: (err) => {
        console.error('Error al cargar asistentes', err);
        this.errorMessage.set('No se pudo cargar la lista de asistentes.');
      }
    });
  }

  // Función para manejar la búsqueda
  onSearch(): void {
    this.currentPage.set(0);
    this.loadAttendees();
  }

  // Función para cambiar de página
  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadAttendees();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  // Método para borrar un asistente
  deleteAttendee(id: number | undefined): void {
    if (id !== undefined && confirm('¿Seguro que quieres eliminar a este asistente?')) {
      this.attendeeService.delete(id).subscribe({
        next: () => {
          this.successMessage.set('Asistente eliminado correctamente.');
          this.loadAttendees();
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: (err) => {
          this.errorMessage.set('Error al eliminar: es posible que tenga entradas asociadas.');
          setTimeout(() => this.errorMessage.set(null), 5000);
        }
      });
    }
  }
}
