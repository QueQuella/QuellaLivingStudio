// Relative URLs support both GitHub project Pages and a domain root.
export default {
  computer: "./assets/programming-dream/computer.glb",
  // Set to an exported, self-contained scene GLB when the missing .blend arrives.
  // Keep the ocean separate, and omit the computer to avoid duplicates.
  environment: null,
  environmentScale: 1,
  environmentPosition: [0, 0, 0],
  computerPosition: [-4, 0.12, -10],
  computerHeight: 2.6,
  screenName: "screen",
  startPosition: [2.5, 3.5, 25],
  startTarget: [0, 3, -30],
  fieldOfView: 48,
};
