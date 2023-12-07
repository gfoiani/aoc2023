import fs from 'fs';
import path from 'path';
import { first, last } from 'lodash';

import { getPuzzleName } from '../../utils';

const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

const filePath = path.join(__dirname, '..', 'input.txt');

console.time(puzzle);
const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');
const lines = input.length;

const gearRegex = /\*/g;

function extractGears(idx: number): number {
  const line = input[idx];
  const prevLine = ((idx - 1) >= 0) ? input[idx - 1] : undefined;
  const nextLine = ((idx + 1) < lines) ? input[idx + 1] : undefined;
  // console.log('\n');
  // console.log('line number', idx + 1);
  // console.log('prev', prevLine);
  // console.log('line', line);
  // console.log('next', nextLine);
  let ratio = 0;
  let match = gearRegex.exec(line);
  while (match !== null) {
    const { index: gearIndex } = match;
    const values: number[] = [];
    let matchCount = 0;

    [prevLine, line, nextLine].forEach((currentLine) => {
      if (currentLine && matchCount < 2) {
        // check adjacent characters if they are numbers is a gear
        const numbersRegexGlobal = /(\d+)/g;
        let lineMatch = numbersRegexGlobal.exec(currentLine);
        while (lineMatch !== null && matchCount < 2) {
          const { index: matchStart } = lineMatch;
          const currentValue = lineMatch['0'];
          const { length } = currentValue;
          const matchEnd = matchStart + (currentValue.length - 1);
          if (matchStart >= (gearIndex - length) && matchEnd <= (gearIndex + length)) {
            values.push(parseInt(currentValue, 10));
            matchCount += 1;
          }
          lineMatch = numbersRegexGlobal.exec(currentLine);
        }
      }
    });

    if (matchCount >= 2) {
      // multiply to obtain the ratio
      const gearRatio = values.reduce((a, b) => a * b);
      ratio += gearRatio;
      // console.log(`isGear line ${idx + 1} gearIndex ${gearIndex} matchCount ${matchCount} with ratio ${gearRatio}. Values: `, values);
    }
    match = gearRegex.exec(line);
  }

  return ratio;
}

// Calculate the sum of all components
const res = input.reduce((acc, line: string, index: number) => acc + extractGears(index), 0);

console.log('Result:', res);
console.timeEnd(puzzle);
