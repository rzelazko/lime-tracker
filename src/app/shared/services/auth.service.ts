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
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';
import { AuthData } from '../../auth/models/auth-data.model';
import { UserData } from '../../auth/models/user-details.model';
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
        this.updateUserData(user);
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
      await firstValueFrom(this.userService.initUserDetails(userCredential.user.uid));
      await this.sendVerificationEmail();
    } catch (error) {
      this.rethrowUnwrappedFirebaseError(error);
    }
  }

  async sendVerificationEmail() {
    await sendEmailVerification(this.user());
    await firstValueFrom(this.userService.verificationEmailSent(this.user().uid));
    this.updateUserData(this.user());
  }

  private updateUserData(user: User) {
    this.userService
      .getUserDetails(user)
      .pipe(take(1))
      .subscribe((userData) => this.userData$.next(userData));
  }

  private rethrowUnwrappedFirebaseError(error: any) {
    if (error instanceof FirebaseError) {
      throw new Error((error as FirebaseError).code);
    } else {
      throw error;
    }
  }
}
