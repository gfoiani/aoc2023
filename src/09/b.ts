import fs from 'fs';
import path from 'path';

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

const results: number[] = [];

for (const elements of input) {
  let allZeroes = false;
  let newElements = elements;
  const firstElements: number[] = [];
  while (!allZeroes) {
    firstElements.unshift(newElements[0]);
    newElements = calcDiff(newElements);
    allZeroes = newElements.every((value) => value === 0);
  }
  // console.log('firstElements:', firstElements);
  let res = firstElements[0];
  for (let index = 1; index < firstElements.length; index += 1) {
    res = firstElements[index] - res;
  }
  // console.log('res:', res);
  results.push(res);
}
// console.log('Results:', results);
console.log('Res:', results.reduce((acc, value) => acc + value, 0));

console.timeEnd(puzzle);
