import { Injectable } from '@angular/core';
import { doc, docSnapshots, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
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
import { convertSnapshot, convertToTimestamps } from './firebase-utils';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: Firestore) {}

  initUserDetails(userId: string) {
    const userDetails: UserDetails = {
      seizureTypes: DEFAULT_SEIZURE_TYPES,
      seizureTriggers: DEFAULT_SEIZURE_TRIGGERS,
    };
    return setDoc(doc(this.firestore, 'users', userId), userDetails);
  }

  getUserDetails(user: User) {
    const userRef = doc(this.firestore, 'users', user.uid);
    return docSnapshots(userRef).pipe(
      map((result) => convertSnapshot<UserData>(result, { email: user.email }))
    );
  }

  verificationEmailSent(userId: string) {
    const userDetails: UserDetailsEmailVerification = {
      emailVerficationDate: moment(),
    };
    return updateDoc(doc(this.firestore, 'users', userId), convertToTimestamps(userDetails));
  }
}
