export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  code: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  nationality?: Country;
  favoriteTeam?: Team;
}
