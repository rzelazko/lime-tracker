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
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { LoginData } from '../../auth/models/login-data.model';
import { RegisterData } from '../../auth/models/register-data.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isLoggedIn$: Observable<boolean>;
  public isLoggedOut$: Observable<boolean>;
  public authenticatedUser$: Observable<User | null>;

  constructor(private auth: Auth, private userService: UserService) {
    this.authenticatedUser$ = authState(auth);
    this.isLoggedIn$ = this.authenticatedUser$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
  }

  login({ email, password }: LoginData) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  async register({ email, password, name }: RegisterData) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    await this.userService.initUserDetails(userCredential.user.uid);
    await sendEmailVerification(userCredential.user);
  }
}
