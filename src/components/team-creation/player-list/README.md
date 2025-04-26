# Player List Component Architecture

This folder contains the components for the player selection modal with responsive design patterns that separate desktop and mobile layouts for optimal user experience.

## Responsive Design Strategy

The player list uses a responsive architecture that detects the device viewport and renders different layouts:

- **Mobile View**: A compact, optimized 2-row-per-player table layout showing key stats
- **Desktop View**: A more detailed horizontal scrollable table with all player statistics

## Components Overview

### Core Components

- `PlayerList.tsx`: Main component that conditionally renders either mobile or desktop view
- `PlayerListMobile.tsx`: Mobile-specific view with a 2-row table layout
- `PlayerListDesktop.tsx`: Desktop view that uses the original PlayerListView

### Reusable Components

- `SortableHeader.tsx`: Header cells for sorting with visual feedback
- `PlayerRowMobile.tsx`: Renders a player's info in the 2-row format for mobile

## Mobile-First Table Layout

The mobile table layout uses a 2-row approach for each player:

1. **Row 1**: Player information

   - Image cell (rowSpan=2)
   - Player name, team name, and add button

2. **Row 2**: Player statistics
   - Cost
   - Power Rank
   - Attack rating (stars)
   - Defense rating (stars)
   - Kicking rating (stars)

## Features

- **Sticky Header**: The table header stays fixed while scrolling
- **Sortable Columns**: Tap column headers to sort players
- **Visual Sorting**: Shows sort direction arrows
- **Image Zooming**: Player images are zoomed to face for better visibility
- **Add Player Button**: Direct player selection from the list view
- **Visual Feedback**: Selected players show a checkmark

## Technical Implementation

- Uses `useMediaQuery` hook for responsive detection
- Local sorting management in the mobile component
- Preserves global sorting in desktop view
- Progressive enhancement for different screen sizes

## Usage

The PlayerList component will automatically render the appropriate view based on the device viewport.
