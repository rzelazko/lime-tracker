import { inject, Injectable, OnDestroy } from '@angular/core';
import { auth, authState$ } from '../firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { BehaviorSubject, EMPTY, filter, firstValueFrom, Subscription, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { AuthData } from './../../auth/models/auth-data.model';
import { UserData } from './../../auth/models/user-details.model';
import { UserDetailsService } from './user-details.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private auth = auth;
  private user: User | null = null;
  private userData$: Observable<UserData>;
  private userDetailsService = inject(UserDetailsService);
  private authState$ = authState$();
  private authStateSubscription: Subscription;
  private userIdSubject$ = new BehaviorSubject<string>('');
  private userId$ = this.userIdSubject$.asObservable();

  constructor() {
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      this.user = aUser;
      const uid = aUser?.uid || '';
      this.userIdSubject$.next(uid);
    });
    this.userData$ = this.authState$.pipe(
      switchMap((aUser) => {
        if (aUser) {
          return this.userDetailsService.get(aUser);
        }
        return EMPTY;
      })
    );
  }

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
  }

  userIdProvider$(): Observable<string> {
    return this.userId$;
  }

  userDetails$(): Observable<UserData> {
    return this.userData$;
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
    const userId = await firstValueFrom(this.userId$.pipe(filter((id) => !!id)));
    await sendEmailVerification(this.user!);
    await firstValueFrom(this.userDetailsService.updateVerificationEmailSent(userId));
  }

  private rethrowUnwrappedFirebaseError(error: any) {
    if (error instanceof FirebaseError) {
      throw new Error((error as FirebaseError).code);
    } else {
      throw error;
    }
  }
}
