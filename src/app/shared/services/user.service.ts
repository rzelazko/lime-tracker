import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, setDoc, doc } from '@angular/fire/firestore';
import { DEFAULT_SEIZURE_TYPES } from '../../auth/models/default-seizure-types.model';
import { UserDetails } from '../../auth/models/user-details.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore) {}

  initUserDetails(userId: string) {
    const userDetails: UserDetails = { seizureTypes: DEFAULT_SEIZURE_TYPES };
    return setDoc(doc(this.firestore, 'users', userId), userDetails);
  }
}
