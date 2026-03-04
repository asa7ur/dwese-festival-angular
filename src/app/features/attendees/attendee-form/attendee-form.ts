import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Attendee } from '../../../models/attendee.model';
import { AttendeeService } from '../../../core/services/attendee.service';

@Component({
  selector: 'app-attendee-form',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './attendee-form.html'
})
export class AttendeeFormComponent implements OnInit {
  private attendeeService = inject(AttendeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signal para el objeto asistente vinculado al formulario
  attendee = signal<Attendee>({
    dni: '',
    name: '',
    email: '',
    phone: ''
  });

  // Signals para el estado del formulario
  isEditMode = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // Verificamos si la ruta incluye un parámetro 'id' (modo edición)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.loadAttendee(+id);
    }
  }

  /**
   * Carga los datos del asistente si estamos editando
   */
  loadAttendee(id: number): void {
    this.attendeeService.getById(id).subscribe({
      next: (data) => this.attendee.set(data),
      error: (err) => {
        console.error('Error al cargar', err);
        this.errorMessage.set('No se pudo cargar la información del asistente.');
      }
    });
  }

  /**
   * Procesa el envío del formulario
   */
  onSubmit(): void {
    const currentAttendee = this.attendee();

    // Decidimos si llamar a update o create
    const request$ = this.isEditMode()
      ? this.attendeeService.update(currentAttendee.id!, currentAttendee)
      : this.attendeeService.create(currentAttendee);

    request$.subscribe({
      next: () => {
        // Redirigir a la lista tras el éxito
        this.router.navigate(['/attendees']);
      },
      error: (err) => {
        console.error('Error al guardar', err);
        this.errorMessage.set('Error al guardar el asistente. Por favor, revisa que los datos sean correctos (el DNI debe ser único).');
      }
    });
  }

  /**
   * Helper para actualizar campos específicos del signal del asistente
   */
  updateField(field: keyof Attendee, value: string): void {
    this.attendee.update(prev => ({ ...prev, [field]: value }));
  }
}
