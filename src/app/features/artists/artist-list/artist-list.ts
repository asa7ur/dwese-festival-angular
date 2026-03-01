import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArtistService } from '../../../core/services/artist.service'
import { Artist } from '../../../models/artist.model';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: 'artist-list.html'
})
export class ArtistListComponent implements OnInit {
  artists: Artist[] = [];

  keyword: string = '';
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 6;

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  // Método principal para cargar los datos desde el Backend
  loadArtists(): void {
    this.artistService.getAll(this.currentPage, this.pageSize, this.keyword)
      .subscribe({
        next: (response) => {
          this.artists = response.content;
          this.totalPages = response.totalPages;
        },
        error: (err) => {
          console.error('Error al cargar artistas', err);
        }
      });
  }

  // Función para manejar la búsqueda
  onSearch(): void {
    this.currentPage = 0; // Reiniciar a la primera página al buscar
    this.loadArtists();
  }

  // Función para cambiar de página
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadArtists();
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
