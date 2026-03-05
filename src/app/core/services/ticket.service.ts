import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../../models/ticket.model';
import { PageResponse } from '../../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de tickets con paginación y ordenación.
   * Basado en la estructura de ArtistService y AttendeeService.
   */
  getAll(
    page: number = 0,
    size: number = 10,
    keyword: string = '',
    sortBy: string = 'id',
    direction: string = 'asc'
  ): Observable<PageResponse<Ticket>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('keyword', keyword)
      .set('sort', `${sortBy},${direction}`);

    return this.http.get<PageResponse<Ticket>>(this.apiUrl, { params });
  }

  /**
   * Obtiene un ticket por su ID.
   */
  getById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo ticket.
   * Nota: El backend espera un TicketCreateDTO con attendeeId.
   */
  create(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  /**
   * Actualiza un ticket existente.
   */
  update(id: number, ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket);
  }

  /**
   * Elimina un ticket.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
