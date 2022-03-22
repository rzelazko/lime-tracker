import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import * as moment from 'moment';
import { map } from 'rxjs';
import { DEFAULT_SEIZURE_TRIGGERS } from '../../auth/models/default-seizure-triggers.model';
import { DEFAULT_SEIZURE_TYPES } from '../../auth/models/default-seizure-types.model';
import {
  UserData,
  UserDetails,
  UserDetailsEmailVerification
} from '../../auth/models/user-details.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestoreService: FirestoreService) {}

  initUserDetails(userId: string) {
    const userDetails: UserDetails = {
      seizureTypes: DEFAULT_SEIZURE_TYPES,
      seizureTriggers: DEFAULT_SEIZURE_TRIGGERS,
    };
    return this.firestoreService.set(`users/${userId}`, userDetails);
  }

  getUserDetails(user: User) {
    return this.firestoreService
      .get<Partial<UserData>>(`users/${user.uid}`)
      .pipe(map((result) => ({ ...result, email: user.email } as UserData)));
  }

  verificationEmailSent(userId: string) {
    const userDetails: UserDetailsEmailVerification = {
      emailVerficationDate: moment(),
    };
    return this.firestoreService.update(`users/${userId}`, userDetails);
  }
}
