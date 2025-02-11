import { Player } from "../types/player";

export const availablePlayers: Player[] = [
  // Front Row Players
  {
    id: "fr1",
    name: "John Smith",
    position: "Front Row",
    team: "Blues",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 95,
    pr: 85,
    points: 120,
  },
  {
    id: "fr2",
    name: "Mike Johnson",
    position: "Front Row",
    team: "Reds",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 85,
    pr: 80,
    points: 80,
  },

  // Second Row Players
  {
    id: "sr1",
    name: "James Wilson",
    position: "Second Row",
    team: "Chiefs",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 90,
    pr: 82,
    points: 82,
  },
  {
    id: "sr2",
    name: "Tom Brown",
    position: "Second Row",
    team: "Hurricanes",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 88,
    pr: 81,
    points: 81,
  },

  // Back Row Players
  {
    id: "br1",
    name: "Sam Taylor",
    position: "Back Row",
    team: "Crusaders",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 92,
    pr: 86,
    points: 86,
  },
  {
    id: "br2",
    name: "David Lee",
    position: "Back Row",
    team: "Highlanders",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 87,
    pr: 83,
    points: 83,
  },

  // Halfback Players
  {
    id: "hb1",
    name: "Aaron Smith",
    position: "Halfback",
    team: "All Blacks",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 98,
    pr: 90,
    points: 90,
  },
  {
    id: "hb2",
    name: "Faf de Klerk",
    position: "Halfback",
    team: "Springboks",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 95,
    pr: 88,
    points: 88,
  },

  // Back Players
  {
    id: "b1",
    name: "Beauden Barrett",
    position: "Back",
    team: "All Blacks",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 99,
    pr: 91,
    points: 91,
  },
  {
    id: "b2",
    name: "Richie Mo'unga",
    position: "Back",
    team: "Crusaders",
    image:
      "https://media.istockphoto.com/id/1203011527/vector/rugby-player-running-with-ball-isolated-vector-silhouette-ink-drawing.jpg?s=612x612&w=0&k=20&c=8ypjaOZdM0xSjvW0ZZh6j7HRK4vmnXwRGoOEWmK9j08=",
    cost: 96,
    pr: 89,
    points: 89,
  },
];

export const availablePlayersWithPoints = availablePlayers.map((player) => ({
  ...player,
  points: player.points || player.pr * 10,
}));
