import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  const [animatedRating, setAnimatedRating] = useState(0);

  useEffect(() => {
    // Reset animated rating when a new rating is received
    setAnimatedRating(0);

    // Animate stars appearing one by one
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedRating((prev) => {
          if (prev < rating) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 150); // 150ms between each star appearing

      return () => clearInterval(interval);
    }, 300); // Initial delay before animation starts

    return () => clearTimeout(timeout);
  }, [rating]);

  return (
    <div className="flex justify-center items-center space-x-1">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          size={20}
          className={`transition-all duration-300 transform ${
            index < animatedRating
              ? " text-yellow-500 fill-current scale-110"
              : " text-gray-300 dark:text-gray-400"
          } ${
            index < animatedRating
              ? `animate-[star-pop_300ms_ease-out_${index * 150}ms]`
              : ""
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
