export type INewProMotm = {
    game_id: string,
    user_id: string,
    athlete_id: string,
    team_id: string
}

export type IEditProMotm = {
    athlete_id: string,
    team_id: string
}

export type IProMotmVote = {
    game_id: string;
    athlete_id: string;
    team_id: string;
    user_id: string;
    created_at: string;
    source_id: string;
    tracking_id: string;
    player_name: string;
    nick_name?: string;
    birth_country?: string;
    date_of_birth: string;
    isactive?: boolean;
    abbr?: string;
    athstat_name?: string;
    athstat_firstname: string;
    athstat_lastname: string;
    athstat_middleinitial?: string;
    general_comments?: string;
    age?: number;
    height: number;
    weight: number;
    best_match_full_name?: string;
    best_match_first_name?: string;
    best_match_last_name?: string;
    best_match_team?: string;
    best_match_gender?: string;
    external_source?: string;
    best_match_iaaid?: string;
    unified_id?: string;
    hidden?: boolean;
    kc_id: string;
    kcsynced?: boolean;
    gender: string;
    price: number;
    power_rank_rating: number;
    region?: string;
    position_class: string;
    data_source: string;
    position: string;
    on_dark_image_url?: string;
    on_light_image_url?: string;
    image_url: string;
    nationality: string;
    birth_place: string;
    form: string;
    available: boolean;
    email: string;
    first_name: string;
    last_name: string;
    us_state: string;
    verification_state: string;
    athcoin_balance: string;
    geolocation_allowed: boolean;
    device_id: string;
    encrypted_id: string;
    pref_payout?: string;
    game_updates_preference: string;
    username?: string;
    password: string;
    last_login?: string;
    is_superuser: boolean;
    is_active: boolean;
    team_name: string;
    team_image_url: string;
};