import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-update-dialog',
    templateUrl: './update-dialog.component.html',
    styleUrls: ['./update-dialog.component.scss'],
    standalone: false
})
export class UpdateDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<UpdateDialogComponent>, private ngZone: NgZone) { }

  ngOnInit(): void {}

  onClose(): void {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
  }
}
