import { ApplicationRef, Injectable, isDevMode, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { first, fromEvent, interval, merge, Subject, takeUntil } from 'rxjs';
import { UpdateDialogComponent } from './../components/update-dialog/update-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class AppUpdateService implements OnDestroy {
  private static readonly PERIODIC_UPDATE_CHECK_INTERVAL = 6 * 60 * 60 * 1000;
  private static readonly MIN_UPDATE_CHECK_INTERVAL = 60 * 1000;

  private destroy$ = new Subject<void>();
  private isUpdateCheckInProgress = false;
  private isUpdateDialogOpen = false;
  private lastUpdateCheckAt = 0;

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
    this.appRef.isStable
      .pipe(first((isStable) => isStable), takeUntil(this.destroy$))
      .subscribe(() => {
        this.bindRuntimeUpdateChecks();
        void this.performUpdateCheck(true);
      });
  }

  showAppUpdateAlert() {
    if (this.isUpdateDialogOpen) {
      return;
    }

    this.isUpdateDialogOpen = true;
    const dialogRef = this.dialog.open(UpdateDialogComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.isUpdateDialogOpen = false;
      this.doAppUpdate();
    });
  }

  doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }

  private bindRuntimeUpdateChecks() {
    interval(AppUpdateService.PERIODIC_UPDATE_CHECK_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        void this.performUpdateCheck();
      });

    merge(
      fromEvent(window, 'focus'),
      fromEvent(window, 'online'),
      fromEvent(window, 'pageshow'),
      fromEvent(document, 'visibilitychange')
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.type === 'visibilitychange' && document.visibilityState !== 'visible') {
          return;
        }

        void this.performUpdateCheck();
      });
  }

  private async performUpdateCheck(force = false) {
    if (this.isUpdateCheckInProgress) {
      return;
    }

    const now = Date.now();
    if (!force && now - this.lastUpdateCheckAt < AppUpdateService.MIN_UPDATE_CHECK_INTERVAL) {
      return;
    }

    this.isUpdateCheckInProgress = true;
    this.lastUpdateCheckAt = now;

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
    } finally {
      this.isUpdateCheckInProgress = false;
    }
  }
}
