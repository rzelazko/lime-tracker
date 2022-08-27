import { User } from 'firebase/auth';
import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss']
})
export class ManageProfileComponent implements OnInit {
  user: User;

  constructor(public auth: AuthService) {
    this.user = auth.user();
  }

  ngOnInit(): void {
  }

}
