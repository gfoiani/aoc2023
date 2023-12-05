import path from 'path';

export function getPuzzleName(input: string): string {
  const elements = input.split(path.sep);
  const level = elements.pop();
  const day = elements.pop();
  return `${day} ${level.toUpperCase()}`;
}
