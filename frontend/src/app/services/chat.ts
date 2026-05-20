import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  id: number;
  username: string;
  message: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = '/api/messages/';

  constructor(private http: HttpClient) {}

  getMessages(): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(this.api);
  }
}