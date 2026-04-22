export const FRAME_COUNT = 192;

export const FRAME_SOURCES = Array.from({ length: FRAME_COUNT }, (_, index) => {
  const frame = String(index + 1).padStart(5, "0");
  return `/laptop%20Sequences/${frame}.png`;
});

export const LAST_FRAME_SOURCE = FRAME_SOURCES[FRAME_COUNT - 1];

type SequencePreloadResult = {
  images: Array<HTMLImageElement | null>;
  loadedCount: number;
};

let preloadPromise: Promise<SequencePreloadResult> | null = null;
let preloadResult: SequencePreloadResult | null = null;
let loadedCountSnapshot = 0;
const progressListeners = new Set<(count: number) => void>();

function notifyProgress(count: number) {
  loadedCountSnapshot = count;

  for (const listener of progressListeners) {
    listener(count);
  }
}

export function getSequencePreloadSnapshot() {
  return preloadResult;
}

export function subscribeToSequencePreloadProgress(listener: (count: number) => void) {
  progressListeners.add(listener);
  listener(loadedCountSnapshot);

  return () => {
    progressListeners.delete(listener);
  };
}

export function preloadSequenceFrames() {
  if (typeof window === "undefined") {
    return Promise.resolve({ images: [], loadedCount: 0 });
  }

  if (preloadResult) {
    return Promise.resolve(preloadResult);
  }

  if (preloadPromise) {
    return preloadPromise;
  }

  notifyProgress(0);

  preloadPromise = new Promise<SequencePreloadResult>((resolve) => {
    const images = new Array<HTMLImageElement | null>(FRAME_COUNT).fill(null);
    let completed = 0;

    FRAME_SOURCES.forEach((source, index) => {
      const image = new Image();
      image.decoding = "async";

      const finalize = (didLoad: boolean) => {
        images[index] = didLoad ? image : null;
        completed += 1;
        notifyProgress(completed);

        if (completed === FRAME_COUNT) {
          preloadResult = { images, loadedCount: completed };
          resolve(preloadResult);
        }
      };

      image.onload = () => {
        if (typeof image.decode === "function") {
          image.decode().catch(() => undefined).finally(() => finalize(true));
          return;
        }

        finalize(true);
      };

      image.onerror = () => finalize(false);
      image.src = source;
    });
  });

  return preloadPromise;
}
