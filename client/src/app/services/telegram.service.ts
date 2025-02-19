import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {
  private apiUrl = 'http://localhost:3000/api/telegram/simulate'; 

  constructor(private http: HttpClient) { }

  sendMessage(chatId: string, message: string): Observable<any> {
    return this.http.post(this.apiUrl, { chatId, message });
  }
}
