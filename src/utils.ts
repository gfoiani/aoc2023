import path from 'path';

export function getPuzzleName(input: string): string {
  const elements = input.split(path.sep);
  const level = elements.pop().replace('.ts', '');
  const day = elements.pop();
  return `Puzzle ${day} ${level.toUpperCase()}`;
}
