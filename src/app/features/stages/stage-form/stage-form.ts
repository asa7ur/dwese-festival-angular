import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Stage } from '../../../models/stage.model';
import { StageService } from '../../../core/services/stage.service';

@Component({
  selector: 'app-stage-form',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stage-form.html'
})
export class StageFormComponent implements OnInit {
  private stageService = inject(StageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signal para el objeto escenario vinculado al formulario
  stage = signal<Stage>( {
    name: '',
    capacity: 0
  });

  // Signals para el estado del formulario
  isEditMode = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Verificamos si la ruta incluye un parámetro 'id' (modo edición)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.loadStage(+id);
    }
  }

  /**
   * Carga los datos del escenario si estamos editando
   */
  loadStage(id: number): void {
    this.stageService.getById(id).subscribe({
      next: (data) => this.stage.set(data),
      error: (err) => {
        console.error('Error al cargar', err);
        this.errorMessage.set('No se pudo cargar la información del escenario.');
      }
    });
  }

  /**
   * Procesa el envío del formulario
   */
  onSubmit(): void {
    const currentStage = this.stage();

    // Decidimos si llamar a update o create
    const request$ = this.isEditMode()
      ? this.stageService.update(currentStage.id!, currentStage)
      : this.stageService.create(currentStage);

    request$.subscribe({
      next: () => {
        // Redirigir a la lista tras el éxito
        this.router.navigate(['/stages']);
      },
      error: (err) => {
        console.error('Error al guardar', err);
        this.errorMessage.set('Error al guardar el escenario. Por favor, revisa los datos.');
      }
    });
  }

  /**
   * Helper para actualizar campos específicos del signal
   */
  updateField(field: keyof Stage, value: any): void {
    this.stage.update(prev => ({ ...prev, [field]: value }));
  }
}
