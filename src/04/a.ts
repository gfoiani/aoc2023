import fs from 'fs';
import path from 'path';
import { compact, intersection } from 'lodash';

import { getPuzzleName } from '../utils';

const puzzle = getPuzzleName(__filename);

const filePath = path.join(__dirname, 'input.txt');

console.time(puzzle);
const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');

function calculateWinningPoints(line: string): number {
  let points = 0;
  const [, numbers] = line.split(':');
  const [winningNumbers, cardNumbers] = numbers.trim().split(' | ');
  // console.log('line', line);
  // console.log('winningNumbers', winningNumbers);
  // console.log('cardNumbers', cardNumbers);
  const cardWinningNumbers = intersection(compact(winningNumbers.split(' ')), compact(cardNumbers.split(' ')));
  if (cardWinningNumbers.length > 0) {
    // console.log(`found ${cardWinningNumbers.length} cardWinningNumbers :`, cardWinningNumbers);
    points += 2 ** (cardWinningNumbers.length - 1);
  }
  return points;
}

// Calculate the sum of all point
const res = input.reduce((acc, line: string) => acc + calculateWinningPoints(line), 0);

console.log('Result:', res);
console.timeEnd(puzzle);
