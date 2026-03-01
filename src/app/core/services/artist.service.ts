// src/app/services/artist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist } from '../../models/artist.model'
import { PageResponse } from '../../models/page-response.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'http://localhost:8080/api/v1/artists';

  constructor(private http: HttpClient) {}

  // Obtener todos con paginación y búsqueda
  getAll(page: number = 0, size: number = 10, keyword: string = '', sortBy: string = 'name', direction: string = 'asc'): Observable<PageResponse<Artist>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('keyword', keyword)
      .set('sortBy', sortBy)
      .set('direction', direction);

    return this.http.get<PageResponse<Artist>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/${id}`);
  }

  create(artistData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, artistData);
  }

  update(id: number, artistData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, artistData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/image`);
  }
}
