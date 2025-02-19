import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  private apiUrl = 'http://localhost:3000/api/twitter/tweets'; 
  private postTweetUrl = 'http://localhost:3000/api/twitter/tweet';

  constructor(private http: HttpClient) {}

  getTweets(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  postTweet(status: string): Observable<any> {
    return this.http.post<any>(this.postTweetUrl, { status });
  }
}
