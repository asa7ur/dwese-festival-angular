import {Component, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArtistService } from '../../../core/services/artist.service'
import { Artist } from '../../../models/artist.model';

@Component({
  selector: 'app-artist-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: 'artist-list.html'
})
export class ArtistListComponent implements OnInit {
  artists = signal<Artist[]>([]);
  keyword = signal<string>('');
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  pageSize = 6;
  sortBy = signal<string>('name');
  sortDirection = signal<string>('asc');

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  // Método principal para cargar los datos desde el Backend
  loadArtists(): void {
    this.artistService.getAll(
      this.currentPage(),
      this.pageSize,
      this.keyword(),
      this.sortBy(),
      this.sortDirection()
    )
      .subscribe({
        next: (response) => {
          this.artists.set(response.content);
          this.totalPages.set(response.totalPages);
        },
        error: (err) => {
          console.error('Error al cargar artistas', err);
        }
      });
  }

  // Función para manejar la búsqueda
  onSearch(): void {
    this.currentPage.set(0); // Reiniciar a la primera página al buscar
    this.loadArtists();
  }

  // Función para cambiar de página
  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadArtists();
  }

  getPagesArray(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }

  // Método para borrar un artista
  deleteArtist(id: number | undefined): void {
    if (id && confirm('¿Estás seguro de que quieres eliminar este artista?')) {
      this.artistService.delete(id).subscribe({
        next: () => {
          this.loadArtists(); // Recargar la lista tras borrar
        },
        error: (err) => {
          alert('No se pudo borrar el artista. Es posible que tenga conciertos asociados.');
        }
      });
    }
  }
}
