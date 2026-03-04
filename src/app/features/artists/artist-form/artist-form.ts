import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArtistService } from '../../../core/services/artist.service';

@Component({
  selector: 'app-artist-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './artist-form.html'
})
export class ArtistFormComponent implements OnInit {
  artistForm: FormGroup;

  // Signals para el estado del componente
  isEditMode = signal<boolean>(false);
  artistId = signal<number | undefined>(undefined);
  imagePreview = signal<string | null>(null);
  selectedFile = signal<File | null>(null);

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.artistForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      genre: ['', [Validators.required, Validators.maxLength(100)]],
      country: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.artistId.set(+id);
      this.loadArtist(this.artistId()!);
    }
  }

  loadArtist(id: number): void {
    this.artistService.getById(id).subscribe({
      next: (artist) => {
        this.artistForm.patchValue(artist);
        if (artist.image) {
          this.imagePreview.set(`http://localhost:8080/api/v1/images/${artist.image}`);
        }
      },
      error: (err) => console.error('Error cargando artista', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);

      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview.set(null);
    this.selectedFile.set(null);
    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }


  onSubmit(): void {
    if (this.artistForm.valid) {
      const id = this.artistId();
      const file = this.selectedFile();

      // Creamos el FormData con los datos básicos
      const formData = new FormData();
      formData.append('name', this.artistForm.value.name);
      formData.append('genre', this.artistForm.value.genre);
      formData.append('country', this.artistForm.value.country);
      if (file) formData.append('image', file);

      if (this.isEditMode() && id) {
        // CASO EDICIÓN:
        // Si el usuario eliminó la imagen (no hay preview y no ha subido un archivo nuevo)
        if (!this.imagePreview() && !file) {
          // 1. Primero llamamos al endpoint de borrar imagen del backend
          this.artistService.deleteImage(id).subscribe({
            next: () => {
              // 2. Una vez borrada en el servidor, actualizamos los textos
              this.actualizarArtista(id, formData);
            },
            error: (err) => console.error('Error al borrar imagen', err)
          });
        } else {
          // Actualización normal (con imagen nueva o manteniendo la que había)
          this.actualizarArtista(id, formData);
        }
      } else {
        // CASO CREACIÓN:
        this.artistService.create(formData).subscribe({
          next: () => this.router.navigate(['/artists']),
          error: (err) => console.error('Error al crear', err)
        });
      }
    }
  }

  // Método auxiliar para limpiar el código
  private actualizarArtista(id: number, data: FormData) {
    this.artistService.update(id, data).subscribe({
      next: () => this.router.navigate(['/artists']),
      error: (err) => console.error('Error al actualizar', err)
    });
  }
}
