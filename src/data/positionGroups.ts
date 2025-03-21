import { positions } from "./positions";

export const positionGroups = [
  {
    name: "Front Row",
    positions: positions.filter((p) => p.id === "front-row"),
  },
  {
    name: "Second Row",
    positions: positions.filter((p) => p.id === "second-row"),
  },
  {
    name: "Back Row",
    positions: positions.filter((p) => p.id === "back-row"),
  },
  {
    name: "Halfback",
    positions: positions.filter((p) => p.id === "half-back"),
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
