import { getAuthHeader, getUri } from '../../utils/backendUtils';

export type PresetAthleteItem = {
  athlete_id: string;
  slot: number;
  is_starting: boolean;
  is_captain: boolean;
  purchase_price: number;
};

export type TeamPreset = {
  id: string;
  user_id?: string;
  season_id?: number | null;
  fantasy_league_group_id?: string | null;
  name: string;
  athletes: PresetAthleteItem[];
  created_at?: string;
  updated_at?: string;
};

export type CreatePresetPayload = {
  user_id: string;
  name: string;
  season_id?: number | null;
  fantasy_league_group_id?: string | null;
  athletes: PresetAthleteItem[];
};

export type UpdatePresetPayload = Partial<Omit<CreatePresetPayload, 'user_id'>>;

function buildQuery(params: Record<string, string | number | undefined | null>) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return q ? `?${q}` : '';
}

async function http<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export const teamPresetsService = {
  async list(params: { userId: string; seasonId?: number | string; fantasyLeagueGroupId?: string }) {
    const query = buildQuery({
      user_id: params.userId,
      season_id: params.seasonId,
      fantasy_league_group_id: params.fantasyLeagueGroupId,
    });
    const uri = getUri(`/api/v1/fantasy-teams/presets${query}`);
    return http<TeamPreset[]>(uri, {
      headers: getAuthHeader(),
    });
  },

  async create(payload: CreatePresetPayload) {
    const uri = getUri(`/api/v1/fantasy-teams/presets`);
    return http<TeamPreset>(uri, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(payload),
    });
  },

  async update(id: string, payload: UpdatePresetPayload) {
    const uri = getUri(`/api/v1/fantasy-teams/presets/${id}`);
    return http<TeamPreset>(uri, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(payload),
    });
  },

  async remove(id: string) {
    const uri = getUri(`/api/v1/fantasy-teams/presets/${id}`);
    const res = await fetch(uri, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok && res.status !== 204) {
      const text = await res.text().catch(() => '');
      throw new Error(`Delete failed ${res.status}: ${text || res.statusText}`);
    }
    return true;
  },
};
