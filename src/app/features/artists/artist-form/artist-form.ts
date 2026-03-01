import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArtistService } from '../../../core/services/artist.service';

@Component({
  selector: 'app-artist-form',
  standalone: true,
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

  onSubmit(): void {
    if (this.artistForm.valid) {
      const formData = new FormData();
      const artistData = this.artistForm.value;

      formData.append('name', artistData.name);
      formData.append('genre', artistData.genre);
      formData.append('country', artistData.country);

      const file = this.selectedFile();
      if (file) {
        formData.append('image', file);
      }

      const id = this.artistId();

      const request = (this.isEditMode() && id)
        ? this.artistService.update(id, formData)
        : this.artistService.create(formData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/artists']);
        },
        error: (err) => {
          console.error('Error al guardar el artista', err);
        }
      });
    }
  }
}
