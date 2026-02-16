// lib/data.ts
export interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

export interface Category {
  name: string;
  instruction: string;
  icon: string;
  items: CategoryItem[];
}

export const categoryData: Record<string, Category> = {
  // MONEY & FINANCE
  'finance-philosophy': {
    name: 'Money Management',
    instruction: 'How should we handle our money?',
    icon: '💰',
    items: [
      { id: 'total-fusion', name: 'Everything goes into one joint account', image: '/money/fusion.jpg' },
      { id: 'hybrid-model', name: 'Joint account for bills, separate for everything else', image: '/money/hybrid.jpg' },
      { id: 'roommate-style', name: 'Keep everything separate and split bills', image: '/money/venmo.jpg' },
      { id: 'allowance', name: 'One person manages everything', image: '/money/allowance.jpg' },
      { id: 'proportional', name: 'Contribute based on income percentage', image: '/money/percent.jpg' }
    ]
  },
  'purchase-permission': {
    name: 'Big Purchases',
    instruction: 'When do we need to check with each other before buying something?',
    icon: '💳',
    items: [
      { id: 'low-bar', name: 'Anything over $50', image: '/money/50.jpg' },
      { id: 'standard', name: 'Anything over $100', image: '/money/100.jpg' },
      { id: 'trust', name: 'Anything over $250', image: '/money/250.jpg' },
      { id: 'big-ticket', name: 'Anything over $500', image: '/money/500.jpg' },
      { id: 'no-limit', name: 'We trust each other completely', image: '/money/infinity.jpg' }
    ]
  },
  'fun-money': {
    name: 'Personal Spending',
    instruction: 'How much should each person get for their own stuff each month?',
    icon: '💸',
    items: [
      { id: 'tier-1', name: '$100', image: '/money/t1.jpg' },
      { id: 'tier-2', name: '$300', image: '/money/t2.jpg' },
      { id: 'tier-3', name: '$500', image: '/money/t3.jpg' },
      { id: 'tier-4', name: '$1,000', image: '/money/t4.jpg' },
      { id: 'tier-5', name: 'No set amount', image: '/money/t5.jpg' }
    ]
  },
  'windfall-strategy': {
    name: 'Extra Money',
    instruction: 'We suddenly get $10,000. What should we do with it?',
    icon: '🧧',
    items: [
      { id: 'invest', name: 'Invest it', image: '/money/stocks.jpg' },
      { id: 'travel', name: 'Take an amazing vacation', image: '/money/travel.jpg' },
      { id: 'debt', name: 'Pay off debt', image: '/money/debt.jpg' },
      { id: 'home', name: 'Put it toward a house', image: '/money/home.jpg' },
      { id: 'splurge', name: 'Spend it on things we want', image: '/money/shop.jpg' }
    ]
  },

  // FAMILY & SOCIAL
  'holiday-treaty': {
    name: 'Holidays',
    instruction: 'Where do we spend Thanksgiving and Christmas?',
    icon: '🦃',
    items: [
      { id: 'rotation', name: 'Alternate between our families each year', image: '/family/swap.jpg' },
      { id: 'host-all', name: 'Host everyone at our place', image: '/family/host.jpg' },
      { id: 'marathon', name: 'Hit both families in one day', image: '/family/split.jpg' },
      { id: 'escape', name: 'Skip family and travel somewhere', image: '/family/island.jpg' },
      { id: 'open-house', name: 'Include friends too', image: '/family/friends.jpg' }
    ]
  },
  'in-law-frequency': {
    name: 'Seeing Parents',
    instruction: 'How often should we see our parents?',
    icon: '👵',
    items: [
      { id: 'weekly', name: 'Every week', image: '/family/weekly.jpg' },
      { id: 'monthly', name: 'Once a month', image: '/family/monthly.jpg' },
      { id: 'quarterly', name: 'Every few months', image: '/family/quarterly.jpg' },
      { id: 'holidays', name: 'Just holidays', image: '/family/holiday.jpg' },
      { id: 'spontaneous', name: 'They can drop by whenever', image: '/family/door.jpg' }
    ]
  },
  'sibling-strategy': {
    name: 'Siblings',
    instruction: 'How close are we with our siblings?',
    icon: '👯',
    items: [
      { id: 'besties', name: 'Talk to them every day', image: '/family/besties.jpg' },
      { id: 'vacation', name: 'Vacation together regularly', image: '/family/trip.jpg' },
      { id: 'occasional', name: 'Grab dinner every few months', image: '/family/dinner.jpg' },
      { id: 'holidays', name: 'Only see them at holidays', image: '/family/xmas.jpg' },
      { id: 'babysitters', name: 'Mainly when we need babysitting', image: '/family/aunt.jpg' }
    ]
  },

  // HOME & LIVING
  'location-scouting': {
    name: 'Where We Live',
    instruction: 'What kind of place do we want to live?',
    icon: '📍',
    items: [
      { id: 'city', name: 'City apartment or condo', image: '/home/city.jpg' },
      { id: 'suburb', name: 'House in the suburbs', image: '/home/suburb.jpg' },
      { id: 'rural', name: 'Somewhere quiet and rural', image: '/home/farm.jpg' },
      { id: 'coastal', name: 'Near the beach', image: '/home/beach.jpg' },
      { id: 'nomad', name: 'Move around frequently', image: '/home/travel.jpg' }
    ]
  },
  'chore-division': {
    name: 'Chores',
    instruction: 'Which chore would you rather do?',
    icon: '🧹',
    items: [
      { id: 'dishes', name: 'Dishes and kitchen cleanup', image: '/chores/dishes.jpg' },
      { id: 'laundry', name: 'Laundry', image: '/chores/laundry.jpg' },
      { id: 'bathrooms', name: 'Cleaning bathrooms', image: '/chores/toilet.jpg' },
      { id: 'floors', name: 'Vacuuming and mopping', image: '/chores/vacuum.jpg' },
      { id: 'admin', name: 'Paying bills and scheduling', image: '/chores/bills.jpg' }
    ]
  },
  'mess-tolerance': {
    name: 'Cleanliness',
    instruction: 'How clean should the house be?',
    icon: '🧺',
    items: [
      { id: 'museum', name: 'Spotless at all times', image: '/home/clean.jpg' },
      { id: 'tidy', name: 'Neat and organized', image: '/home/tidy.jpg' },
      { id: 'cozy', name: 'Lived-in but not dirty', image: '/home/messy.jpg' },
      { id: 'chaos', name: 'Messy is fine', image: '/home/chaos.jpg' },
      { id: 'hired', name: 'We should hire someone', image: '/home/maid.jpg' }
    ]
  },
  'sleep-sanctuary': {
    name: 'Bedroom',
    instruction: 'What happens in the bedroom at night?',
    icon: '🛌',
    items: [
      { id: 'tv', name: 'Watch TV until we fall asleep', image: '/sleep/tv.jpg' },
      { id: 'scroll', name: 'Scroll on our phones', image: '/sleep/phone.jpg' },
      { id: 'cuddle', name: 'Cuddle the whole night', image: '/sleep/cuddle.jpg' },
      { id: 'blackout', name: 'Pitch black and silent', image: '/sleep/mask.jpg' },
      { id: 'pets', name: 'Pets sleep in bed with us', image: '/sleep/dog.jpg' }
    ]
  },
  'guest-policy': {
    name: 'House Guests',
    instruction: 'Your friend wants to stay at our place. How do you feel?',
    icon: '🛋️',
    items: [
      { id: 'anytime', name: 'They can come whenever', image: '/social/open.jpg' },
      { id: 'weekend', name: 'Only on weekends', image: '/social/weekend.jpg' },
      { id: 'notice', name: 'Need at least a week notice', image: '/social/calendar.jpg' },
      { id: 'hotel', name: 'I would rather pay for their hotel', image: '/social/hotel.jpg' },
      { id: 'dinner', name: 'Dinner is fine, but no sleepovers', image: '/social/dinner.jpg' }
    ]
  },

  // CONFLICT & VIBE
  'conflict-style': {
    name: 'Fighting',
    instruction: 'We just had a fight. What do you need?',
    icon: '🏳️',
    items: [
      { id: 'space', name: 'Space to cool down', image: '/love/space.jpg' },
      { id: 'solve', name: 'To talk it out right now', image: '/love/talk.jpg' },
      { id: 'touch', name: 'Physical comfort first', image: '/love/hug.jpg' },
      { id: 'write', name: 'To write down my thoughts', image: '/love/letter.jpg' },
      { id: 'peace', name: 'To just move on', image: '/love/peace.jpg' }
    ]
  },
  'social-battery': {
    name: 'Friday Night',
    instruction: 'It is Friday after a long week. What sounds good?',
    icon: '🔋',
    items: [
      { id: 'out', name: 'Go out for dinner and drinks', image: '/social/cocktail.jpg' },
      { id: 'couch', name: 'Stay in and order takeout', image: '/social/couch.jpg' },
      { id: 'host', name: 'Have friends over', image: '/social/game.jpg' },
      { id: 'active', name: 'Go for a walk or to the gym', image: '/social/run.jpg' },
      { id: 'movie', name: 'See a movie', image: '/social/cinema.jpg' }
    ]
  },
  'vacation-mode': {
    name: 'Vacation Style',
    instruction: 'We are on vacation. What is the plan?',
    icon: '✈️',
    items: [
      { id: 'relax', name: 'Relax by the pool or beach', image: '/travel/pool.jpg' },
      { id: 'foodie', name: 'Try as many restaurants as possible', image: '/travel/food.jpg' },
      { id: 'explorer', name: 'See all the museums and attractions', image: '/travel/walk.jpg' },
      { id: 'adventure', name: 'Do adventurous activities', image: '/travel/hike.jpg' },
      { id: 'luxury', name: 'Spa and resort relaxation', image: '/travel/spa.jpg' }
    ]
  }
};
