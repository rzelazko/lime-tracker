import { Component, inject, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';
import 'moment/locale/pl'; // moment used to work without explicit import, but now it doesn't
import { AppUpdateService } from './shared/services/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  logoURL = 'assets/lime.svg';
  private domSanitizer: DomSanitizer = inject(DomSanitizer);
  private updateService: AppUpdateService = inject(AppUpdateService);
  private matIconRegistry: MatIconRegistry = inject(MatIconRegistry);

  constructor(@Inject(LOCALE_ID) locale?: string) {
    this.matIconRegistry.addSvgIcon(
      'logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(this.logoURL)
    );
    if (locale) {
      moment.locale(locale);
    }
  }

  async ngOnInit() {
    this.updateService.checkForUpdate();
  }
}
