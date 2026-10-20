// Keep the existing Three.js and GLTFLoader versions together.
export const THREE = await import(
  /* @vite-ignore */ new URL(
    `${import.meta.env.BASE_URL}vendor/three.module.js`,
    document.baseURI,
  ).href
);
