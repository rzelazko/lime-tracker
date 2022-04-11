import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';
import { UpdateDialogComponent } from '../components/update-dialog/update-dialog.component';
@Injectable({
  providedIn: 'root',
})
export class AppUpdateService {
  constructor(private readonly updates: SwUpdate, private dialog: MatDialog) {
    this.updates.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        this.showAppUpdateAlert();
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
