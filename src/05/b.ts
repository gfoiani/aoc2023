import fs from 'fs';
import path from 'path';
import { min } from 'lodash';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

import { getPuzzleName } from '../utils';

interface CategoryMap {
  source: number;
  dest: number;
  size: number;
}

function createMap(map: Map<string, CategoryMap[]>, mapInput: string) {
  const lines = mapInput.split('\n');
  const header = lines.shift();
  const key = header.split(' ')[0];
  const categoryMaps: CategoryMap[] = [];
  for (const line of lines) {
    const [dest, source, size] = line.trim().split(' ').map(Number);
    categoryMaps.push({ source, dest, size });
  }
  map.set(key, categoryMaps);
}

function navigateMap(map: Map<string, CategoryMap[]>, idx: number, size: number): number {
  let minFound: number;
  for (let index = 0; index < size; index += 1) {
    let found = idx + index;
    for (const categoryMaps of map.values()) {
      // eslint-disable-next-line no-loop-func
      const foundMap = categoryMaps.find((c) => (found >= c.source) && (found < (c.source + c.size)));
      if (foundMap) {
        const diff = found - foundMap.source;
        found = foundMap.dest + diff;
      }
    }
    minFound = min([minFound, found]);
  }
  return minFound;
}

if (isMainThread) {
  const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

  const filePath = path.join(__dirname, 'input.txt');

  console.time(puzzle);
  // split on empty lines
  const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split(/\n\s*\n/);

  const workers: { [key: number]: Worker } = {};
  const map = new Map<string, CategoryMap[]>();
  const locations: number[] = [];

  const regex = /\d+\s*\d+/g;
  const [, seedsString] = input.shift().split(': ');
  const seeds = seedsString.match(regex);
  console.log('seeds', seeds);

  input.forEach((i) => createMap(map, i));
  // console.log('map', map);

  for (const seedLine of seeds) {
    const [seed, size] = seedLine.split(' ').map(Number);
    const worker = new Worker(__filename, { workerData: { map, seed, size } });
    worker.on('message', (msg: { minFound: number }) => {
      const { minFound } = msg;
      console.log('Worker message received', minFound);
      locations.push(minFound);
      if (locations.length === seeds.length) {
        const res = min(locations);

        console.log('Result:', res);
        console.timeEnd(puzzle);
      }
    });
    worker.on('error', (err) => console.error(err));
    worker.on('exit', (code) => console.log(`Worker exited with code ${code}.`));
    workers[seed] = worker;
  }
} else {
  const { map, seed, size } = workerData as { map: Map<string, CategoryMap[]>, seed: number, size: number };
  console.log(`Started workeridx: ${seed}, size: ${size}`);
  const minFound = navigateMap(map, seed, size);
  parentPort.postMessage({ minFound });
}
