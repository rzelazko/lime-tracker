import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorModalComponent } from 'src/app/shared/error-modal/error-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.auth.logout()
    .then(() => this.router.navigate(['login']))
    .catch(error => this.dialog.open(ErrorModalComponent, { data: error.message }));
  }
}
