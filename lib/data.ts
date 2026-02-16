// lib/data.ts
export interface ScenarioOption {
  id: string;
  text: string;
}

export interface Scenario {
  name: string;
  situation: string;
  question: string;
  options: ScenarioOption[];
}

export interface Character {
  id: 'baymax' | 'toothless';
  name: string;
  reactions: {
    perfect: string;
    good: string;
    mismatch: string;
  };
}

export const characters: Record<string, Character> = {
  baymax: {
    id: 'baymax',
    name: 'Baymax',
    reactions: {
      perfect: 'I am satisfied with this compatibility',
      good: 'Treatment is working well',
      mismatch: 'I detect a need for discussion'
    }
  },
  toothless: {
    id: 'toothless',
    name: 'Toothless',
    reactions: {
      perfect: '😊 *happy wiggle*',
      good: '🤔 *curious head tilt*',
      mismatch: '😐 *skeptical squint*'
    }
  }
};

export const scenarioData: Record<string, Scenario> = {
  'money-management': {
    name: 'Money Management',
    situation: 'You just got married and need to set up your finances.',
    question: 'How should we handle our bank accounts?',
    options: [
      { id: 'joint', text: 'Everything goes into one joint account' },
      { id: 'hybrid', text: 'Joint account for bills, separate for everything else' },
      { id: 'separate', text: 'Keep everything separate and split bills' },
      { id: 'one-manager', text: 'One person manages everything' },
      { id: 'proportional', text: 'Contribute based on income percentage' }
    ]
  },
  'spending-limits': {
    name: 'Big Purchase',
    situation: 'You are at Target and see the perfect throw pillows for $80.',
    question: 'What do you do?',
    options: [
      { id: 'text-first', text: 'Text and ask first' },
      { id: 'buy-mention', text: 'Buy them, mention it later' },
      { id: 'send-photo', text: 'Send a photo and wait for approval' },
      { id: 'put-back', text: 'Put them back, not worth the conversation' },
      { id: 'decide-together', text: 'Add to cart, we will decide together at checkout' }
    ]
  },
  'eating-out': {
    name: 'Eating Out',
    situation: 'It is Wednesday evening. Neither of you feel like cooking.',
    question: 'What happens?',
    options: [
      { id: 'cook-anyway', text: 'We cook anyway, we always cook' },
      { id: 'special-only', text: 'This is rare, we save eating out for weekends' },
      { id: 'order-in', text: 'Order delivery without hesitation' },
      { id: 'quick-bite', text: 'Grab something quick nearby' },
      { id: 'every-night', text: 'This is normal, we eat out all the time' }
    ]
  },
  'holidays': {
    name: 'Holiday Plans',
    situation: 'It is November. Both families are asking about Thanksgiving plans.',
    question: 'Where are we spending the holidays?',
    options: [
      { id: 'rotation', text: 'We alternate families each year' },
      { id: 'host', text: 'Everyone comes to our place' },
      { id: 'marathon', text: 'Lunch with one family, dinner with the other' },
      { id: 'travel', text: 'Book flights somewhere warm, skip family' },
      { id: 'friends', text: 'Friendsgiving with our crew' }
    ]
  },
  'john-moonyoung': {
    name: 'John & Moonyoung',
    situation: 'Your brother John texts asking if you want to grab dinner this weekend.',
    question: 'How often do we see them?',
    options: [
      { id: 'weekly', text: 'Every week, they are family' },
      { id: 'monthly', text: 'Once a month for dinner sounds good' },
      { id: 'quarterly', text: 'Every few months is enough' },
      { id: 'babysitting', text: 'Mainly when we need them to babysit' },
      { id: 'vacation', text: 'We should vacation together sometime' }
    ]
  },
  'our-friends': {
    name: 'Friend Groups',
    situation: 'You have your college friends. She has her work friends. Nobody knows each other yet.',
    question: 'What is the plan?',
    options: [
      { id: 'merge', text: 'Throw a big party, merge everyone' },
      { id: 'separate', text: 'Keep our friend groups completely separate' },
      { id: 'some-overlap', text: 'Introduce some people but mostly keep it separate' },
      { id: 'couple-friends', text: 'Make new couple friends together' },
      { id: 'whoever', text: 'No plan, whoever gets along gets along' }
    ]
  },
  'house-type': {
    name: 'Home Search',
    situation: 'You are apartment hunting together for the first time.',
    question: 'What are we looking for?',
    options: [
      { id: 'one-bed', text: 'Cozy 1-bedroom, we do not need much space' },
      { id: 'two-bed', text: '2-bedroom for an office or guest room' },
      { id: 'small-house', text: 'Small house with a yard' },
      { id: 'big-house', text: 'Bigger house with room to grow' },
      { id: 'condo', text: 'Condo or townhouse' }
    ]
  },
  'cleanliness': {
    name: 'Cleaning Standards',
    situation: 'Friends are coming over in 3 hours. The apartment is kind of messy.',
    question: 'What is your reaction?',
    options: [
      { id: 'deep-clean', text: 'Panic and deep clean everything' },
      { id: 'tidy-up', text: 'Quick tidy, put things away' },
      { id: 'surface-clean', text: 'Just wipe down surfaces, they will understand' },
      { id: 'no-stress', text: 'They are friends, they do not care' },
      { id: 'cancel', text: 'Reschedule, I cannot have people over like this' }
    ]
  },
  'morning-routine': {
    name: 'Morning Chaos',
    situation: 'It is 6:30am. You need to leave by 7:45am. She tends to oversleep.',
    question: 'How do mornings work?',
    options: [
      { id: 'together', text: 'We get ready together, I will help wake her' },
      { id: 'separate', text: 'I leave first, she figures out her own routine' },
      { id: 'multiple-alarms', text: 'Set multiple alarms for her, hope for the best' },
      { id: 'one-wakes-other', text: 'I wake up first and gently wake her' },
      { id: 'no-schedule', text: 'We have flexible schedules, no stress' }
    ]
  },
  'night-routine': {
    name: 'Bedtime',
    situation: 'It is 11pm. You are exhausted and in bed. She is still watching TV in the living room.',
    question: 'What do you do?',
    options: [
      { id: 'wait', text: 'Stay up and wait for her' },
      { id: 'ask', text: 'Go out and ask her to come to bed' },
      { id: 'text', text: 'Text her from bed' },
      { id: 'sleep', text: 'Just fall asleep, she will join when ready' },
      { id: 'no-rule', text: 'We never go to bed at the same time anyway' }
    ]
  },
  'decision-making': {
    name: 'Dinner Decision',
    situation: 'It is 6pm. "What do you want for dinner?" "I do not know, what do you want?"',
    question: 'How do we break the cycle?',
    options: [
      { id: 'discuss', text: 'Discuss options until we both agree' },
      { id: 'take-turns', text: 'We take turns deciding' },
      { id: 'whoever-cares', text: 'Whoever feels stronger about it decides' },
      { id: 'split-domains', text: 'One person always picks dinner, other picks activities' },
      { id: 'random', text: 'Use an app or coin flip' }
    ]
  },
  'fighting': {
    name: 'After a Fight',
    situation: 'You just had a big argument. It is still tense.',
    question: 'What do you need right now?',
    options: [
      { id: 'space', text: 'Space to cool down alone' },
      { id: 'talk-now', text: 'To talk it out immediately' },
      { id: 'physical', text: 'A hug, then we can talk' },
      { id: 'write', text: 'Time to write down my thoughts first' },
      { id: 'move-on', text: 'To just move on and forget it' }
    ]
  },
  'friday-night': {
    name: 'Friday Night',
    situation: 'It is Friday at 6pm. You both just got home from a long work week.',
    question: 'What sounds good?',
    options: [
      { id: 'go-out', text: 'Get dressed up and go out for dinner' },
      { id: 'couch', text: 'Change into pajamas and order takeout' },
      { id: 'host', text: 'Invite friends over for game night' },
      { id: 'active', text: 'Go for a walk or hit the gym' },
      { id: 'movie', text: 'See a movie at the theater' }
    ]
  },
  'opposite-sex': {
    name: 'Friend Hangout',
    situation: 'An old friend of the opposite sex is in town and wants to grab coffee one-on-one.',
    question: 'How do you feel about this?',
    options: [
      { id: 'totally-fine', text: 'Totally fine, have fun!' },
      { id: 'heads-up', text: 'Fine, just give me a heads up first' },
      { id: 'meet-them', text: 'I would like to meet them first' },
      { id: 'group-better', text: 'Could we make it a group thing?' },
      { id: 'uncomfortable', text: 'I would prefer you did not' }
    ]
  }
};
