// lib/data.ts
export interface CategoryItem {
  id: string;
  name: string;
  color?: string; // optional color for styling
}

export interface Category {
  name: string;
  instruction: string;
  items: CategoryItem[];
}

export const categoryData: Record<string, Category> = {
  // MONEY
  'money-management': {
    name: 'Money Management',
    instruction: 'How should we handle our money?',
    items: [
      { id: 'joint', name: 'Everything goes into one joint account' },
      { id: 'hybrid', name: 'Joint account for bills, separate for everything else' },
      { id: 'separate', name: 'Keep everything separate and split bills' },
      { id: 'one-manager', name: 'One person manages everything' },
      { id: 'proportional', name: 'Contribute based on income percentage' }
    ]
  },
  'spending-limits': {
    name: 'Spending Limits',
    instruction: 'When do we need to discuss a purchase first?',
    items: [
      { id: 'fifty', name: 'Anything over $50' },
      { id: 'hundred', name: 'Anything over $100' },
      { id: 'twofifty', name: 'Anything over $250' },
      { id: 'fivehundred', name: 'Anything over $500' },
      { id: 'trust', name: 'We trust each other completely' }
    ]
  },
  'eating-out': {
    name: 'Eating Out',
    instruction: 'How often do we eat out or order in?',
    items: [
      { id: 'never', name: 'Almost never, we cook everything' },
      { id: 'special', name: 'Special occasions only' },
      { id: 'weekends', name: 'Weekend routine' },
      { id: 'regular', name: '2-3 times a week' },
      { id: 'always', name: 'We basically live at restaurants' }
    ]
  },

  // FAMILY & SOCIAL
  'holidays': {
    name: 'Holidays',
    instruction: 'Where do we spend Thanksgiving and Christmas?',
    items: [
      { id: 'rotation', name: 'Alternate between our families each year' },
      { id: 'host', name: 'Host everyone at our place' },
      { id: 'marathon', name: 'Hit both families in one day' },
      { id: 'travel', name: 'Skip family and travel somewhere' },
      { id: 'friends', name: 'Include friends too' }
    ]
  },
  'john-moonyoung': {
    name: 'John & Moonyoung',
    instruction: 'How often do we see them?',
    items: [
      { id: 'weekly', name: 'Every week' },
      { id: 'monthly', name: 'Monthly dinner and hangouts' },
      { id: 'quarterly', name: 'Every few months' },
      { id: 'babysitting', name: 'Only when we need babysitting' },
      { id: 'vacation', name: 'Vacation together sometimes' }
    ]
  },
  'our-friends': {
    name: 'Our Friends',
    instruction: 'How do we handle our separate friend groups?',
    items: [
      { id: 'merge', name: 'Merge everyone into one friend group' },
      { id: 'separate', name: 'Keep our friend groups separate' },
      { id: 'some-overlap', name: 'Some overlap but mostly separate' },
      { id: 'couple-friends', name: 'Make new couple friends together' },
      { id: 'whoever', name: 'Whoever gets along gets along' }
    ]
  },

  // HOME
  'house-type': {
    name: 'House Type',
    instruction: 'What kind of place do we want?',
    items: [
      { id: 'one-bed', name: '1 bedroom apartment' },
      { id: 'two-bed', name: '2 bedroom apartment' },
      { id: 'small-house', name: 'Small house with yard' },
      { id: 'big-house', name: 'Bigger house, room to grow' },
      { id: 'condo', name: 'Condo or townhouse' }
    ]
  },
  'cleanliness': {
    name: 'Cleanliness',
    instruction: 'How clean should the house be?',
    items: [
      { id: 'spotless', name: 'Spotless at all times' },
      { id: 'tidy', name: 'Neat and organized' },
      { id: 'lived-in', name: 'Lived-in but not dirty' },
      { id: 'messy', name: 'Messy is fine' },
      { id: 'hire', name: 'We should hire someone' }
    ]
  },

  // DAILY LIFE
  'morning-routine': {
    name: 'Morning Routine',
    instruction: 'How do mornings work?',
    items: [
      { id: 'together', name: 'Get ready together in the bathroom' },
      { id: 'separate', name: 'Completely separate routines' },
      { id: 'staggered', name: 'One person leaves first' },
      { id: 'alarm-chaos', name: 'Multiple alarms, figure it out' },
      { id: 'no-schedule', name: 'No set schedule, totally flexible' }
    ]
  },
  'night-routine': {
    name: 'Bedtime',
    instruction: 'What are the bedtime expectations?',
    items: [
      { id: 'together', name: 'Always go to bed at the same time' },
      { id: 'wait', name: 'Wait for each other before sleeping' },
      { id: 'join-quietly', name: 'Join whenever, do not wake the other' },
      { id: 'separate', name: 'Different bedtimes are fine' },
      { id: 'flexible', name: 'No expectations, totally flexible' }
    ]
  },
  'decision-making': {
    name: 'Decisions',
    instruction: 'Who decides what for dinner, plans, and big choices?',
    items: [
      { id: 'discuss-all', name: 'Discuss everything together' },
      { id: 'take-turns', name: 'Take turns deciding' },
      { id: 'whoever-cares', name: 'Whoever cares more decides' },
      { id: 'split-domains', name: 'Each person owns certain decisions' },
      { id: 'go-with-flow', name: 'Just go with the flow' }
    ]
  },

  // RELATIONSHIP VIBE
  'fighting': {
    name: 'Fighting',
    instruction: 'We just had a fight. What do you need?',
    items: [
      { id: 'space', name: 'Space to cool down' },
      { id: 'talk-now', name: 'To talk it out right now' },
      { id: 'physical', name: 'Physical comfort first' },
      { id: 'write', name: 'To write down my thoughts' },
      { id: 'move-on', name: 'To just move on' }
    ]
  },
  'friday-night': {
    name: 'Friday Night',
    instruction: 'It is Friday after a long week. What sounds good?',
    items: [
      { id: 'out', name: 'Go out for dinner and drinks' },
      { id: 'couch', name: 'Stay in and order takeout' },
      { id: 'host', name: 'Have friends over' },
      { id: 'active', name: 'Go for a walk or to the gym' },
      { id: 'movie', name: 'See a movie' }
    ]
  },
  'opposite-sex': {
    name: 'Opposite Sex Friendships',
    instruction: 'Hanging out with friends of the opposite sex?',
    items: [
      { id: 'anytime', name: 'Totally fine one-on-one anytime' },
      { id: 'heads-up', name: 'Fine in groups, one-on-one with a heads up' },
      { id: 'advance-notice', name: 'Fine occasionally with advance notice' },
      { id: 'groups-only', name: 'Only in group settings' },
      { id: 'prefer-not', name: 'Prefer not to' }
    ]
  }
};
