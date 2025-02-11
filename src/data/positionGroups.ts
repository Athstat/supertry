import { positions } from "./positions";

export const positionGroups = [
  {
    name: "Front Row",
    positions: positions.filter((p) => p.id === "frontrow"),
  },
  {
    name: "Second Row",
    positions: positions.filter((p) => p.id === "secondrow"),
  },
  {
    name: "Back Row",
    positions: positions.filter((p) => p.id === "backrow"),
  },
  {
    name: "Halfback",
    positions: positions.filter((p) => p.id === "halfback"),
  },
  {
    name: "Back",
    positions: positions.filter((p) => p.id === "back"),
  },
].map((group) => ({
  ...group,
  positions: group.positions.length
    ? group.positions
    : [
        positions.find(
          (p) => p.id === group.name.toLowerCase().replace(" ", "")
        )!,
      ],
}));
