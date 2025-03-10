import fs from 'fs';
import path from 'path';
import { getPuzzleName } from '../utils';

const max = {
  red: 12,
  green: 13,
  blue: 14,
};

const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

const filePath = path.join(__dirname, 'input.txt');

console.time(puzzle);
const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');

function isGameValid(line: string): number {
  const [gameDesc, game] = line.split(':');
  const [, id] = gameDesc.trim().split(' ');
  const turns = game.trim().split('; ');
  let valid = true;
  turns.forEach((turn: string) => {
    const revealedCubes = turn.trim().split(', ');
    revealedCubes.forEach((cube: string) => {
      const [count, color] = cube.split(' ');
      valid = valid && (parseInt(count, 10) <= max[color.toLocaleLowerCase()]);
    });
  });
  return (valid) ? parseInt(id, 10) : 0;
}

// Calculate the sum of all valid games
const res = input.reduce((acc, line: string) => acc + isGameValid(line), 0);

console.log('Result:', res);
console.timeEnd(puzzle);

// ChatGPT code (Not Working)

const puzzleGPT = `Chat GPT ${puzzle}`;
console.time(puzzleGPT);

// Function to check if a game is possible given cube counts
function isPossible(game: string[][], redCount: number, greenCount: number, blueCount: number) {
  const counts = { red: 0, green: 0, blue: 0 };

  // Count the cubes in the game
  game.forEach((set) => {
    set.forEach((cube: string) => {
      counts[cube] += 1;
    });
  });

  // Check if the counts match the specified cube counts
  return counts.red === redCount && counts.green === greenCount && counts.blue === blueCount;
}

// Function to calculate the sum of IDs of possible games
function sumOfPossibleGames(games: string[], redCount: number, greenCount: number, blueCount: number) {
  let sum = 0;

  games.forEach((game) => {
    const gameId = parseInt(game.match(/\d+/)[0], 10);
    if (isPossible(parseGame(game), redCount, greenCount, blueCount)) {
      sum += gameId;
    }
  });

  return sum;
}

// Helper function to parse a game into an array of sets
function parseGame(game: string) {
  return game
    .split(';')
    .map((set) => set.trim().split(',').map((cube) => cube.trim()));
}

// Specify the target cube counts
const redCount = 12;
const greenCount = 13;
const blueCount = 14;

// Calculate the sum of IDs of possible games
const result = sumOfPossibleGames(input, redCount, greenCount, blueCount);

// Output the result
console.log('Result:', result);
console.timeEnd(puzzleGPT);
