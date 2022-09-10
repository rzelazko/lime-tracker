import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  userDetails$: Observable<UserData>;

  constructor(private auth: AuthService, private userDetails: UserDetailsService) {
    this.userDetails$ = userDetails.get(auth.user());
  }

  ngOnInit() {}

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }
}
