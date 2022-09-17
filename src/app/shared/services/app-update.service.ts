import { ApplicationRef, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { concat, first, interval } from 'rxjs';
import { UpdateDialogComponent } from './../components/update-dialog/update-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  constructor(
    private appRef: ApplicationRef,
    private readonly updates: SwUpdate,
    private dialog: MatDialog
  ) {}

  checkForUpdate() {
    // Allow the app to stabilize first, before starting
    // polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        const updateFound = await this.updates.checkForUpdate();
        if (updateFound) {
          console.log('A new version is available');
          this.showAppUpdateAlert();
        } else {
          console.log('Already on the latest version');
        }
      } catch (err) {
        console.error('Failed to check for updates:', err);
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
