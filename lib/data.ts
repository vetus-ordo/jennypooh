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
    name: 'The Treasury Department',
    instruction: 'How do we stack our gold? Rank your ideal setup:',
    icon: '💰',
    items: [
      { id: 'total-fusion', name: 'Total Fusion (100% Joint)', image: '/money/fusion.jpg' },
      { id: 'hybrid-model', name: 'Hybrid (Joint Bills + Separate Fun)', image: '/money/hybrid.jpg' },
      { id: 'roommate-style', name: 'Venmo Vibes (Separate + Split)', image: '/money/venmo.jpg' },
      { id: 'allowance', name: 'One Earner / One Spender', image: '/money/allowance.jpg' },
      { id: 'proportional', name: 'Proportional (Earn more = Pay more)', image: '/money/percent.jpg' }
    ]
  },
  'purchase-permission': {
    name: 'The "Babe, Can I?" Bar',
    instruction: 'At what price point must we check in before buying?',
    icon: '💳',
    items: [
      { id: 'low-bar', name: '$50 (The "I ask about everything" tier)', image: '/money/50.jpg' },
      { id: 'standard', name: '$100 (The Target Run Limit)', image: '/money/100.jpg' },
      { id: 'trust', name: '$250 (The "Serious Treat" Limit)', image: '/money/250.jpg' },
      { id: 'big-ticket', name: '$500 (Major Purchases Only)', image: '/money/500.jpg' },
      { id: 'no-limit', name: 'No Limit (Total Chaos/Trust)', image: '/money/infinity.jpg' }
    ]
  },
  'fun-money': {
    name: 'The Discretionary Fund',
    instruction: 'Ideally, how much "Guilt-Free" money does each person get monthly?',
    icon: '💸',
    items: [
      { id: 'tier-1', name: '$100 (Coffee & Snacks)', image: '/money/t1.jpg' },
      { id: 'tier-2', name: '$300 (The Hobbyist)', image: '/money/t2.jpg' },
      { id: 'tier-3', name: '$500 (The Fashionista)', image: '/money/t3.jpg' },
      { id: 'tier-4', name: '$1,000 (The Baller)', image: '/money/t4.jpg' },
      { id: 'tier-5', name: 'Unlimited (We just vibe)', image: '/money/t5.jpg' }
    ]
  },
  'windfall-strategy': {
    name: 'The Windfall Protocol',
    instruction: 'We get a surprise $10k. What is the PRIORITY?',
    icon: '🧧',
    items: [
      { id: 'invest', name: 'Boring Index Funds (Future Us)', image: '/money/stocks.jpg' },
      { id: 'travel', name: 'Epic Luxury Vacation (Present Us)', image: '/money/travel.jpg' },
      { id: 'debt', name: 'Kill Any/All Debt', image: '/money/debt.jpg' },
      { id: 'home', name: 'Home Improvement / Down Payment', image: '/money/home.jpg' },
      { id: 'splurge', name: 'Shopping Spree', image: '/money/shop.jpg' }
    ]
  },

  // FAMILY & SOCIAL
  'holiday-treaty': {
    name: 'The Holiday Treaty',
    instruction: 'It is Thanksgiving. Where are we?',
    icon: '🦃',
    items: [
      { id: 'rotation', name: 'Strict Rotation (Year A: Yours, Year B: Mine)', image: '/family/swap.jpg' },
      { id: 'host-all', name: 'We Host Everyone', image: '/family/host.jpg' },
      { id: 'marathon', name: 'The Marathon (Lunch @ Yours, Dinner @ Mine)', image: '/family/split.jpg' },
      { id: 'escape', name: 'We Travel Alone (Island Christmas)', image: '/family/island.jpg' },
      { id: 'open-house', name: 'Open House (Friends welcome)', image: '/family/friends.jpg' }
    ]
  },
  'in-law-frequency': {
    name: 'Parental Proximity',
    instruction: 'How often do we ideally see the in-laws?',
    icon: '👵',
    items: [
      { id: 'weekly', name: 'Weekly Sunday Dinner', image: '/family/weekly.jpg' },
      { id: 'monthly', name: 'Once a Month Visit', image: '/family/monthly.jpg' },
      { id: 'quarterly', name: 'Every Few Months', image: '/family/quarterly.jpg' },
      { id: 'holidays', name: 'Major Holidays Only', image: '/family/holiday.jpg' },
      { id: 'spontaneous', name: 'Pop-ins Welcome Anytime', image: '/family/door.jpg' }
    ]
  },
  'sibling-strategy': {
    name: 'The Sibling Strategy',
    instruction: 'How involved are siblings in our lives?',
    icon: '👯',
    items: [
      { id: 'besties', name: 'Best Friends (Daily Chats)', image: '/family/besties.jpg' },
      { id: 'vacation', name: 'Travel Buddies', image: '/family/trip.jpg' },
      { id: 'occasional', name: 'Friendly Catch-ups', image: '/family/dinner.jpg' },
      { id: 'holidays', name: 'See them at Christmas', image: '/family/xmas.jpg' },
      { id: 'babysitters', name: 'Strictly "Aunt/Uncle" duty', image: '/family/aunt.jpg' }
    ]
  },

  // HOME & LIVING
  'location-scouting': {
    name: 'The Forever Fortress',
    instruction: 'Where do we plant our flag?',
    icon: '📍',
    items: [
      { id: 'city', name: 'Downtown Penthouse', image: '/home/city.jpg' },
      { id: 'suburb', name: 'Suburban House & Yard', image: '/home/suburb.jpg' },
      { id: 'rural', name: 'Quiet Farmhouse', image: '/home/farm.jpg' },
      { id: 'coastal', name: 'Beach House', image: '/home/beach.jpg' },
      { id: 'nomad', name: 'Digital Nomads (New city monthly)', image: '/home/travel.jpg' }
    ]
  },
  'chore-division': {
    name: 'The Grunt Work',
    instruction: 'Which chore do you LEAST mind doing?',
    icon: '🧹',
    items: [
      { id: 'dishes', name: 'Dishes & Kitchen', image: '/chores/dishes.jpg' },
      { id: 'laundry', name: 'Laundry (Wash/Fold/Away)', image: '/chores/laundry.jpg' },
      { id: 'bathrooms', name: 'Scrubbing Toilets', image: '/chores/toilet.jpg' },
      { id: 'floors', name: 'Vacuuming & Mopping', image: '/chores/vacuum.jpg' },
      { id: 'admin', name: 'Bills & Scheduling', image: '/chores/bills.jpg' }
    ]
  },
  'mess-tolerance': {
    name: 'Clutter Threshold',
    instruction: 'How "lived in" is the house?',
    icon: '🧺',
    items: [
      { id: 'museum', name: 'Museum Grade (Zero items on counters)', image: '/home/clean.jpg' },
      { id: 'tidy', name: 'Tidy (Everything has a place)', image: '/home/tidy.jpg' },
      { id: 'cozy', name: 'Cozy Clutter (Books/Blankets)', image: '/home/messy.jpg' },
      { id: 'chaos', name: 'Creative Chaos', image: '/home/chaos.jpg' },
      { id: 'hired', name: 'We hire help so we don’t fight', image: '/home/maid.jpg' }
    ]
  },
  'sleep-sanctuary': {
    name: 'Sleep Sanctuary',
    instruction: 'What is the bedroom rule?',
    icon: '🛌',
    items: [
      { id: 'tv', name: 'Fall asleep to Netflix', image: '/sleep/tv.jpg' },
      { id: 'scroll', name: 'Phone scrolling side-by-side', image: '/sleep/phone.jpg' },
      { id: 'cuddle', name: 'Cuddle Puddle (Touching all night)', image: '/sleep/cuddle.jpg' },
      { id: 'blackout', name: 'Silence & Blackout Mask', image: '/sleep/mask.jpg' },
      { id: 'pets', name: 'Pets in the bed', image: '/sleep/dog.jpg' }
    ]
  },
  'guest-policy': {
    name: 'Open Door Policy',
    instruction: 'A friend wants to crash. What is the vibe?',
    icon: '🛋️',
    items: [
      { id: 'anytime', name: 'Come over anytime!', image: '/social/open.jpg' },
      { id: 'weekend', name: 'Weekends Only', image: '/social/weekend.jpg' },
      { id: 'notice', name: '1 Week Notice Minimum', image: '/social/calendar.jpg' },
      { id: 'hotel', name: 'I will pay for their Hotel', image: '/social/hotel.jpg' },
      { id: 'dinner', name: 'Dinner is fine, no overnights', image: '/social/dinner.jpg' }
    ]
  },

  // CONFLICT & VIBE
  'conflict-style': {
    name: 'The "Talk" Protocol',
    instruction: 'We are fighting. How do we fix it?',
    icon: '🏳️',
    items: [
      { id: 'space', name: 'Give me space to cool off', image: '/love/space.jpg' },
      { id: 'solve', name: 'Solve it NOW (No sleeping angry)', image: '/love/talk.jpg' },
      { id: 'touch', name: 'Just hold me (Reconnect first)', image: '/love/hug.jpg' },
      { id: 'write', name: 'Write it down (Letters/Texts)', image: '/love/letter.jpg' },
      { id: 'peace', name: 'Pretend it didn’t happen', image: '/love/peace.jpg' }
    ]
  },
  'social-battery': {
    name: 'Friday Night Vibe',
    instruction: 'It has been a long week. What is the move?',
    icon: '🔋',
    items: [
      { id: 'out', name: 'Dinner & Drinks Out', image: '/social/cocktail.jpg' },
      { id: 'couch', name: 'Rot Mode (Takeout & Silence)', image: '/social/couch.jpg' },
      { id: 'host', name: 'Host Game Night', image: '/social/game.jpg' },
      { id: 'active', name: 'Evening Walk / Night Gym', image: '/social/run.jpg' },
      { id: 'movie', name: 'Movie Theater Date', image: '/social/cinema.jpg' }
    ]
  },
  'vacation-mode': {
    name: 'Vacation Philosophy',
    instruction: 'We are in Europe. What is the schedule?',
    icon: '✈️',
    items: [
      { id: 'relax', name: 'Pool/Beach & Chill (0 plans)', image: '/travel/pool.jpg' },
      { id: 'foodie', name: 'Restaurant Hopping', image: '/travel/food.jpg' },
      { id: 'explorer', name: '20k Steps/Day (Museums)', image: '/travel/walk.jpg' },
      { id: 'adventure', name: 'Adrenaline (Hiking/Diving)', image: '/travel/hike.jpg' },
      { id: 'luxury', name: 'Spa & Resort Life', image: '/travel/spa.jpg' }
    ]
  }
};