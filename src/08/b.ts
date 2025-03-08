/* eslint-disable no-loop-func */
import fs from 'fs';
import path from 'path';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

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
  return (matches || []) as string[];
}

export type DirectionType = typeof DirectionTypes[keyof typeof DirectionTypes];

const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

const filePath = path.join(__dirname, 'input.txt');

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcmFunc(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

if (isMainThread) {
  console.time(puzzle);

  const [d, ...s] = fs
    .readFileSync(filePath, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .filter((line) => line.length > 0);

  const directions = d.split('');

  const steps: Steps = {};
  for (const step of s) {
    const [source, left, right] = extractWords(step);
    steps[source] = { L: left, R: right };
  }

  const start = 'A';
  const end = 'Z';
  const startingPoints = Object.keys(steps).filter((key) => key.endsWith(start));

  const workerCount = startingPoints.length; // Create one worker per starting point
  const results: number[] = [];
  let completedWorkers = 0;

  for (let i = 0; i < workerCount; i += 1) {
    const worker = new Worker(__filename, {
      workerData: {
        directions,
        steps,
        startPoint: startingPoints[i],
        end,
      },
    });

    worker.on('message', (count: number) => {
      results[i] = count;
      completedWorkers += 1;

      if (completedWorkers === workerCount) {
        // All workers finished, calculate the least common multiple (LCM)
        const lcm = results.reduce((acc, val) => lcmFunc(acc, val), 1);
        console.log('Res:', lcm);
        console.timeEnd(puzzle);
      }
    });
  }
} else {
  // Worker code
  const { directions, steps, startPoint, end } = workerData as {
    directions: string[];
    steps: Steps;
    startPoint: string;
    end: string;
  };

  let count = 0;
  let currentPoint = startPoint;
  let completed = false;

  while (!completed) {
    for (let index = 0; index < directions.length; index += 1) {
      const element = directions[index];
      currentPoint = element === DirectionTypes.Left ? steps[currentPoint].L : steps[currentPoint].R;
      count += 1;
      if (currentPoint.endsWith(end)) {
        completed = true;
        break;
      }
    }
  }

  parentPort?.postMessage(count);
}
