import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-epilepsy',
  templateUrl: './epilepsy.component.html',
  styleUrls: ['./epilepsy.component.scss'],
})
export class EpilepsyComponent {
  constructor(private router: Router) {}

  onLogout() {
    this.router.navigate(['/']);
  }
}
