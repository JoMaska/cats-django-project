import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cat {
  id?: number;
  name: string;
  age: number;
  breed: string;
  hairiness: string;
  owner?: number;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class CatService {
  private api = '/api/cats/';

  constructor(private http: HttpClient) {}

  getCats(): Observable<Cat[]> {
    return this.http.get<Cat[]>(this.api);
  }

  getCat(id: number): Observable<Cat> {
    return this.http.get<Cat>(`${this.api}${id}/`);
  }

  createCat(cat: Cat): Observable<Cat> {
    return this.http.post<Cat>(this.api, cat);
  }

  updateCat(id: number, cat: Cat): Observable<Cat> {
    return this.http.put<Cat>(`${this.api}${id}/`, cat);
  }

  deleteCat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}${id}/`);
  }
}