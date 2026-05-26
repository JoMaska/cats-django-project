import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cat {
  id?: number;
  name: string;
  age: number;
  breed: number | string;
  breed_name?: string;
  breed_id?: number;
  hairiness: string;
  owner?: number;
  owner_username?: string;
  created_at?: string;
  likes_count?: number;
  is_liked?: boolean;
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

  getPublicCats(params?: any): Observable<Cat[]> {
    let url = '/api/public/cats/';
    if (params) {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      if (queryParams.toString()) url += `?${queryParams.toString()}`;
    }
    return this.http.get<Cat[]>(url);
  }

  likeCat(catId: number): Observable<any> {
    return this.http.post(`/api/cats/${catId}/like/`, {});
  }

  unlikeCat(catId: number): Observable<any> {
    return this.http.post(`/api/cats/${catId}/unlike/`, {});
  }
  
}