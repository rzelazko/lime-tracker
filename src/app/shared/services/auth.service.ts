import { UserData, UserDetails } from './../../auth/models/user-details.model';
import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { concat, from } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { concatMap, flatMap, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { AuthData } from './../../auth/models/auth-data.model';
import { filterNullOrUndefined } from './filter-is-null';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn$: Observable<boolean>;
  public isLoggedOut$: Observable<boolean>;
  public authenticatedUser$: Observable<User | null>;
  public authenticatedUserData$: Observable<UserData | null>;

  constructor(private auth: Auth, private userService: UserService) {
    this.authenticatedUser$ = authState(auth);
    this.isLoggedIn$ = this.authenticatedUser$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    this.authenticatedUserData$ = this.authenticatedUser$.pipe(
      filterNullOrUndefined(),
      mergeMap((user) => this.userService.getUserDetails(user))
    );
  }

  async login({ email, password }: AuthData) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.rethrowUnwrappedFirebaseError(error);
    }
  }

  logout() {
    return signOut(this.auth);
  }

  async register({ name, email, password }: AuthData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await this.userService.initUserDetails(userCredential.user.uid);
      this.sendVerificationEmail();
    } catch (error) {
      this.rethrowUnwrappedFirebaseError(error);
    }
  }

  sendVerificationEmail() {
    this.authenticatedUser$
      .pipe(filterNullOrUndefined(), take(1))
      .subscribe((user: User) =>
        concat(this.userService.verificationEmailSent(user.uid), from(sendEmailVerification(user)))
      );
  }

  private rethrowUnwrappedFirebaseError(error: any) {
    if (error instanceof FirebaseError) {
      throw new Error((error as FirebaseError).code);
    } else {
      throw error;
    }
  }
}
