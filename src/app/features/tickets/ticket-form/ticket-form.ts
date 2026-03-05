import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Ticket} from '../../../models/ticket.model';
import { Attendee } from '../../../models/attendee.model';
import { TicketService } from '../../../core/services/ticket.service';
import { AttendeeService } from '../../../core/services/attendee.service';

@Component({
  selector: 'app-ticket-form',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ticket-form.html'
})
export class TicketFormComponent implements OnInit {
  private ticketService = inject(TicketService);
  private attendeeService = inject(AttendeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signal para el objeto ticket
  ticket = signal<any>({
    price: 0,
    type: 'GENERAL',
    used: false,
    attendeeId: undefined
  });

  // Lista de asistentes para el selector
  attendees = signal<Attendee[]>([]);
  isEditMode = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAttendees();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.loadTicket(+id);
    }
  }

  loadAttendees(): void {
    // Cargamos asistentes para el select
    this.attendeeService.getAll(0, 100).subscribe({
      next: (res) => this.attendees.set(res.content),
      error: () => this.errorMessage.set('Error al cargar la lista de asistentes.')
    });
  }

  loadTicket(id: number): void {
    this.ticketService.getById(id).subscribe({
      next: (data) => {
        this.ticket.set({
          id: data.id,
          price: data.price,
          type: data.type,
          used: data.used,
          attendeeId: data.attendee?.id
        });
      },
      error: (err) => {
        console.error('Error al cargar ticket', err);
        this.errorMessage.set('No se pudo cargar la información de la entrada.');
      }
    });
  }

  onSubmit(): void {
    const formData = this.ticket();
    const ticketData: any = {
      ...formData,
      attendee: { id: formData.attendeeId }
    };

    const request$ = this.isEditMode()
      ? this.ticketService.update(formData.id, ticketData)
      : this.ticketService.create(ticketData);

    request$.subscribe({
      next: () => this.router.navigate(['/tickets']),
      error: (err) => {
        console.error('Error al guardar', err);
        this.errorMessage.set('Error al procesar la venta de la entrada.');
      }
    });
  }

  /**
   * Helper genérico para actualizar campos (Estilo Attendee)
   */
  updateField(field: keyof Ticket, value: any): void {
    this.ticket.update(prev => ({ ...prev, [field]: value }));
  }
}
