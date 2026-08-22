import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-auth',
    templateUrl: './anonymous.component.html',
    styleUrls: ['./anonymous.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LayoutAnonymousComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
