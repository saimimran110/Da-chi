
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  value: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ value, className }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;
  
  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: 5 }).map((_, index) => {
        if (index < fullStars) {
          return <Star key={index} className="w-4 h-4 fill-secondary text-secondary" />;
        } else if (index === fullStars && hasHalfStar) {
          return <StarHalf key={index} className="w-4 h-4 text-secondary" />;
        } else {
          return <Star key={index} className="w-4 h-4 text-gray-300" />;
        }
      })}
      <span className="ml-1 text-sm text-gray-600">{value.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
