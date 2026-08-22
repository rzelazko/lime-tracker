import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type PwaInstallPlatform = 'ios' | 'chrome' | 'other';

interface InstallPwaDialogData {
  platform: PwaInstallPlatform;
}

@Component({
  selector: 'app-install-pwa-dialog',
  templateUrl: './install-pwa-dialog.component.html',
  styleUrls: ['./install-pwa-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class InstallPwaDialogComponent {
  platform: PwaInstallPlatform;

  constructor(
    public dialogRef: MatDialogRef<InstallPwaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InstallPwaDialogData
  ) {
    this.platform = data.platform;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
