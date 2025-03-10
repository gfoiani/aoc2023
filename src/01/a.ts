import fs from 'fs';
import path from 'path';
import { getPuzzleName } from '../utils';

  const puzzle = getPuzzleName(__filename);
console.time(puzzle);
const filePath = path.join(__dirname, 'input.txt');
const lines = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');

const regExp = /(\d+)/g;
let sum = 0;
for (const line of lines) {
  const res = line.match(regExp).join('').split('');
  const first = res[0];
  const last = res.pop();
  const numericString = `${first}${last}`;
  sum += parseInt(numericString, 10);
}

console.log(sum);
console.timeEnd(puzzle);

// ChatGPT code

// const puzzleGPT = 'Chat GPT Puzzle 01A';
// console.time(puzzleGPT);

// // Read the calibration document from a file (replace 'input.txt' with your file name)
// const input = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

// // Function to calculate the calibration value for a single line
// function getCalibrationValue(line: string) {
//   const regex = /\d/g;

//   const matches = line.match(regex);
//   const result = matches ? matches.join('') : '';
//   const firstDigit = parseInt(result[0], 10);
//   const lastDigit = parseInt(result[result.length - 1], 10);
//   return firstDigit * 10 + lastDigit;
// }

// // Calculate the sum of all calibration values
// const sum2 = input.reduce((acc, line: string) => acc + getCalibrationValue(line), 0);

// // Output the result
// console.log(sum2);
// console.timeEnd(puzzleGPT);
