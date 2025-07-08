import { GameUpdatesPreference } from "./notifications";

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  code?: string
}

export interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  nationality?: Country;
  favoriteTeam?: Team;
}

export interface UserRepresentation {
  id?: string;
  createdTimestamp?: number;
  username?: string;
  enabled?: boolean;
  totp?: boolean;
  emailVerified?: boolean;
  disableableCredentialTypes?: string[];
  requiredActions?: string[];
  notBefore?: number;
  access?: Record<string, boolean>;
  attributes?: Record<string, any>;
  clientConsents?: any[];
  clientRoles?: Record<string, any>;
  credentials?: CredentialRepresentation[];
  email?: string;
  federatedIdentities?: any[];
  federationLink?: string;
  firstName?: string;
  groups?: string[];
  lastName?: string;
  origin?: string;
  realmRoles?: string[];
  self?: string;
  serviceAccountClientId?: string;
}

export interface CredentialRepresentation {
  type: string;
  value: string;
  temporary?: boolean;
}

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};

export interface BridgeUserData {
  name: string;
  email: string;
  user_id: string;
  onesignal_id?: string;
}


export type DatabaseUser = {
  kc_id: string,
  email: string,
  first_name?: string,
  last_name?: string,
  us_state?: string,
  verification_state?: string,
  athcoin_balance?: string,
  geolocation_allowed?: boolean,
  device_id?: string,
  pref_payout?: string,
  game_updates_preference: GameUpdatesPreference
}

export type ScrummyUser = {
  kc_id: string,
  "email": string,
  "first_name": string,
  "last_name"?: string,
  "us_state"?: string,
  "verification_state": string,
  "athcoin_balance": number,
  "geolocation_allowed": boolean,
  "device_id"?: string,
  "pref_payout"?: string,
  "game_updates_preference": string,
  "username"?: string,
}