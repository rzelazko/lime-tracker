import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  userDetails$: Observable<UserData>;
  private auth: AuthService = inject(AuthService);

  constructor() {
    this.userDetails$ = this.auth.userDetails$();
  }

  ngOnInit() {}

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
