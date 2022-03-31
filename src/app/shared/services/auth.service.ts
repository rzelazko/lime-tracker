import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, concat, from } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { map, take } from 'rxjs/operators';
import { AuthData } from './../../auth/models/auth-data.model';
import { UserData } from './../../auth/models/user-details.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData$: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  private userSubject$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private authState$: Observable<User | null>;

  constructor(private auth: Auth, private userService: UsersService) {
    this.authState$ = authState(auth);
  }

  user(): User {
    if (this.userSubject$.value) {
      return this.userSubject$.value;
    } else {
      throw 'Unauthenticated';
    }
  }

  initAuthListener() {
    this.authState$.subscribe((user) => {
      if (user) {
        this.userSubject$.next(user);
        this.userService
          .getUserDetails(user)
          .pipe(take(1))
          .subscribe((userData) => this.userData$.next(userData));
      } else {
        this.userSubject$.next(null);
      }
    });
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
      this.userService
        .initUserDetails(userCredential.user.uid)
        .pipe(
          take(1),
          map(() => this.sendVerificationEmail())
        )
        .subscribe();
    } catch (error) {
      this.rethrowUnwrappedFirebaseError(error);
    }
  }

  sendVerificationEmail() {
    concat(
      this.userService.verificationEmailSent(this.user().uid),
      from(sendEmailVerification(this.user()))
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
