import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { PwaInstallService } from '../shared/services/pwa-install.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  user$: Observable<User | null>;
  canInstallPwa$: Observable<boolean>;
  private pwaInstallService: PwaInstallService = inject(PwaInstallService);

  constructor(private title: Title, private meta: Meta, private authService: AuthService) {
    this.user$ = this.authService.authStateProvider$();
    this.canInstallPwa$ = this.pwaInstallService.installable$;
  }

  ngOnInit() {
    this.title.setTitle($localize`:@@landing-page-title:Lime Tracker - Understand Your Epilepsy Data`);
    this.meta.updateTag({
      name: 'description',
      content: $localize`:@@landing-meta-description:Lime Tracker helps you securely track epilepsy seizures, medications, and triggers. Visualize your progress with easy-to-use charts and stay in control of your health.`,
    });
    this.meta.updateTag({
      name: 'keywords',
      content: $localize`:@@landing-meta-keywords:epilepsy tracker, seizure diary, health monitoring, PWA, data visualization`,
    });
  }

  installPWA() {
    this.pwaInstallService.install();
  }
}
