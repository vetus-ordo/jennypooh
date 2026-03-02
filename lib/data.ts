export interface ScenarioOption { id: string; text: string }

export interface Scenario {
  name: string;
  emoji: string;
  situation: string;
  question: string;
  options: ScenarioOption[];
}

export interface Character {
  id: 'baymax' | 'toothless';
  name: string;
  theme: string;
  reactions: { perfect: string; good: string; mismatch: string; hilarious: string };
}

export const characters: Record<string, Character> = {
  baymax: {
    id: 'baymax', name: 'Baymax', theme: 'baymax',
    reactions: {
      perfect: '✅ I am fully satisfied with this compatibility',
      good: '💙 Treatment is working well – minor adjustments recommended',
      mismatch: '⚠️ I detect a need for discussion. Initiating care protocol.',
      hilarious: '🤖 ...I am choosing not to process this data.'
    }
  },
  toothless: {
    id: 'toothless', name: 'Toothless', theme: 'toothless',
    reactions: {
      perfect: '🐉 *ecstatic tail wag* – PERFECT MATCH!',
      good: '🤔 *curious head tilt* – pretty close!',
      mismatch: '😐 *skeptical squint* – we need to talk...',
      hilarious: '😂 *falls off rock laughing*'
    }
  }
}

export const scenarioData: Record<string, Scenario> = {
  'money-management': {
    name: 'Money Management', emoji: '💰',
    situation: 'We just got married and need to set up our finances.',
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
    name: 'Big Purchase', emoji: '🛍️',
    situation: 'You are out shopping at West Elm and spot the perfect throw pillows for $250.',
    question: 'What do you do?',
    options: [
      { id: 'text-first', text: 'Text and ask first' },
      { id: 'buy-mention', text: 'Buy and mention it tonight' },
      { id: 'send-photo', text: 'Send a photo – gauge the reaction' },
      { id: 'put-back', text: 'Put them back, not worth $250' },
      { id: 'bring-back', text: 'Come back together before deciding' }
    ]
  },
  'eating-out': {
    name: 'Eating Out', emoji: '🍜',
    situation: 'It is Wednesday evening. Neither of us feels like cooking.',
    question: 'What happens?',
    options: [
      { id: 'cook-anyway', text: 'We cook anyway, we always cook' },
      { id: 'special-only', text: 'This is rare, we save eating out for weekends' },
      { id: 'order-in', text: 'Order delivery without hesitation' },
      { id: 'quick-bite', text: 'Grab something quick nearby' },
      { id: 'every-night', text: 'This is normal, we eat out all the time' }
    ]
  },
  'john-moonyoung': {
    name: 'John & Moonyoung', emoji: '👨‍👩‍👦',
    situation: 'John texts asking if we want to grab dinner this weekend.',
    question: 'How often do we see John and Moonyoung?',
    options: [
      { id: 'weekly', text: 'Every week, they are family' },
      { id: 'monthly', text: 'Once a month for dinner sounds good' },
      { id: 'quarterly', text: 'Every few months is enough' },
      { id: 'babysitting', text: 'Mainly when we need them to babysit' },
      { id: 'vacation', text: 'We should vacation together sometime' }
    ]
  },
  'our-friends': {
    name: 'Friend Groups', emoji: '🥂',
    situation: 'We each have our own friend groups that have never met.',
    question: 'What is the plan?',
    options: [
      { id: 'merge', text: 'Throw a big party, merge everyone' },
      { id: 'separate', text: 'Keep our friend groups completely separate' },
      { id: 'some-overlap', text: 'Introduce some people but mostly keep it separate' },
      { id: 'couple-friends', text: 'Make new couple friends together' },
      { id: 'whoever', text: 'No plan, whoever gets along gets along' }
    ]
  },
  'chores': {
    name: 'Chore Duty', emoji: '🐕',
    situation: 'We come home and the dog just peed all over the living room rug.',
    question: 'What happens?',
    options: [
      { id: 'first-sees', text: 'Whoever sees it first handles it' },
      { id: 'take-turns', text: 'We take turns – it is only fair' },
      { id: 'team-effort', text: 'Grab paper towels together, team effort' },
      { id: 'rock-paper', text: 'Rock paper scissors, loser cleans' },
      { id: 'pretend', text: 'Pretend we did not see it' }
    ]
  },
  'cleanliness': {
    name: 'Cleaning Standards', emoji: '🧹',
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
    name: 'Morning Chaos', emoji: '☀️',
    situation: 'It is 6:30am. We need to be out the door by 7:45am. One of us is an early bird, the other loves to sleep in.',
    question: 'How do mornings work?',
    options: [
      { id: 'together', text: 'We get ready together and keep each other on track' },
      { id: 'separate', text: 'The early bird heads out first, the other follows' },
      { id: 'multiple-alarms', text: 'Multiple alarms, hope for the best' },
      { id: 'one-wakes-other', text: 'Whoever is up first gently wakes the other' },
      { id: 'no-schedule', text: 'We have flexible schedules, no stress' }
    ]
  },
  'night-routine': {
    name: 'Bedtime', emoji: '🌙',
    situation: 'It is 11pm. One of us is exhausted and already in bed. The other is still watching TV in the living room.',
    question: 'What happens?',
    options: [
      { id: 'wait', text: 'Stay up and wait' },
      { id: 'ask', text: 'Go out and ask to come to bed' },
      { id: 'text', text: 'Send a text from the bedroom' },
      { id: 'sleep', text: 'Just fall asleep, the other will join eventually' },
      { id: 'no-rule', text: 'We never go to bed at the same time anyway' }
    ]
  },
  'decision-making': {
    name: 'Dinner Decision', emoji: '🤷',
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
    name: 'After a Fight', emoji: '🌧️',
    situation: 'We just had a big argument. It is still tense.',
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
    name: 'Friday Night', emoji: '🎉',
    situation: 'It is Friday at 6pm. We just got home from a long work week.',
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
    name: 'Friend Hangout', emoji: '☕',
    situation: 'An old friend of the opposite sex is in town and wants to grab coffee one-on-one.',
    question: 'How do you feel about this?',
    options: [
      { id: 'totally-fine', text: 'Totally fine, have fun!' },
      { id: 'heads-up', text: 'Fine, just give me a heads up first' },
      { id: 'meet-them', text: 'I would like to meet this person first' },
      { id: 'group-better', text: 'Could we make it a group thing?' },
      { id: 'uncomfortable', text: 'I would prefer you did not' }
    ]
  },
  'kids-planning': {
    name: 'Future Family', emoji: '👶',
    situation: 'We are up late one night talking about our future.',
    question: 'How many kids do we want?',
    options: [
      { id: 'one', text: 'One and done' },
      { id: 'two', text: 'Two – one of each ideally' },
      { id: 'three-plus', text: 'Three or more, big family energy' },
      { id: 'not-sure', text: 'Not sure yet, we will revisit later' },
      { id: 'none', text: 'No kids – we are the fun aunt and uncle' }
    ]
  },
  'school-choice': {
    name: 'School Decision', emoji: '🎒',
    situation: 'Our oldest just turned 5. Time to figure out school.',
    question: 'Where does our kid go?',
    options: [
      { id: 'public', text: 'Public school – we turned out fine' },
      { id: 'private', text: 'Private school, worth the investment' },
      { id: 'montessori', text: 'Montessori or something alternative' },
      { id: 'homeschool', text: 'Homeschool so we control the curriculum' },
      { id: 'best-rated', text: 'Whatever is closest with the best reviews' }
    ]
  },
  'bullying': {
    name: 'School Trouble', emoji: '😤',
    situation: 'Our kid comes home from school upset – a classmate has been bullying.',
    question: 'What do we do?',
    options: [
      { id: 'go-to-school', text: 'Go to the school and handle it ourselves' },
      { id: 'call-parents', text: 'One of us calls the other parents directly' },
      { id: 'taekwondo', text: 'Enroll our kid in taekwondo – build confidence' },
      { id: 'coach-kid', text: 'Talk to our kid first and help work through it' },
      { id: 'let-school', text: 'Email the teacher and let the school handle it' }
    ]
  }
}

export const categoryGroups: Record<string, { label: string; emoji: string; ids: string[] }> = {
  money:     { label: 'Money',               emoji: '💰', ids: ['money-management', 'spending-limits', 'eating-out'] },
  lifestyle: { label: 'Lifestyle',           emoji: '🏡', ids: ['chores', 'cleanliness', 'morning-routine', 'night-routine', 'friday-night'] },
  social:    { label: 'Social',              emoji: '🥂', ids: ['john-moonyoung', 'our-friends', 'opposite-sex'] },
  family:    { label: 'Family',              emoji: '👨‍👩‍👧‍👦', ids: ['kids-planning', 'school-choice', 'bullying'] },
  conflict:  { label: 'Conflict & Decisions',emoji: '🤝', ids: ['decision-making', 'fighting'] }
}
