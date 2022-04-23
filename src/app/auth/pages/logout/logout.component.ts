import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { AuthService } from '../../../shared/services/auth.service';
import { EventsService } from '../../../shared/services/events.service';
import { MedicationsService } from '../../../shared/services/medications.service';
import { SeizuresService } from '../../../shared/services/seizures.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog,
    private seizuresService: SeizuresService,
    private medicationsService: MedicationsService,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.auth
      .logout()
      .then(() => {
        this.seizuresService.resetConcatenated();
        this.medicationsService.resetConcatenated();
        this.eventsService.resetConcatenated();
        return this.router.navigate([$localize`:@@routerLink-login:/login`]);
      })
      .catch((error) => this.dialog.open(ErrorModalComponent, { data: error.message }));
  }
}
