import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-card',
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.scss']
})
export class ErrorCardComponent implements OnInit {
  @Input() error?: string;
  @Input('full-size') fullSize = true;

  constructor() { }

  ngOnInit(): void {
  }

}
