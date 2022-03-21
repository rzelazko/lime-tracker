import { Injectable } from '@angular/core';
import { doc, docData, docSnapshots, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { User } from 'firebase/auth';
import { collection, getDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import * as moment from 'moment';
import { from, map, take } from 'rxjs';
import { DEFAULT_SEIZURE_TYPES } from '../../auth/models/default-seizure-types.model';
import {
  UserData,
  UserDetails,
  UserDetailsEmailVerification,
} from '../../auth/models/user-details.model';
import { convertSnapshot, convertSnapshots, convertToTimestamps } from './firebase-utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  initUserDetails(userId: string) {
    const userDetails: UserDetails = { seizureTypes: DEFAULT_SEIZURE_TYPES };
    return setDoc(doc(this.firestore, 'users', userId), userDetails);
  }

  getUserDetails(user: User) {
    const userRef = doc(this.firestore, 'users', user.uid);
    return docSnapshots(userRef).pipe(
      map((result) => convertSnapshot<UserData>(result, {email: user.email}))
    );
  }

  verificationEmailSent(userId: string) {
    const userDetails: UserDetailsEmailVerification = {
      emailVerficationDate: moment(),
    };
    return updateDoc(doc(this.firestore, 'users', userId), convertToTimestamps(userDetails));
  }
}
