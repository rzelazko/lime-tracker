import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lime-tracker';
  logoURL = 'assets/lime.svg';

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
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

  ngOnInit(): void {
    this.authService.initAuthListener();
  }
}
