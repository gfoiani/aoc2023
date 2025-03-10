import fs from 'fs';
import path from 'path';

import { getPuzzleName } from '../utils';

const DirectionTypes = {
  Left: 'L',
  Right: 'R',
};

interface Step {
  L: string;
  R: string;
}

interface Steps {
  [key: string]: Step;
}

function extractWords(text: string): string[] {
  const regex = /\b\w+\b/g;
  const matches = text.match(regex);
  return matches || [];
}

export type DirectionType = typeof DirectionTypes[keyof typeof DirectionTypes];

const puzzle = getPuzzleName(__filename);

const filePath = path.join(__dirname, 'input.txt');

console.time(puzzle);

const [d, ...s] = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n').filter((line) => line.length > 0);

const directions = d.split('');

// console.log(directions);

const steps: Steps = {};
for (const step of s) {
  const [source, left, right] = extractWords(step);
  steps[source.trim()] = { L: left, R: right };
}

let start = 'AAA';
const end = 'ZZZ';
let count = 0;

while (start !== end) {
  for (let index = 0; index < directions.length; index += 1) {
    const element = directions[index];
    const step = steps[start];
    start = element === DirectionTypes.Left ? step.L : step.R;
    count += 1;
    if (start === end) {
      break;
    }
  }
}

// console.log(steps);

console.log('Res:', count);

console.timeEnd(puzzle);
