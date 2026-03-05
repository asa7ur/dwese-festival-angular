import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageResponse} from '../../models/page-response.model';
import {Stage} from '../../models/stage.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class StageService {
  private apiUrl = `${environment.apiUrl}/stages`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10, keyword: string = '', sortBy: string = 'id', direction: string = 'asc'): Observable<PageResponse<Stage>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('keyword', keyword)
      .set('sort', `${sortBy},${direction}`);

    return this.http.get<PageResponse<Stage>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Stage> {
    return this.http.get<Stage>(`${this.apiUrl}/${id}`);
  }

  create(stage: Stage): Observable<Stage> {
    return this.http.post<Stage>(this.apiUrl, stage);
  }

  update(id: number, stage: Stage): Observable<Stage> {
    return this.http.put<Stage>(`${this.apiUrl}/${id}`, stage);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
