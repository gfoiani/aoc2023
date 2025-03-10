import fs from 'fs';
import path from 'path';
import { min } from 'lodash';

import { getPuzzleName } from '../utils';

interface CategoryMap {
  source: number;
  dest: number;
  size: number;
}

const puzzle = `Puzzle ${getPuzzleName(__dirname)}`;

const filePath = path.join(__dirname, 'input.txt');

console.time(puzzle);
// split on empty lines
const input = fs.readFileSync(filePath, { encoding: 'utf-8' }).trim().split(/\n\s*\n/);

function createMap(mapInput: string) {
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

function navigateMap(idx: number, size: number): number {
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
  // console.log(`idx: ${idx}, size: ${size}, minFound: ${minFound}`);
  return minFound;
}

const map = new Map<string, CategoryMap[]>();
const locations: number[] = [];

const regex = /\d+\s*\d+/g;
const [, seedsString] = input.shift().split(': ');
const seeds = seedsString.match(regex);
console.log('seeds', seeds);

input.forEach(createMap);
// console.log('map', map);

for (const seedLine of seeds) {
  const [seed, size] = seedLine.split(' ').map(Number);
  locations.push(navigateMap(seed, size));
}

const res = min(locations);

console.log('Result:', res);
console.timeEnd(puzzle);
