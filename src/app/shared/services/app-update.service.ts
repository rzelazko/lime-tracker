import { ApplicationRef, Injectable, isDevMode, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { concat, first, interval, Subject, takeUntil } from 'rxjs';
import { UpdateDialogComponent } from './../components/update-dialog/update-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class AppUpdateService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private appRef: ApplicationRef,
    private readonly updates: SwUpdate,
    private dialog: MatDialog
  ) {
    // Handle unrecoverable states - critical for iOS Safari
    this.updates.unrecoverable
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        console.error('Service worker unrecoverable error:', event.reason);
        // Force reload to recover - necessary on iOS Safari
        document.location.reload();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkForUpdate() {
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.pipe(takeUntil(this.destroy$)).subscribe(async () => {
      try {
        const updateFound = await this.updates.checkForUpdate();
        if (updateFound) {
          console.log('A new version is available');
          this.showAppUpdateAlert();
        } else {
          console.log('Already on the latest version');
        }
      } catch (err) {
        if (isDevMode()) {
          console.info('Service workers for PWA disabled');
        } else {
          console.error('Failed to check for updates:', err);
        }
      }
    });
  }

  showAppUpdateAlert() {
    const dialogRef = this.dialog.open(UpdateDialogComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.doAppUpdate();
    });
  }

  doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
