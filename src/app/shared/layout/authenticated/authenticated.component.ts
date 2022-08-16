import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-epilepsy',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
})
export class LayoutAuthenticatedComponent implements OnInit {
  constructor(public media: MediaObserver) {}

  ngOnInit(): void {}
}
