import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/auth/models/user-details.model';
import { AuthService } from './../../../shared/services/auth.service';
import { UserDetailsService } from './../../../shared/services/user-details.service';

@Component({
  selector: 'app-manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.scss'],
})
export class ManageProfileComponent implements OnInit {
  userDetails$: Observable<UserData>;

  constructor(private auth: AuthService, private userDetails: UserDetailsService) {
    this.userDetails$ = userDetails.get(auth.user());
  }

  ngOnInit(): void {}
}
