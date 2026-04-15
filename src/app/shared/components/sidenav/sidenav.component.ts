import { Component, EventEmitter, inject, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';
import { PwaInstallService } from './../../../shared/services/pwa-install.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: false
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  userDetails$: Observable<UserData>;
  canInstallPwa$: Observable<boolean>;
  private auth: AuthService = inject(AuthService);
  private pwaInstallService: PwaInstallService = inject(PwaInstallService);

  constructor(@Inject(LOCALE_ID) public locale?: string) {
    this.userDetails$ = this.auth.userDetails$();
    this.canInstallPwa$ = this.pwaInstallService.installable$;
  }

  ngOnInit() {}

  onClose() {
    this.sidenavClose.emit();
  }

  installPwa() {
    this.pwaInstallService.install();
    this.onClose();
  }
}
