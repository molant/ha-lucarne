export function isAllDone(chores: { state: string }[]): boolean {
  if (chores.length === 0) return false;
  return chores.every((c) => c.state === 'on');
}
