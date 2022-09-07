import { Moment } from "moment";

export interface UserData extends UserDetails, UserDetailsIsFemale {
  id: string;
  email: string;
  name: string;
}

export interface UserDetails extends UserDetailsEmailVerification {
  seizureTypes: string[];
  seizureTriggers: string[];
}

export interface UserDetailsEmailVerification {
  emailVerificationSent?: Moment;
}

export interface UserDetailsIsFemale {
  isFemale: boolean;
}
