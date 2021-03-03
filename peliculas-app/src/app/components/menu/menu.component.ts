import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/models/user.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @Input() mode = 'row';
  user: User;

  constructor(public authSvc: AuthService) {}

  ngOnInit(): void {
    this.authSvc.user$.subscribe((resp) => (this.user = resp));
  }
}
