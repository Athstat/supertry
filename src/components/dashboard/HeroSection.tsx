import { useNavigate } from "react-router-dom";
import BlueGradientCard from "../shared/BlueGradientCard";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import NewTag from "../branding/NewTag";

type Props = {
};

export function HeroSection({ }: Props) {
  const navigate = useNavigate();
  const navigateToLeagues = () => navigate("/leagues");

  const termsAndConditionsLink = "https://scrummy-app.com/#/scrum6-rules";

  return (
    <BlueGradientCard className="cursor-pointer">
      <div className="flex flex-col gap-4 p-3">

        <div>
          <div>

            <h1 className="text-lg lg:text-xl font-bold">
              SCRUM6 Challenge is LIVE!
            </h1>
          </div>

          <p className="text-md opacity-90">
            Climb the leaderboard, crack the Top 3, and score a Rugby Swag Bag. 🏉🔥
          </p>
        </div>

        <p>⏰ Open now → Closes Sat, 9/13 @ 12:01 AM EST</p>

        <div className="flex flex-row items-center gap-2" >

          <PrimaryButton onClick={navigateToLeagues} className="w-fit bg-white text-blue-500 hover:bg-white hover:text-blue-600 dark:bg-white dark:text-blue-500 hover:dark:bg-white hover:dark:text-blue-600">
            Take Me There
          </PrimaryButton>

          <a href={termsAndConditionsLink} target="blank" className="hover:font-medium ease-out delay-300" >Terms & Conditions</a>
        </div>

      </div>

      {/* {leagueOnTheClock && (
        <JoinDeadlineCountdown
          onViewLeague={onViewLeague}
          league={leagueOnTheClock}
        />
      )} */}

    </BlueGradientCard>
  );
}

// type JoinDeadlineCountdownProps = {
//   league: IFantasyLeague;
//   onViewLeague: (league: IFantasyLeague) => void;
// };

// function JoinDeadlineCountdown({
//   league,
//   onViewLeague,
// }: JoinDeadlineCountdownProps) {
//   const deadline = calculateJoinDeadline(league);
//   if (!deadline) return;

//   const diff = epochDiff(deadline);

//   const { days, hours, seconds, minutes } = useCountdown(diff);

//   const { userTeam, isLoading, rankedUserTeam } = useUserFantasyTeam(league);
//   const { navigateToMyTeam: navigateToMyTeam, navigateToLeagueScreen } = useRouter();

//   const handleCallToAction = () => {
//     // if (userTeam) {
//     //   navigateToMyTeam(userTeam, rankedUserTeam);
//     // } else {
//       // onViewLeague(league);
//     // }
//   };

//   const handleClickCard = () => {
//     navigateToLeagueScreen(league);
//   }


//   return (
//     <div className="flex flex-col p-4 gap-4 sm:gap-6">
//       <div onClick={handleClickCard} className="space-y-2 sm:space-y-4 cursor-pointer">

//         <h1 className="text-lg lg:text-xl flex flex-row items-center gap-1  font-bold tracking-tight">
//           <Trophy className="w-5 h-5" />
//           {league.title}
//         </h1>

//         {/* <p className="text-primary-100 text-sm sm:text-base md:text-lg">
//           Don't miss out on the action. {league.title} starts soon, make sure
//           your team is in!
//         </p> */}

//         <p className="text-primary-100 text-sm sm:text-base md:text-lg" >
//           Don't miss out on the action. {league.title} starts
//           {days >= 1 ?
//             <>{" "}in {days} {days > 1 ? "days" : "day"}</>
//             : <>{" "}in <strong>{hours}:{minutes}:{seconds}</strong></>
//           }
//         </p>


//       </div>

//       {/* <div className="grid grid-cols-4 sm:flex sm:flex-row gap-2 sm:gap-4 items-center justify-start">
//         {timeBlocks.map((block) => (
//           <div
//             key={block.label}
//             className="p-2 sm:p-3 md:min-w-[80px] items-center justify-center flex flex-col rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl"
//           >
//             <p className="font-bold text-lg sm:text-xl md:text-2xl">
//               {block.value.toString().padStart(2, "0")}
//             </p>
//             <p className="text-[10px] sm:text-xs text-primary-100">
//               {block.label}
//             </p>
//           </div>
//         ))}
//       </div> */}

//       <div className="flex items-center gap-4">
//         <button
//           onClick={handleClickCard}
//           className={twMerge(
//             "w-full sm:w-auto text-sm lg:text-base bg-gradient-to-r from-white to-gray-200 via-gray-50 text-primary-800 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg",
//             isLoading && "animate-pulse h-10 opacity-30"
//           )}
//         >
//           {!isLoading && (
//             <>
//               <p>{userTeam ? "View Your Team" : "Pick Your Team"}</p>
//               <ChevronRight size={20} />
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
