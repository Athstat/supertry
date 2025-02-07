import { positions } from './positions';

export const positionGroups = [
  {
    name: 'Front Row',
    positions: positions.filter(p => ['prop1', 'hooker', 'prop2'].includes(p.id))
  },
  {
    name: 'Second Row',
    positions: positions.filter(p => ['lock1', 'lock2'].includes(p.id))
  },
  {
    name: 'Back Row',
    positions: positions.filter(p => ['flanker1', 'number8', 'flanker2'].includes(p.id))
  },
  {
    name: 'Half Backs',
    positions: positions.filter(p => ['scrumhalf', 'flyhalf'].includes(p.id))
  },
  {
    name: 'Centers',
    positions: positions.filter(p => ['center1', 'center2'].includes(p.id))
  },
  {
    name: 'Back Three',
    positions: positions.filter(p => ['wing1', 'fullback', 'wing2'].includes(p.id))
  }
];