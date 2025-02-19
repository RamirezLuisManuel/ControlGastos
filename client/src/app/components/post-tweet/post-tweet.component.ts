import { Component, OnInit } from '@angular/core';
import { TweetService } from '../../services/tweet.service';
@Component({
  selector: 'app-post-tweet',
  templateUrl: './post-tweet.component.html',
  styleUrl: './post-tweet.component.css'
})
export class PostTweetComponent {
  tweetText: string = '';
  message: string = '';
  tweets: any[] = [];

  constructor(private tweetService: TweetService) {}

  ngOnInit(): void {
    this.loadTweets();
  }

  publishTweet(): void {
    if (this.tweetText.trim()) {
      this.tweetService.postTweet(this.tweetText).subscribe(
        (response) => {
          this.message = 'Tweet publicado con éxito!';
          this.tweetText = ''; // Limpiar campo
          this.loadTweets(); // Recargar tweets
        },
        (error) => {
          this.message = 'Error al publicar el tweet';
        }
      );
    } else {
      this.message = 'El campo no puede estar vacío';
    }
  }

  loadTweets(): void {
    this.tweetService.getTweets().subscribe(
      (response) => {
        this.tweets = response;
      },
      (error) => {
        console.error('Error al obtener los tweets:', error);
      }
    );
  }
}
