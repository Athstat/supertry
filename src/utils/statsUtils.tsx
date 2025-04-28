import { Award, Flame, Star } from "lucide-react";

export const getStatBadge = (statName: string, value: number) => {
  if (value >= 4.5)
    return {
      icon: <Award size={16} className="text-yellow-500" />,
      label: "League Leader",
    };
  if (value >= 4)
    return {
      icon: <Flame size={16} className="text-orange-500" />,
      label: "On Fire",
    };
  if (value >= 3.5)
    return {
      icon: <Star size={16} className="text-blue-500" />,
      label: "Rising Star",
    };
  return null;
};