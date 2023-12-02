import fs from 'fs';
import path from 'path';

const puzzle = 'Puzzle 01A';
console.time(puzzle);
const filePath = path.join(__dirname, 'input.txt');
const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
const lines = content.split('\n');

const regExp = /(\d+)/g;
let sum = 0;
for (const line of lines) {
  const res = line.match(regExp).join('').split('');
  const first = res[0];
  const last = res.pop();
  const numericString = `${first}${last}`;
  sum += parseInt(numericString, 10);
}

console.log(`Result: ${sum}`);
console.timeEnd(puzzle);
