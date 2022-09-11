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
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthData } from './../../auth/models/auth-data.model';
import { UserDetailsService } from './user-details.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  private authState$: Observable<User | null>;

  constructor(private auth: Auth, private userDetailsService: UserDetailsService) {
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

  async register({ name, email, password, isFemale }: AuthData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await firstValueFrom(this.userDetailsService.init(userCredential.user.uid, isFemale));
      await this.sendVerificationEmail();
    } catch (error) {
      this.rethrowUnwrappedFirebaseError(error);
    }
  }

  async sendVerificationEmail() {
    await sendEmailVerification(this.user());
    await firstValueFrom(this.userDetailsService.updateVerificationEmailSent(this.user().uid));
  }

  private rethrowUnwrappedFirebaseError(error: any) {
    if (error instanceof FirebaseError) {
      throw new Error((error as FirebaseError).code);
    } else {
      throw error;
    }
  }
}
