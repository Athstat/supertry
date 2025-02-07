import React from "react";

interface NewsCardProps {
  title: string;
  time: string;
  image: string;
}

export function NewsCard({ title, time, image }: NewsCardProps) {
  return (
    <div
      className="flex gap-4 p-3 rounded-xl 
      dark:bg-gray-700/20 dark:bg-dark-800/40 hover:bg-gray-700/30 dark:hover:bg-dark-800/60
      transition-all duration-200 backdrop-blur-sm cursor-pointer"
    >
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex flex-col justify-between py-1">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
          {title}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">{time}</span>
      </div>
    </div>
  );
}
