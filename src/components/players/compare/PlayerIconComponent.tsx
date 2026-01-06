import {
  Award,
  User,
  Shield,
  Users,
  Zap,
  Trophy,
  Mail,
  Sparkles,
  Star,
  Target,
} from 'lucide-react';
import { PlayerIcon, PLAYER_ICONS, getIconColorScheme } from '../../../utils/playerIcons';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Gem } from 'lucide-react';
import { Baby } from 'lucide-react';
import { BicepsFlexed } from 'lucide-react';
import { Dumbbell } from 'lucide-react';
import { WandSparkles } from 'lucide-react';
import { Swords } from 'lucide-react';
import { BadgeDollarSign } from 'lucide-react';
import { BrickWall } from 'lucide-react';
import SecondaryText from '../../ui/typography/SecondaryText';

type Props = {
  iconName: PlayerIcon;
  size?: 'sm' | 'md' | 'lg' | 'xs';
};

export default function PlayerIconComponent({ iconName, size = 'md' }: Props) {
  const iconData = PLAYER_ICONS[iconName];
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2',
    xs: 'w-4 h-4 p-1',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xs: 'w-3 h-3',
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
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

  const colorScheme = getIconColorScheme(iconName);

  const renderIcon = () => {
    const iconProps = {
      className: `${iconSizeClasses[size]} text-white`,
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
      case 'Gem':
        return <Gem {...iconProps} />;
      case 'Baby':
        return <Baby {...iconProps} />;
      case 'BicepFlexed':
        return <BicepsFlexed {...iconProps} />;
      case 'Dumbell':
        return <Dumbbell {...iconProps} />;
      case 'WandSparkles':
        return <WandSparkles {...iconProps} />;
      case 'Star':
        return <Star {...iconProps} />;
      case 'Swords':
        return <Swords {...iconProps} />;
      case 'Cash':
        return <BadgeDollarSign {...iconProps} />;
      case 'BrickWall':
        return <BrickWall {...iconProps} />;
      case 'Target':
        return <Target {...iconProps} />;

      default:
        return <Award {...iconProps} />;
    }
  };

  return (
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
      <div className="transform -rotate-45">{renderIcon()}</div>

      {/* Portal-based Tooltip */}
      {showTooltip &&
        createPortal(
          <div
            className="fixed z-30 pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-white dark:bg-slate-900 text-slate-700 dark:text-white px-3 py-2 rounded-lg shadow-xl border border-slate-400 dark:border-slate-600 whitespace-nowrap">
              <div className="text-sm font-bold text-center">{iconData.name}</div>
              <SecondaryText className="text-xs text-center mt-1 max-w-[200px] whitespace-normal">
                {iconData.description}
              </SecondaryText>
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
