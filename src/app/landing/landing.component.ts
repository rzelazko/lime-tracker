import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
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

  constructor(private title: Title, private meta: Meta, private authService: AuthService) {
    this.user$ = this.authService.authStateProvider$();
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
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Clear the deferredPrompt
        (window as any).deferredPrompt = null;
      });
    } else {
      // Fallback: try to open the app in standalone mode or show instructions
      if (window.matchMedia('(display-mode: standalone)').matches) {
        alert('App is already installed!');
      } else {
        alert('Installation prompt is not available. Try refreshing the page or check if you\'re using a supported browser.');
      }
    }
  }
}
