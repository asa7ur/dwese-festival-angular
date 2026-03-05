import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendee } from '../../models/attendee.model';
import { PageResponse } from '../../models/page-response.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendeeService {
  private apiUrl = `${environment.apiUrl}/attendees`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de asistentes con paginación y ordenación.
   */
  getAll(page: number = 0, size: number = 10, keyword: string = '', sortBy: string = 'id', direction: string = 'asc'): Observable<PageResponse<Attendee>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('keyword', keyword)
      .set('sort', `${sortBy},${direction}`);

    return this.http.get<PageResponse<Attendee>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Attendee> {
    return this.http.get<Attendee>(`${this.apiUrl}/${id}`);
  }

  create(attendee: Attendee): Observable<Attendee> {
    return this.http.post<Attendee>(this.apiUrl, attendee);
  }

  update(id: number, attendee: Attendee): Observable<Attendee> {
    return this.http.put<Attendee>(`${this.apiUrl}/${id}`, attendee);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
