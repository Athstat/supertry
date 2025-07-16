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

export type UserPasswordStatus = {
  has_password: boolean
}

export type UserPasswordStatusRes = {
  status?: UserPasswordStatus,
  message: string
}

export type DjangoAuthUser = {
  kc_id: string,
  email: string,
  first_name: string,
  last_name: string,
  username?: string,
  game_updates_preference?: GameUpdatesPreference,
  pref_payout?: string,
  device_id?: string,
  verification_state: string,
  is_claimed_account: boolean
}

export type DjangoLoginRes = {
  token: string,
  email: string,
  user: DjangoAuthUser
}

export type ThrowableRes<T> = {
  message?: string,
  data?: T
}

export type RestPromise<T> = Promise<{
  error?: RestError,
  data?: T
}>


export type DeviceAuthenticationRequest = {
  device_id: string
}

export type DjangoDeviceAuthRes = {
  token: string,
  is_device_account: boolean,
  user: DjangoAuthUser
  has_email: boolean
}

export type RestError = {
  error?: string,
  message: string
}

export type ClaimGuestAccountReq = {
  email: string,
  password: string,
  username?: string,
  first_name?: string,
  last_name?: string
}

export type ClaimGuestAccountResult = {
  message: string,
  user: DjangoAuthUser
}

export type RegisterUserReq = {
  email: string,
  password: string,
  username: string,
  first_name?: string,
  last_name?: string
}

export type DjangoRegisterRes = {
  user: DjangoAuthUser,
  token: string,
  message?: string
}

export type RequestPasswordResetRes = {
  message: string
}

export type ResetPasswordRes = {
  email: string,
  message: string
}

export type PasswordResetTokenIntrospect = {
  created_at: string,
  expires_at: string,
  user_id: string
}