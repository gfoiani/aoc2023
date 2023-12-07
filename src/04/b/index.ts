import fs from 'fs';
import path from 'path';
import { compact, intersection, times } from 'lodash';

import { getPuzzleName } from '../../utils';

const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

const filePath = path.join(__dirname, '..', 'input.txt');

console.time(puzzle);
const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');

const instances: { [index: string]: number } = {};

function calculateWinningPoints(line: string, index: number) {
  const [, numbers] = line.split(':');
  const [winningNumbers, cardNumbers] = numbers.trim().split(' | ');
  // console.log('line', line);
  // console.log('winningNumbers', winningNumbers);
  // console.log('cardNumbers', cardNumbers);
  const cardWinningNumbers = intersection(compact(winningNumbers.split(' ')), compact(cardNumbers.split(' ')));
  const currentCardInstances = (instances[`${index}`] || 0) + 1;
  times(cardWinningNumbers.length, (idx: number) => {
    const cardIndex = index + idx + 1;
    if (cardIndex <= input.length) {
      instances[`${cardIndex}`] = (instances[`${cardIndex}`] || 0) + currentCardInstances;
    }
  });
}

// Calculate the number of collected cards
input.forEach((line, index) => calculateWinningPoints(line, index + 1));
const res = input.length + Object.values(instances).reduce((a, b) => a + b, 0);

console.log('Result:', res);
console.timeEnd(puzzle);
