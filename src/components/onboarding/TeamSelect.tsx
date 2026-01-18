import { useState } from "react";
import { Search, Check } from "lucide-react";
import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons";
import { IProSeason } from "../../types/season";
import useSWR from "swr";
import { swrFetchKeys } from "../../utils/swrKeys";
import { competitionService } from "../../services/competitionsService";
import { IProTeam } from "../../types/team";
import SecondaryText from "../ui/typography/SecondaryText";
import TeamLogo from "../team/TeamLogo";
import NoContentCard from "../ui/typography/NoContentMessage";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import { OnboardingFavouriteTeam } from "../../types/onboarding";

interface TeamSelectProps {
  value: OnboardingFavouriteTeam[];
  onChange: (team: OnboardingFavouriteTeam[]) => void;
  hideSearchbar?: boolean
}

export function TeamSelect({ value, onChange, hideSearchbar = false }: TeamSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { fantasySeasons } = useFantasySeasons();

  return (
    <div className="space-y-4">
      {!hideSearchbar && <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-dark-800/40 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
        />
      </div>}

      {fantasySeasons.map((f) => {
        return (
          <SeasonTeamsList
            season={f}
            key={f.id}
            value={value}
            onChange={onChange}
            searchQuery={searchQuery}
          />
        )
      })}

    </div>
  );
}

type SeasonTeamsListProps = {
  season: IProSeason,
  value: OnboardingFavouriteTeam[],
  onChange?: (team: OnboardingFavouriteTeam[]) => void,
  searchQuery?: string
}

function SeasonTeamsList({ season, value, onChange, searchQuery }: SeasonTeamsListProps) {

  const key = swrFetchKeys.getSeasonTeams(season?.id);
  const { data, isLoading } = useSWR(key, () => competitionService.getTeams(season.competition_id));

  const teams = data || [];


  const filteredTeams = teams.filter((t) => {
    if (searchQuery) {
      const teamName = (t.athstat_name || '').toLowerCase();
      const matchesTeamName = teamName.startsWith(searchQuery.toLowerCase());
      const teamNameParts = teamName.split(' ');

      const matchesParts = teamNameParts.reduce((prevFlag, value) => {
        const matchesPartOfName = value.startsWith(searchQuery.toLowerCase());
        return prevFlag || matchesPartOfName;
      }, false);

      return matchesTeamName || matchesParts;
    }

    return true;
  });

  const isEmpty = filteredTeams.length === 0;

  const getIsTeamSelected = (team: IProTeam) => {
    return Boolean(value.find((t) => t.team.athstat_id === team.athstat_id));
  }



  const handleClickTeam = (team: IProTeam) => {
    if (onChange) {

      const isInList = getIsTeamSelected(team);

      if (isInList) {

        const newList = [...value].filter((t) => t.team.athstat_id !== team.athstat_id);
        onChange(newList);

      } else {

        let newList = [...value].filter((v) => {
          // Remove other selected teams from the same season so only one is selected
          return !teams.find((t) => v.team.athstat_id === t.athstat_id)
        });

        newList = [...newList, {team, seasonId: season.id}];
        onChange(newList);
      }

    }
  }


  return (
    <div
      className="flex flex-col gap-2 py-4"
    >

      <div className="" >
        <p className="font-semibold" >{season.competition_name}</p>
        <SecondaryText>Select one team</SecondaryText>
      </div>

      {isLoading && (
        <LoadingIndicator />
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
        {filteredTeams.map((team) => (
          <TeamCard
            team={team}
            onClick={handleClickTeam}
            isSelected={getIsTeamSelected(team)}
            key={team.athstat_id}
          />
        ))}
      </div>

      {isEmpty && !isLoading && (
        <NoContentCard
          message={searchQuery ? `No team found for '${searchQuery}' ` : "Whoops! We couldn't find any teams"}
        />
      )}
    </div>
  )
}

type TeamCardProps = {
  team: IProTeam,
  onClick?: (team: IProTeam) => void,
  isSelected?: boolean
}

function TeamCard({ team, onClick, isSelected }: TeamCardProps) {

  const handleClick = () => {
    if (onClick && team) {
      onClick(team);
    }
  }

  return (
    <button
      key={team.athstat_id}
      type="button"
      // onClick={() => onChange(team)}
      className={`relative p-4 border-2 rounded-xl transition-all ${isSelected
        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
        : "border-gray-200 dark:border-slate-700 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700"
        }`}

      onClick={handleClick}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <Check className="h-5 w-5 text-primary-500" />
        </div>
      )}
      <div className="flex flex-col items-center gap-2">
        <TeamLogo
          url={team.image_url}
          className="w-10 h-10 object-contain"
        />
        <span className="text-xs max-w-[100px] truncate font-medium text-center dark:text-gray-100">
          {team.athstat_name}
        </span>
      </div>
    </button>
  )
}