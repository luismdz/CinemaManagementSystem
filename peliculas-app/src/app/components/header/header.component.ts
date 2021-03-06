import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter();
  user: User;

  constructor(public authSvc: AuthService) {}

  ngOnInit(): void {
    this.authSvc.user$.subscribe((resp) => (this.user = resp));
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
