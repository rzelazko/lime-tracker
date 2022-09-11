import { Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  userDetails$: Observable<UserData>;

  constructor(
    private auth: AuthService,
    private userDetails: UserDetailsService,
    @Inject(LOCALE_ID) public locale?: string
  ) {
    this.userDetails$ = userDetails.get(auth.user());
  }

  ngOnInit() {}

  onClose() {
    this.sidenavClose.emit();
  }
}
