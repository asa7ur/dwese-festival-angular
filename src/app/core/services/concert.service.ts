import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageResponse} from '../../models/page-response.model';
import {Concert} from '../../models/concert.model';

@Injectable({
  providedIn: 'root',
})

export class ConcertService {
  private apiUrl = 'http://localhost:8080/api/v1/concerts';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10, keyword: string = '', sortBy: string = 'id', direction: string = 'asc'): Observable<PageResponse<Concert>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('keyword', keyword)
      .set('sort', `${sortBy},${direction}`);

    return this.http.get<PageResponse<Concert>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Concert> {
    return this.http.get<Concert>(`${this.apiUrl}/${id}`);
  }

  create(concert: Concert): Observable<Concert> {
    return this.http.post<Concert>(this.apiUrl, concert);
  }

  update(id: number, concert: Concert): Observable<Concert> {
    return this.http.put<Concert>(`${this.apiUrl}/${id}`, concert);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
