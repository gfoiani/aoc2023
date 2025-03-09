import fs from 'fs';
import path from 'path';
import _ from 'lodash';

import { getPuzzleName } from '../utils';

function calcDiff(elements: number[]): number[] {
  const diffs: number[] = [];
  for (let index = 1; index < elements.length; index += 1) {
    diffs.push(elements[index] - elements[index - 1]);
  }
  return diffs;
}

const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

const filePath = path.join(__dirname, 'input.txt');

console.time(puzzle);

const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n').map((line) => {
  const values = line.trim().split(' ').map(Number);
  return values;
});

const sums: number[] = [];

for (const elements of input) {
  let allZeroes = false;
  let newElements = elements;
  const lastElements: number[] = [];
  while (!allZeroes) {
    lastElements.push(newElements[newElements.length - 1] || 0);
    // console.log('new:', newElements);
    newElements = calcDiff(newElements);
    allZeroes = newElements.every((value) => value === 0);
  }
  // console.log('Last:', lastElements);
  sums.push(lastElements.reduce((acc, value) => acc + value, 0));
}

console.log('Res:', sums.reduce((acc, value) => acc + value, 0));

console.timeEnd(puzzle);
