import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject } from 'rxjs';
import { InstallPwaDialogComponent, PwaInstallPlatform } from '../components/install-pwa-dialog/install-pwa-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: any = null;
  private installableSubject = new BehaviorSubject<boolean>(false);
  public installable$: Observable<boolean> = this.installableSubject.asObservable();

  constructor(private dialog: MatDialog) {}

  init(): void {
    this.installableSubject.next(this.canInstall());

    // Handle beforeinstallprompt event (Chrome, Edge, etc.)
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Store the event so it can be triggered later
      this.deferredPrompt = event;
      this.installableSubject.next(this.canInstall());
    });

    // Clear the deferredPrompt when the app is installed
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.installableSubject.next(false);
    });
  }

  /**
   * Check if we can install the PWA
   * - Not in standalone mode
   * - Either has deferredPrompt (Chrome/Edge) or is iOS Safari
   */
  canInstall(): boolean {
    return !this.isStandalone() && (this.hasDeferredPrompt() || this.isIos());
  }

  /**
   * Check if the app is running in standalone mode (already installed)
   */
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Check if we have a deferred install prompt (Chrome, Edge, etc.)
   */
  hasDeferredPrompt(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Detect if the device is iOS (iPhone, iPad, iPod)
   * Works for iOS 16+ and older versions
   */
  isIos(): boolean {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isIosPlatform = /macintosh/.test(userAgent) && 'ontouchend' in document;
    return isIosDevice || isIosPlatform;
  }

  /**
   * Detect if the browser is Safari (for iOS install instructions)
   */
  isSafari(): boolean {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /safari/.test(userAgent) && !/chrome/.test(userAgent) && !/crios/.test(userAgent);
  }

  /**
   * Get the current platform for install instructions
   */
  getPlatform(): PwaInstallPlatform {
    if (this.isIos()) {
      return 'ios';
    }
    if (this.hasDeferredPrompt()) {
      return 'chrome';
    }
    return 'other';
  }

  /**
   * Trigger the install flow
   * - For Chrome/Edge: shows the native install prompt
   * - For iOS/other: opens a dialog with instructions
   */
  async install(): Promise<void> {
    if (this.isStandalone()) {
      // App is already installed
      return;
    }

    if (this.hasDeferredPrompt()) {
      // Chrome/Edge - show native install prompt
      this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      this.deferredPrompt = null;
      this.installableSubject.next(this.canInstall());
    } else if (this.isIos() || !this.hasDeferredPrompt()) {
      // iOS or other browsers - show instructions dialog
      this.showInstallInstructions();
    }
  }

  /**
   * Show install instructions dialog for iOS and unsupported browsers
   */
  private showInstallInstructions(): void {
    const platform = this.getPlatform();
    this.dialog.open(InstallPwaDialogComponent, {
      data: { platform },
      width: '400px',
      maxWidth: '90vw'
    });
  }
}
