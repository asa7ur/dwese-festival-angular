import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Concert } from '../../../models/concert.model';
import { Artist } from '../../../models/artist.model';
import { Stage } from '../../../models/stage.model';
import { ConcertService } from '../../../core/services/concert.service';
import { ArtistService } from '../../../core/services/artist.service';
import { StageService } from '../../../core/services/stage.service';

@Component({
  selector: 'app-concert-form',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './concert-form.html'
})
export class ConcertFormComponent implements OnInit {
  private concertService = inject(ConcertService);
  private artistService = inject(ArtistService);
  private stageService = inject(StageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signal para el objeto concierto vinculado al formulario
  concert = signal<any>({
    startTime: '',
    endTime: '',
    artistId: undefined,
    stageId: undefined
  });

  // Listas para los selectores
  artists = signal<Artist[]>([]);
  stages = signal<Stage[]>([]);

  isEditMode = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    //Cargamos los artistas y escenarios
    this.loadInitialData();

    // Verificamos si la ruta incluye un parámetro 'id' (modo edición)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.loadConcert(+id);
    }
  }

  /**
   * Carga artistas y escenarios para los selectores
   */
  loadInitialData(): void {
    // Cargamos una lista amplia para los selectores (puedes ajustar el size)
    this.artistService.getAll(0, 100).subscribe(res => this.artists.set(res.content));
    this.stageService.getAll(0, 100).subscribe(res => this.stages.set(res.content));
  }

  loadConcert(id: number): void {
    this.concertService.getById(id).subscribe({
      next: (data) => {
        this.concert.set({
          id: data.id,
          startTime: data.startTime,
          endTime: data.endTime,
          artistId: data.artist?.id,
          stageId: data.stage?.id
        });
        },
      error: (err) => {
        console.error('Error al cargar', err);
        this.errorMessage.set('No se pudo cargar la información del concierto.');
      }
    });
  }

  onSubmit(): void {
    const formData = this.concert();
    const concertData: any = {
      ...formData,
      artist: { id: formData.artistId },
      stage: { id: formData.stageId }
    };

    // Decidimos si llamar a update o create
    const request$ = this.isEditMode()
      ? this.concertService.update(formData.id, concertData)
      : this.concertService.create(concertData);

    request$.subscribe({
      next: () => this.router.navigate(['/concerts']),
      error: (err) => {
        console.error('Error al guardar', err);
        this.errorMessage.set('Error al guardar el concierto. Revisa las fechas y selecciones.');
      }
    });
  }

  /**
   * Helper para actualizar campos
   */
  updateField(field: string, value: any): void {
    this.concert.update(prev => ({ ...prev, [field]: value }));
  }
}
