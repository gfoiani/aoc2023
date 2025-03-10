import fs from 'fs';
import path from 'path';

import { getPuzzleName } from '../utils';

const HandTypes = {
  Invalid: 0,
  HighCard: 1,
  OnePair: 2,
  TwoPairs: 3,
  ThreeOfAKind: 4,
  FullHouse: 5,
  FourOfAKind: 6,
  FiveOfAKind: 7,
};

export type HandType = typeof HandTypes[keyof typeof HandTypes];

interface Hand {
  hand: string;
  value: number;
}

interface Hands {
  [key: HandType]: Hand[];
}

const handValues = [
  '2', '3', '4', '5',
  '6', '7', '8', '9',
  'T', 'J', 'Q', 'K',
  'A',
];

function identifyHandType(hand: string): HandType {
  const cards = hand.split('');
  const results = {};
  for (let i = 0; i < cards.length; i += 1) {
    const card = cards[i];
    if (results[card]) {
      results[card] += 1;
    } else {
      results[card] = 1;
    }
  }

  const values = Object.values(results);

  switch (true) {
  case values.includes(5):
    return HandTypes.FiveOfAKind;
    break;
  case values.includes(4):
    return HandTypes.FourOfAKind;
    break;
  case values.includes(3) && values.includes(2):
    return HandTypes.FullHouse;
    break;
  case values.includes(3):
    return HandTypes.ThreeOfAKind;
    break;
  case values.includes(2) && values.length === 3:
    return HandTypes.TwoPairs;
    break;
  case values.includes(2):
    return HandTypes.OnePair;
    break;
  case values.length === 5:
    return HandTypes.HighCard;
    break;
  default:
    return HandTypes.Invalid;
    break;
  }
}

function sort(a: string, b: string): number {
  const res = handValues.indexOf(a[0]) - handValues.indexOf(b[0]);
  if (res !== 0) return res;
  return sort(a.slice(1), b.slice(1));
}

const puzzle = getPuzzleName(__filename);

const filePath = path.join(__dirname, 'input.txt');

console.time(puzzle);

const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');

const hands: Hands = {};

for (const element of input) {
  const [hand, value] = element.split(' ');
  const handType = identifyHandType(hand);
  if (!hands[handType]) {
    hands[handType] = [];
  }
  hands[handType].push({ hand, value: parseInt(value, 10) });
}

const keys = Object.keys(hands).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

const list: Hand[] = [];

for (const key of keys as unknown as HandType[]) {
  const handList: Hand[] = hands[key];
  handList.sort((a: Hand, b: Hand) => sort(a.hand, b.hand));
  list.push(...handList);
}

const sum = list.reduce((acc, hand: Hand, index) => acc + hand.value * (index + 1), 0);

console.log('Result:', sum);

console.timeEnd(puzzle);
