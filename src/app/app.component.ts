import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment'
import 'moment/locale/pl' // moment used to work without explicit import, but now it doesn't
import { AppUpdateService } from './shared/services/app-update.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  logoURL = 'assets/lime.svg';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
    private updateService: AppUpdateService,
    @Inject(LOCALE_ID) locale?: string
  ) {
    this.matIconRegistry.addSvgIcon(
      'logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.logoURL)
    );
    if (locale) {
      moment.locale(locale);
    }
  }

  async ngOnInit() {
    this.authService.initAuthListener();
    this.updateService.checkForUpdate();
  }
}
