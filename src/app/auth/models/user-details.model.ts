import { Timestamp } from "firebase/firestore";
import { Moment } from "moment";

export interface UserData extends UserDetails {
  id: string;
  email: string;
}

export interface UserDetails extends UserDetailsEmailVerification {
  seizureTypes: string[];
  seizureTriggers: string[];
}

export interface UserDetailsEmailVerification {
  emailVerificationSent?: Moment;
}
