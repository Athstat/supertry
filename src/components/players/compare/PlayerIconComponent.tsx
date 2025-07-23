import { 
  Award, 
  User, 
  Shield, 
  Users, 
  Zap, 
  Trophy, 
  Mail, 
  Sparkles 
} from 'lucide-react';
import { PlayerIcon, PLAYER_ICONS } from '../../../utils/playerIcons';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  iconName: PlayerIcon;
  size?: 'sm' | 'md' | 'lg';
};

export default function PlayerIconComponent({ iconName, size = 'md' }: Props) {
  const iconData = PLAYER_ICONS[iconName];
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Calculate optimal position to avoid viewport edges
    let x = rect.left + rect.width / 2;
    let y = rect.top - 10;
    
    // Adjust horizontal position if too close to edges
    const tooltipWidth = 200; // estimated tooltip width
    const horizontalMargin = 20; // increased margin for better aesthetics
    if (x - tooltipWidth / 2 < horizontalMargin) {
      x = tooltipWidth / 2 + horizontalMargin;
    } else if (x + tooltipWidth / 2 > viewport.width - horizontalMargin) {
      x = viewport.width - tooltipWidth / 2 - horizontalMargin;
    }
    
    // Adjust vertical position if too close to top
    const verticalMargin = 100; // increased margin for better spacing
    if (y < verticalMargin) {
      y = rect.bottom + 15; // Show below instead with more spacing
    }
    
    setTooltipPosition({ x, y });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Different color schemes for different icon types
  const getColorScheme = (iconName: PlayerIcon) => {
    switch (iconName) {
      case 'Diamond In the Ruff':
        return {
          bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
          border: 'border-purple-300'
        };
      case 'Rookie':
        return {
          bg: 'bg-gradient-to-br from-green-400 to-green-600',
          border: 'border-green-300'
        };
      case 'Captain':
        return {
          bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
          border: 'border-yellow-300'
        };
      case 'Game Changer':
        return {
          bg: 'bg-gradient-to-br from-red-400 to-red-600',
          border: 'border-red-300'
        };
      case 'Speed Merchant':
        return {
          bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
          border: 'border-blue-300'
        };
      case 'Scrum Master':
        return {
          bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
          border: 'border-orange-300'
        };
      case 'Ruck Master':
        return {
          bg: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
          border: 'border-indigo-300'
        };
      case 'Media Darling':
        return {
          bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
          border: 'border-pink-300'
        };
      case 'Magician':
        return {
          bg: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
          border: 'border-cyan-300'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
          border: 'border-gray-300'
        };
    }
  };

  const colorScheme = getColorScheme(iconName);

  const renderIcon = () => {
    const iconProps = {
      className: `${iconSizeClasses[size]} text-white`
    };

    switch (iconData.iconType) {
      case 'Award':
        return <Award {...iconProps} />;
      case 'User':
        return <User {...iconProps} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      case 'Zap':
        return <Zap {...iconProps} />;
      case 'Trophy':
        return <Trophy {...iconProps} />;
      case 'Mail':
        return <Mail {...iconProps} />;
      case 'Sparkles':
        return <Sparkles {...iconProps} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  return (
    <div className="relative">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorScheme.bg}
          flex items-center justify-center 
          shadow-md
          border-2 ${colorScheme.border}
          transform rotate-45
          cursor-pointer
          hover:scale-110
          transition-transform duration-200
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="transform -rotate-45">
          {renderIcon()}
        </div>
      </div>
      
      {/* Portal-based Tooltip */}
      {showTooltip && createPortal(
        <div 
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-slate-800 dark:bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl border border-slate-600 whitespace-nowrap">
            <div className="text-sm font-bold text-center">{iconData.name}</div>
            <div className="text-xs text-slate-300 text-center mt-1 max-w-[200px] whitespace-normal">{iconData.description}</div>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-slate-800 dark:border-t-slate-900"></div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
