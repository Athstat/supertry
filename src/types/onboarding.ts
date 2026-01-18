import { IProTeam } from "./team"

export type IOnboardingTab = {
    imageUrl?: string,
    title?: string,
    description?: string
}

export type OnboardingFavouriteTeam = {
    team: IProTeam,
    seasonId: string
}