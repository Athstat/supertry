import React from "react";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
}) => {
  // Convert the rating to a 0-5 scale
  const scaledRating = (rating / 10) * maxRating;

  return (
    <div className="flex">
      {Array.from({ length: maxRating }).map((_, i) => {
        if (i < Math.floor(scaledRating)) {
          // Full star
          return (
            <Star
              key={i}
              size={12}
              className="text-primary-500 dark:text-primary-400 fill-current"
            />
          );
        } else if (i < Math.floor(scaledRating + 0.5)) {
          // Half star
          return (
            <StarHalf
              key={i}
              size={12}
              className="text-primary-500 dark:text-primary-400 fill-current"
            />
          );
        } else {
          // Empty star
          return (
            <Star
              key={i}
              size={12}
              className="text-gray-300 dark:text-gray-600"
            />
          );
        }
      })}
    </div>
  );
};
