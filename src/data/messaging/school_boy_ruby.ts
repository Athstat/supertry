import { ISbrFixture } from "../../types/sbr";
import { replaceDashesWithUnderscrolls } from "../../utils/stringUtils";

/** School Boy rugby channel URL */
export const SCHOOL_BOY_RUGBY_CHANNEL_URL = 
    "sendbird_group_channel_school_boy_rugby";

/** School Boy Ruby Channel Name */
export const SCHOOL_BOY_RUGBY_CHANNEL_NAME = 
    "School Boy Rugby Chat";


export function getSbrFixtureChannelUrl(fixture: ISbrFixture) {
    const url = `sendbird_sbr_fixture_channel_${fixture.fixture_id}`;
    return replaceDashesWithUnderscrolls(url);
}

export function getSbrFixtureChannelName(fixture: ISbrFixture) {
    const name = `${fixture.home_team} vs ${fixture.away_team}`;
    return name;
}