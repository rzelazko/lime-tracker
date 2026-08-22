import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-error-modal',
    templateUrl: './error-modal.component.html',
    styleUrls: ['./error-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ErrorModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public details: string) {}

  ngOnInit(): void {}
}
