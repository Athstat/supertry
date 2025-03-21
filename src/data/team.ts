import { Team } from "../types/team";

const pro_pic =
  "https://eu-cdn.rugbypass.com/webp-images/images/players/hero/452.png.webp?maxw=550";

export const mockTeam: Team = {
  id: "1",
  name: "Thunder Warriors",
  totalPoints: 2456,
  rank: 1,
  formation: "4-4-2",
  players: [
    {
      id: "1",
      name: "John Smith",
      position: "Front Row",
      points: 45,
      form: 7.5,
      price: 5.5,
      team: "Blues",
      nextFixture: "vs RED (H)",
      image: pro_pic,
    },
    {
      id: "2",
      name: "David Martinez",
      position: "Second Row",
      points: 52,
      form: 8.1,
      price: 6.2,
      team: "City",
      nextFixture: "vs UTD (A)",
      image: pro_pic,
    },
    {
      id: "3",
      name: "James Wilson",
      position: "Back Row",
      points: 38,
      form: 6.8,
      price: 5.8,
      team: "United",
      nextFixture: "vs CITY (H)",
      image: pro_pic,
    },
    {
      id: "4",
      name: "Michael Brown",
      position: "Halfback",
      points: 63,
      form: 8.5,
      price: 7.2,
      team: "Rovers",
      nextFixture: "vs WOLVES (A)",
      image: pro_pic,
    },
    {
      id: "5",
      name: "Tom Anderson",
      position: "Back",
      points: 58,
      form: 7.9,
      price: 6.8,
      team: "Athletic",
      nextFixture: "vs PALACE (H)",
      image: pro_pic,
    },
    {
      id: "6",
      name: "Harry Kane",
      position: "Back",
      points: 72,
      form: 9.2,
      price: 8.5,
      team: "Spurs",
      nextFixture: "vs ARSENAL (A)",
      isSubstitute: true,
      image: pro_pic,
    },
    {
      id: "7",
      name: "Marcus Rashford",
      position: "Halfback",
      points: 65,
      form: 8.3,
      price: 7.8,
      team: "United",
      nextFixture: "vs CITY (H)",
      isSubstitute: true,
      image: pro_pic,
    },
  ],
  matchesPlayed: 24,
};
