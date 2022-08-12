import { IdTokenResult, User, UserInfo, UserMetadata } from 'firebase/auth';

export class MockFirebaseUser implements User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerId: string;
  uid: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: UserInfo[] = [];
  refreshToken: string;
  metadata: UserMetadata = {};
  tenantId: string | null = null;
  phoneNumber: string | null = null;

  constructor(displayName: string, email: string, uid: string) {
    this.displayName = displayName;
    this.email = email;
    this.photoURL = null;
    this.providerId = 'provider-id';
    this.uid = uid;
    this.emailVerified = false;
    this.isAnonymous = false;
    this.refreshToken = 'mock-refresh-token';
  }

  getIdToken(forceRefresh?: boolean): Promise<string> {
    return Promise.resolve('');
  }

  getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult> {
    return Promise.reject();
  }

  toJSON(): object {
    return {};
  }

  public delete() {
    return Promise.resolve();
  }

  public getToken() {
    return Promise.resolve();
  }

  public link() {
    return Promise.resolve();
  }

  public linkWithCredential() {
    return Promise.resolve();
  }

  public linkWithPopup() {
    return Promise.resolve();
  }

  public linkWithRedirect() {
    return Promise.resolve();
  }

  public reauthenticate() {
    return Promise.resolve();
  }

  public reauthenticateWithCredential() {
    return Promise.resolve();
  }

  public reauthenticateWithPopup() {
    return Promise.resolve();
  }

  public reauthenticateWithRedirect() {
    return Promise.resolve();
  }

  public reload() {
    return Promise.resolve();
  }

  public sendEmailVerification() {
    return Promise.resolve();
  }

  public unlink() {
    return Promise.resolve();
  }

  public updateEmail() {
    return Promise.resolve();
  }

  public updatePassword() {
    return Promise.resolve();
  }

  public updateProfile() {
    return Promise.resolve();
  }
}
