import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-epilepsy',
  templateUrl: './epilepsy.component.html',
  styleUrls: ['./epilepsy.component.scss'],
})
export class EpilepsyComponent implements OnInit {
  constructor(public media: MediaObserver, private router: Router) {}

  ngOnInit(): void {
  }

  onLogout() {
    this.router.navigate(['/']);
  }
}
