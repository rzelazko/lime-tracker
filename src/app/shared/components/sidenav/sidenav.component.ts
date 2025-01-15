import { Component, EventEmitter, inject, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: false
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  userDetails$: Observable<UserData>;
  private auth: AuthService = inject(AuthService);

  constructor(@Inject(LOCALE_ID) public locale?: string) {
    this.userDetails$ = this.auth.userDetails$();
  }

  ngOnInit() {}

  onClose() {
    this.sidenavClose.emit();
  }
}
