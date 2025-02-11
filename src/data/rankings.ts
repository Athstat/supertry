import { Player } from "../types/player";

interface RankedPlayer
  extends Omit<
    Player,
    | "position"
    | "form"
    | "price"
    | "team"
    | "nextFixture"
    | "image"
    | "cost"
    | "pr"
  > {
  rank: number;
  previousRank: number;
  avatar: string;
  isCurrentUser: boolean;
}

export const rankingsData: {
  id: number;
  name: string;
  players: RankedPlayer[];
}[] = [
  {
    id: 3,
    name: "Division 3",
    players: [
      {
        id: "1",
        rank: 1,
        previousRank: 2,
        name: "John Smith",
        avatar:
          "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,q_auto,w_720/67338e73953975001dd4b461.png",
        points: 2856,
        isCurrentUser: false,
      },
      {
        id: "2",
        rank: 2,
        previousRank: 1,
        name: "You",
        avatar:
          "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,q_auto,w_720/67338d48953975001dd4b446.png",
        points: 2754,
        isCurrentUser: true,
      },
      {
        id: "3",
        rank: 3,
        previousRank: 3,
        name: "Mike Wilson",
        avatar:
          "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,q_auto,w_720/67338d47953975001dd4b42c.png",
        points: 2698,
        isCurrentUser: false,
      },
      {
        id: "4",
        rank: 4,
        previousRank: 6,
        name: "Emma Davis",
        avatar:
          "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,q_auto,w_720/67338d47953975001dd4b42b.png",
        points: 2645,
        isCurrentUser: false,
      },
      {
        id: "5",
        rank: 5,
        previousRank: 4,
        name: "James Brown",
        avatar:
          "https://res.cloudinary.com/jerrick/image/upload/d_642250b563292b35f27461a7.png,f_jpg,q_auto,w_720/67338d47953975001dd4b430.png",
        points: 2589,
        isCurrentUser: false,
      },
      {
        id: "6",
        rank: 6,
        previousRank: 5,
        name: "Lisa Anderson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
        points: 2534,
        isCurrentUser: false,
      },
      {
        id: "7",
        rank: 7,
        previousRank: 8,
        name: "David Martinez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        points: 2498,
        isCurrentUser: false,
      },
      {
        id: "8",
        rank: 8,
        previousRank: 7,
        name: "Sophie Taylor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
        points: 2467,
        isCurrentUser: false,
      },
      {
        id: "9",
        rank: 9,
        previousRank: 10,
        name: "Alex Thompson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        points: 2423,
        isCurrentUser: false,
      },
      {
        id: "10",
        rank: 10,
        previousRank: 9,
        name: "Oliver White",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
        points: 2389,
        isCurrentUser: false,
      },
      {
        id: "11",
        rank: 11,
        previousRank: 12,
        name: "Emily Clark",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        points: 2356,
        isCurrentUser: false,
      },
      {
        id: "12",
        rank: 12,
        previousRank: 11,
        name: "Daniel Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
        points: 2312,
        isCurrentUser: false,
      },
      {
        id: "13",
        rank: 13,
        previousRank: 14,
        name: "Isabella Garcia",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
        points: 2278,
        isCurrentUser: false,
      },
      {
        id: "14",
        rank: 14,
        previousRank: 13,
        name: "William Turner",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=William",
        points: 2245,
        isCurrentUser: false,
      },
      {
        id: "15",
        rank: 15,
        previousRank: 15,
        name: "Isabella Garcia",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
        points: 2198,
        isCurrentUser: false,
      },
    ],
  },
];
