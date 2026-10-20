import { clamp, smoothRange } from "./dream-timeline.mjs";

// A nested section's offsetTop is relative to .pd-content, not the scroll view.
export function scrollCoordinate(elementTop, viewTop, scrollTop) {
  return elementTop - viewTop + scrollTop;
}
export function sectionMotion(
  scrollTop,
  sectionTop,
  sectionHeight,
  viewportHeight,
) {
  const height = Math.max(1, viewportHeight);
  const enter = smoothRange(
    (scrollTop + height - sectionTop) / height,
    0.12,
    0.9,
  );
  const travel = clamp(
    (scrollTop - sectionTop) / Math.max(1, sectionHeight - height),
  );
  return {
    enter,
    travel,
    title: enter * (1 - smoothRange(travel, 0.65, 1)),
    exit: smoothRange(travel, 0.65, 1),
  };
}
