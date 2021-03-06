import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rating } from '../models/rating.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private readonly apiUrl = environment.apiURL + '/rating';

  constructor(private http: HttpClient) {}

  rate(userRating: Rating) {
    return this.http.post<Rating>(this.apiUrl, userRating);
  }

  getUserRating(peliculaId: number) {
    return this.http.get(`${this.apiUrl}/${peliculaId}`);
  }
}
