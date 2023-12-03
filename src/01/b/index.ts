import fs from 'fs';
import path from 'path';
import { min, max } from 'lodash';

const puzzle = 'Puzzle 01B';
console.time(puzzle);
const filePath = path.join(__dirname, '..', 'input.txt');
const lines = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');

const numbersInLetters: string[] = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

// Function to replace numbers from letters to numbers
function extractNumericStrings(line: string): Map<number, string> {
  const map = new Map<number, string>();
  for (let index = 0; index < numbersInLetters.length; index += 1) {
    const number = numbersInLetters[index];
    let found = line.indexOf(number);
    while (found > -1) {
      map.set(found, `${index}`);
      found = line.indexOf(number, found + 1);
    }
  }
  return map;
}

function extractNumbers(line: string): Map<number, string> {
  const regex = /\d/g;
  const map = new Map<number, string>();
  let match = regex.exec(line);
  while (match !== null) {
    map.set(match.index, match['0']);
    match = regex.exec(line);
  }
  return map;
}

// Function to calculate the calibration value for a single line
function getCalibrationValue(line: string) {
  const map = extractNumericStrings(line);
  const map2 = extractNumbers(line);
  const resMap = new Map<number, string>([...map, ...map2]);
  const keys = Array.from(resMap.keys());
  const firstIndex = min(keys);
  const lastIndex = max(keys);
  const first = resMap.get(firstIndex);
  const last = resMap.get(lastIndex);
  const numericString = `${first}${last}`;
  return parseInt(numericString, 10);
}

const sum = lines.reduce((acc, line: string) => acc + getCalibrationValue(line), 0);

console.log('Result:', sum);
console.timeEnd(puzzle);
