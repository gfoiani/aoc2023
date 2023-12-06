import fs from 'fs';
import path from 'path';
import { getPuzzleName } from '../../utils';

const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

const filePath = path.join(__dirname, '..', 'input.txt');

console.time(puzzle);
const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');
const lines = input.length;

const regex = /(\d+)/g;
const notNumberOrDotRegex = /[^0-9.]/;

function extractComponents(idx: number): number {
  const line = input[idx];
  const prevLine = ((idx - 1) >= 0) ? input[idx - 1] : undefined;
  const nextLine = ((idx + 1) < lines) ? input[idx + 1] : undefined;
  // console.log('line number', idx + 1);
  // console.log('prev', prevLine);
  // console.log('line', line);
  // console.log('next', nextLine);
  let sum = 0;
  let match = regex.exec(line);
  while (match !== null) {
    let isComponent = false;
    const { index } = match;
    const value = match['0'];
    // check adjacent characters
    const nextToChars = `${line[index - 1] || ''}${line[index + value.length] || ''}`;
    isComponent = notNumberOrDotRegex.test(nextToChars);
    // if adjacent characters are not symbols, check the previous line
    if (!isComponent && prevLine) {
      const startIndex = (index - 1) >= 0 ? (index - 1) : 0;
      const endIndex = (index + value.length + 1) > (line.length - 1) ? (line.length - 1) : (index + value.length + 1);
      const prevLineChars = prevLine.substring(startIndex, endIndex);
      // console.log('prevLineChars', prevLineChars);
      isComponent = notNumberOrDotRegex.test(prevLineChars);
    }
    // if no adjacent symbols are found in the previous line, check the next line
    if (!isComponent && nextLine) {
      const startIndex = (index - 1) >= 0 ? (index - 1) : 0;
      const endIndex = (index + value.length + 1) > (line.length - 1) ? (line.length - 1) : (index + value.length + 1);
      const nextLineChars = nextLine.substring(startIndex, endIndex);
      // console.log('nextLineChars', nextLineChars);
      isComponent = notNumberOrDotRegex.test(nextLineChars);
    }
    // console.log(`isComponent ${value}`, isComponent);
    if (isComponent) { sum += parseInt(value, 10); }
    match = regex.exec(line);
  }

  // console.log('line sum', sum);
  return sum;
}

// Calculate the sum of all components
const res = input.reduce((acc, line: string, index: number) => acc + extractComponents(index), 0);

console.log('Result:', res);
console.timeEnd(puzzle);
