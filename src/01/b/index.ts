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

console.log('Sum of calibration values:', sum);
console.timeEnd(puzzle);

// ChatGPT code

const puzzleGPT = 'Chat GPT Puzzle 01B';
console.time(puzzleGPT);

// Read the calibration document from a file (replace 'input.txt' with your file name)
const input = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

// Function to calculate the calibration value for a single line
function getCalibrationValueGPT(line: string) {
  // Use a regular expression to match all digits, spelled out or not
  const regex = /(zero|one|two|three|four|five|six|seven|eight|nine)|\d/g;
  const matches = line.match(regex);

  // Convert spelled-out digits to corresponding numeric values
  const numericDigits = matches?.map((match) => {
    if (/\d/.test(match)) {
      return parseInt(match, 10);
    }
    const spelledOutDigits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    return spelledOutDigits.indexOf(match);
  });

  // Combine the first and last numeric digits to form the calibration value
  const res = numericDigits[0] * 10 + numericDigits[numericDigits.length - 1]
  return res;
}

// Calculate the sum of all calibration values
const sum2 = input.reduce((acc, line: string) => acc + getCalibrationValueGPT(line), 0);

// Output the result
// FIXME: the solution should be ok but the result is wrong....
console.log('Sum of calibration values:', sum2);
console.timeEnd(puzzleGPT);
