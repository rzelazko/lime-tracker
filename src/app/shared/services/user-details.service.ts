import { inject, Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import moment from 'moment';
import { map, BehaviorSubject } from 'rxjs';
import { DEFAULT_SEIZURE_TRIGGERS } from '../../auth/models/default-seizure-triggers.model';
import { DEFAULT_SEIZURE_TYPES } from '../../auth/models/default-seizure-types.model';
import {
  UserData,
  UserDetails,
  UserDetailsEmailVerification,
  UserDetailsIsFemale
} from '../../auth/models/user-details.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  private firestoreService: FirestoreService = inject(FirestoreService);

  init(userId: string, isFemale: boolean) {
    const userDetails: UserDetails = {
      seizureTypes: DEFAULT_SEIZURE_TYPES,
      seizureTriggers: DEFAULT_SEIZURE_TRIGGERS,
      isFemale
    };
    return this.firestoreService.set(`users/${userId}`, userDetails);
  }

  get(user: User) {
    return this.firestoreService
      .get<UserData>(`users/${user.uid}`)
      .pipe(map((result) => ({ ...result, email: user.email, name: user.displayName } as UserData)));
  }

  setIsFemale(userId: string, isFemale: boolean) {
    const userDetails: UserDetailsIsFemale = {
      isFemale
    };
    return this.firestoreService.update(`users/${userId}`, userDetails);
  }

  updateVerificationEmailSent(userId: string) {
    const userDetails: UserDetailsEmailVerification = {
      emailVerificationSent: moment(),
    };
    return this.firestoreService.update(`users/${userId}`, userDetails);
  }
}
