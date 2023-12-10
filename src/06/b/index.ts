import fs from 'fs';
import path from 'path';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

import { getPuzzleName } from '../../utils';

function calculateWinningCombiations(startTime: number, endTime: number, totalTime: number, record: number) {
  let winningCombiations = 0;
  for (let index = startTime; index < endTime; index += 1) {
    if (index * (totalTime - index) > record) {
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

  const time = Number(input[0].match(/(\d+)/g).join(''));
  const distance = Number(input[1].match(/(\d+)/g).join(''));
  const solutions: number[] = [];

  console.log('time', time);
  console.log('distance', distance);

  const workersCount = 100;
  const step = Math.floor(time / workersCount);
  const remainingTimes = time % workersCount;

  console.log('workersCount:', workersCount);
  console.log('remainingTimes:', remainingTimes);
  console.log('step:', step);

  for (let index = 0; index < (workersCount + 1); index += 1) {
    const startTime = step * index;
    let endTime = step * (index + 1);
    if (endTime > time) { endTime = startTime + remainingTimes; }
    const worker = new Worker(__filename, { workerData: { index, startTime, endTime, distance, totalTime: time } });
    worker.on('error', (err) => console.error(err));
    worker.on('message', (msg: { winningCombiations: number }) => {
      const { winningCombiations } = msg;
      // console.log('Worker message received', winningCombiations);
      solutions.push(winningCombiations);
      if (solutions.length === (workersCount + 1)) {
        const res = solutions.reduce((a, b) => a + b, 0);

        setTimeout(() => {
          console.log('Result:', res);
          console.timeEnd(puzzle);
        }, 10);
      }
    });
  }
} else {
  const { startTime, endTime, distance, totalTime, index } = workerData as { index: number, startTime: number, endTime: number, distance: number, totalTime: number };
  console.log(`Worker ${index + 1}. startTime: ${startTime}, endTime: ${endTime}, totalTime: ${totalTime}, distance: ${distance}`);
  const winningCombiations = calculateWinningCombiations(startTime, endTime, totalTime, distance);
  console.log(`Worker ${index + 1}. winningCombiations: ${winningCombiations}`);
  parentPort.postMessage({ winningCombiations });
}
