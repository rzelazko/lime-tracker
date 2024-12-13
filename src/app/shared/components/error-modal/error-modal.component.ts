import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-error-modal',
    templateUrl: './error-modal.component.html',
    styleUrls: ['./error-modal.component.scss'],
    standalone: false
})
export class ErrorModalComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public details: string) {}

  ngOnInit(): void {}
}
