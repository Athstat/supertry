import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // Rating from 0-100
  maxStars?: number; // Maximum number of stars (default 5)
  size?: number; // Size of stars (default 12px)
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 12,
  className = "",
}) => {
  // Convert rating (0-100) to stars (0-maxStars)
  const starsCount = Math.min(
    maxStars,
    Math.max(0, Math.round((rating / 100) * maxStars))
  );

  return (
    <div
      className={`flex items-center justify-center space-x-0.5 ${className}`}
    >
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < starsCount
              ? "text-yellow-400 fill-yellow-400" // Filled star
              : "text-gray-300 dark:text-gray-600" // Empty star
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};
