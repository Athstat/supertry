export interface Country {
  code: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
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
}