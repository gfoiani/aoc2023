import fs from 'fs';
import path from 'path';
import { max } from 'lodash';

import { getPuzzleName } from '../utils';

const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

const filePath = path.join(__dirname, 'input.txt');

console.time(puzzle);
const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');

function multiplyCubes(line: string): number {
  const [, game] = line.split(':');
  const turns = game.trim().split('; ');
  const cubes: { [color: string]: number } = {};
  turns.forEach((turn: string) => {
    const revealedCubes = turn.trim().split(', ');
    revealedCubes.forEach((cube: string) => {
      const [num, color] = cube.split(' ');
      const count = parseInt(num, 10);
      cubes[color] = max([cubes[color], count]);
    });
  });
  return Object.values(cubes).reduce((a, b) => a * b);
}

// Calculate the sum of all products
const res = input.reduce((acc, line: string) => acc + multiplyCubes(line), 0);

console.log('Result:', res);
console.timeEnd(puzzle);
