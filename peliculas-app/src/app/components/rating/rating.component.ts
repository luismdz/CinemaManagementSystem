import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../auth/auth.service';
import Swal from 'sweetalert2';
import { User } from '../../auth/models/user.model';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {
  @Input() rating: number = 0;
  @Input() starCount = 5;
  @Output() rated: EventEmitter<number> = new EventEmitter<number>();

  starArr: number[] = [];
  private ratingBefore = 0;
  private user: User;

  constructor(private authSvc: AuthService) {}

  ngOnInit(): void {
    this.starArr = Array(this.starCount).fill(0);
    this.ratingBefore = this.rating;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  handleMouseEnter(index: number) {
    this.rating = index + 1;
  }

  handleMouseLeave() {
    if (this.ratingBefore !== 0) {
      this.rating = this.ratingBefore;
    } else {
      this.rating = 0;
    }
  }

  rate(rating: number) {
    this.user = this.authSvc.user$.value;

    if (this.user.isLoggedIn) {
      this.rating = rating;
      this.ratingBefore = this.rating;
      this.rated.emit(this.rating);
    } else {
      Swal.fire({
        title: 'Usuario no autentificado',
        text: 'Debe iniciar sesion para emitir su voto',
        icon: 'error',
      });
    }
  }
}
