import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-epilepsy',
  templateUrl: './epilepsy.component.html',
  styleUrls: ['./epilepsy.component.scss'],
})
export class EpilepsyComponent implements OnInit {
  constructor(public media: MediaObserver) {}

  ngOnInit(): void {}
}
