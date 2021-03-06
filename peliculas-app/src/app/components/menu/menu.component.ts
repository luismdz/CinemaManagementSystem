import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @Input() mode = 'row';
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
