import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import * as moment from 'moment';
import { map, BehaviorSubject } from 'rxjs';
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
export class UserDetailsService {
  constructor(private firestoreService: FirestoreService) {}

  init(userId: string) {
    const userDetails: UserDetails = {
      seizureTypes: DEFAULT_SEIZURE_TYPES,
      seizureTriggers: DEFAULT_SEIZURE_TRIGGERS,
    };
    return this.firestoreService.set(`users/${userId}`, userDetails);
  }

  get(user: User) {
    return this.firestoreService
      .get<UserData>(`users/${user.uid}`)
      .pipe(map((result) => ({ ...result, email: user.email, name: user.displayName } as UserData)));
  }

  updateVerificationEmailSent(userId: string) {
    const userDetails: UserDetailsEmailVerification = {
      emailVerificationSent: moment(),
    };
    return this.firestoreService.update(`users/${userId}`, userDetails);
  }
}
