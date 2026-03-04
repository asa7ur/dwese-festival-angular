import {Component, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArtistService } from '../../../core/services/artist.service'
import { Artist } from '../../../models/artist.model';
import {Concert} from '../../../models/concert.model';
import {ConcertService} from '../../../core/services/concert.service';

@Component({
  selector: 'app-concert-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: 'concert-list.html'
})
export class ConcertListComponent implements OnInit {
  concerts = signal<Concert[]>([]);
  keyword = signal<string>('');
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  pageSize = 6;
  sortBy = signal<string>('name');
  sortDirection = signal<string>('asc');

  constructor(private concertService: ConcertService) {}

  ngOnInit(): void {
    this.loadConcerts();
  }

  // Método principal para cargar los datos desde el Backend
  loadConcerts(): void {
    this.concertService.getAll(
      this.currentPage(),
      this.pageSize,
      this.keyword(),
      this.sortBy(),
      this.sortDirection()
    )
      .subscribe({
        next: (response) => {
          this.concerts.set(response.content);
          this.totalPages.set(response.totalPages);
        },
        error: (err) => {
          console.error('Error al cargar conciertos', err);
        }
      });
  }

  // Función para manejar la búsqueda
  onSearch(): void {
    this.currentPage.set(0); // Reiniciar a la primera página al buscar
    this.loadConcerts();
  }

  // Función para cambiar de página
  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadConcerts();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  // Método para borrar un artista
  deleteConcert(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de que quieres eliminar este concierto?')) {
      this.concertService.delete(id).subscribe({
        next: () => {
          this.loadConcerts(); // Recargar la lista tras borrar
        },
        error: (err) => {
          alert('No se pudo borrar el concierto. Es posible que tenga artistas o escenarios asociados.');
        }
      });
    }
  }
}
