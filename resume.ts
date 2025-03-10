import tablemark from 'tablemark';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import { spawnSync } from 'child_process';

interface Stage {
  stage: string;
  partOne: string;
  partTwo: string;
}
const files = globSync(path.join(__dirname, 'src', '**', '{a,b}.ts')).sort();

const stages: Stage[] = [];
for (const file of files) {
  const [part, level] = file.split(path.sep).reverse();
  console.log(level, part);
  const res = spawnSync('node', ['-r', 'ts-node/register', file], {
    stdio: 'pipe',
  });
  const [result, time] = res.stdout.toString().split('\n');
  console.log(result, time);
  let stage = stages.find((s) => s.stage === level);
  if (!stage) {
    stage = { stage: level, partOne: '', partTwo: '' };
    stages.push(stage);
  }
  stage[part === 'a.ts' ? 'partOne' : 'partTwo'] = `${result.split(' ').pop()} - ${time.split(' ').pop()}`;
}

const md = tablemark(stages);

fs.writeFileSync('Resume.md', md);
