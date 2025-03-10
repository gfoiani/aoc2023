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
    const [dest, source, size] = line.trim().split(' ').map((el) => parseInt(el, 10));
    categoryMaps.push({ source, dest, size });
  }
  map.set(key, categoryMaps);
}

function navigateMap(idx: number): number {
  let found = idx;
  for (const categoryMaps of map.values()) {
    // console.log('categoryMaps', categoryMaps);
    // eslint-disable-next-line no-loop-func
    const foundMap = categoryMaps.find((c) => (found >= c.source) && (found < (c.source + c.size)));
    if (foundMap) {
      // console.log('foundMap', foundMap);
      const diff = found - foundMap.source;
      found = foundMap.dest + diff;
    }
  }
  // console.log(`input ${idx} --> output ${found}`);
  return found;
}

const map = new Map<string, CategoryMap[]>();
const locations: number[] = [];

const regex = /(\d+)/g;
const [, seedsString] = input.shift().split(': ');
const seeds = seedsString.match(regex);

input.forEach(createMap);

for (const seed of seeds) {
  locations.push(navigateMap(parseInt(seed, 10)));
}

const res = min(locations);

console.log('Result:', res);
console.timeEnd(puzzle);
