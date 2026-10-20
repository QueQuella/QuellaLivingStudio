// Native scroll is the single clock: every cinematic transition can be reversed.
export const clamp = (value) => Math.max(0, Math.min(1, value));
export function smoothRange(value, start, end) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}
export function timeline(progress) {
  const p = clamp(progress);
  return {
    approach: smoothRange(p, 0, 0.66),
    enter: smoothRange(p, 0.66, 0.92),
    light: smoothRange(p, 0.84, 0.94),
    dark: smoothRange(p, 0.95, 1),
    intro: 1 - smoothRange(p, 0, 0.14),
    chapter:
      p < 0.5
        ? "01 / DIGITAL SEA"
        : p < 0.88
          ? "01 / THE FLOATING COMPUTER"
          : "02 / ENTERING THE DREAM",
  };
}
