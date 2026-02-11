import { DeviceIdPair } from './device';
import { GameUpdatesPreference } from './notifications';

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  code?: string;
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
  kc_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  us_state?: string;
  verification_state?: string;
  athcoin_balance?: string;
  geolocation_allowed?: boolean;
  device_id?: string;
  pref_payout?: string;
  game_updates_preference: GameUpdatesPreference;
};

export type ScrummyUser = {
  kc_id: string;
  email: string;
  first_name: string;
  last_name?: string;
  us_state?: string;
  verification_state: string;
  athcoin_balance: number;
  geolocation_allowed: boolean;
  device_id?: string;
  pref_payout?: string;
  game_updates_preference: string;
  username?: string;
};

export type UserPasswordStatus = {
  has_password: boolean;
};

export type UserPasswordStatusRes = {
  status?: UserPasswordStatus;
  message: string;
};

export type VerificationState = 'verified' | 'pending' | 'guest';

export type DjangoAuthUser = {
  kc_id: string;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  game_updates_preference?: GameUpdatesPreference;
  pref_payout?: string;
  // Server returns device_id as a string; some client spots previously treated it as a pair.
  // Use a union to be backward compatible and avoid type errors.
  device_id?: string | DeviceIdPair;
  verification_state: VerificationState;
  is_claimed_account: boolean;
  avatar_url?: string
};

export type DjangoLoginRes = {
  token: string;
  email: string;
  user: DjangoAuthUser;
};

export type ThrowableRes<T> = {
  message?: string;
  data?: T;
};

export type RestPromise<T> = Promise<{
  error?: RestError;
  data?: T;
}>;

export type DeviceAuthenticationRequest = {
  device_id: string;
};

export type DjangoDeviceAuthRes = {
  token: string;
  is_device_account: boolean;
  user: DjangoAuthUser;
  has_email: boolean;
};

export type RestError = {
  error?: string;
  message: string;
};

export type ClaimGuestAccountReq = {
  email: string;
  password: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

export type ClaimGuestAccountResult = {
  message: string;
  user: DjangoAuthUser;
};

export type RegisterUserReq = {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
};

export type DjangoRegisterRes = {
  user: DjangoAuthUser;
  token: string;
  message?: string;
};

export type RequestPasswordResetRes = {
  message: string;
};

export type ResetPasswordRes = {
  email: string;
  message: string;
};

export type PasswordResetTokenIntrospect = {
  created_at: string;
  expires_at: string;
  user_id: string;
};

export type RequestEmailVerificationRes = {
  message: string;
};

export type VerifyEmailRes = {
  message: string;
};


export type UpdateUserProfileReq = {
  username?: string,
  first_name?: string,
  last_name?: string,
  avatar_url?: string
}

export type DjangoUserMinimal = {
  kc_id: string,
  email: string,
  first_name?: string,
  last_name?: string,
  username?: string,
  game_updates_preference?: string
  avatar_url?: string
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type UserFavouriteTeam = {
  user_id: string,
  team_id: string,
  season_id: string
}

export type InternalUserProfile = {
  user_id: string,
  birth_date?: Date,
  is_email_verified: boolean,
  device_id?: string,
  onesignal_id?: string,
  is_device_account?: boolean,
  created_at?: Date,
  updated_at?: Date,
  country?: string,
  completed_onboarding?: boolean,
  favourite_teams: UserFavouriteTeam[]
}

export type UpdatedUserInternalProfileReq = {
  country?: string,
  completed_onboarding?: boolean,
  favourite_teams: UserFavouriteTeam[]
}

export type EditAccountInfoForm = {
  username: string,
  firstName?: string,
  lastName?: string,
  avatarUrl?: string
}