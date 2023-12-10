import fs from 'fs';
import path from 'path';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

import { getPuzzleName } from '../../utils';

function calculateWinningCombiations(time: number, record: number) {
  let winningCombiations = 0;
  for (let index = 0; index < time; index += 1) {
    if (index * (time - index) > record) {
      winningCombiations += 1;
    }
  }
  return winningCombiations;
}

if (isMainThread) {
  const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

  const filePath = path.join(__dirname, '..', 'input.txt');

  console.time(puzzle);
  // split on empty lines
  const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split('\n');

  const times = input[0].match(/(\d+)/g).map(Number);
  const distances = input[1].match(/(\d+)/g).map(Number);
  const solutions: number[] = [];

  console.log('times', times);
  console.log('distances', distances);

  const workers: { [key: number]: Worker } = {};

  for (let index = 0; index < times.length; index += 1) {
    const time = times[index];
    const distance = distances[index];
    const worker = new Worker(__filename, { workerData: { time, distance } });
    worker.on('error', (err) => console.error(err));
    worker.on('message', (msg: { winningCombiations: number }) => {
      const { winningCombiations } = msg;
      console.log('Worker message received', winningCombiations);
      solutions.push(winningCombiations);
      if (solutions.length === times.length) {
        const res = solutions.reduce((a, b) => a * b);

        console.log('Result:', res);
        console.timeEnd(puzzle);
      }
    });
    workers[time] = worker;
  }
} else {
  const { time, distance } = workerData as { time: number, distance: number };
  console.log(`Started workeridx: ${time}, distance: ${distance}`);
  const winningCombiations = calculateWinningCombiations(time, distance);
  parentPort.postMessage({ winningCombiations });
}
