export const FRAME_COUNT = 192;
const FIRST_PASS_SIZE = 3;
const FIRST_PASS_GAP = 3;
const LOAD_CONCURRENCY = 3;

export const FRAME_SOURCES = Array.from({ length: FRAME_COUNT }, (_, index) => {
  const frame = String(index + 1).padStart(5, "0");
  return `/laptop%20Sequences/${frame}.png`;
});

export const LAST_FRAME_SOURCE = FRAME_SOURCES[FRAME_COUNT - 1];

export type SequencePreloadSnapshot = {
  images: Array<HTMLImageElement | null>;
  loadedCount: number;
  isStarted: boolean;
  hasInitialFrames: boolean;
  isComplete: boolean;
};

const images = new Array<HTMLImageElement | null>(FRAME_COUNT).fill(null);
const listeners = new Set<(snapshot: SequencePreloadSnapshot) => void>();

const firstPassOrder = buildPassOrder(0);
const secondPassOrder = buildPassOrder(FIRST_PASS_SIZE);
const loadOrder = [...firstPassOrder, ...secondPassOrder];

let loadedCount = 0;
let isStarted = false;
let isComplete = false;
let completionPromise: Promise<SequencePreloadSnapshot> | null = null;

function buildPassOrder(startOffset: number) {
  const order: number[] = [];

  for (let blockStart = startOffset; blockStart < FRAME_COUNT; blockStart += FIRST_PASS_SIZE + FIRST_PASS_GAP) {
    for (let offset = 0; offset < FIRST_PASS_SIZE; offset += 1) {
      const frameIndex = blockStart + offset;

      if (frameIndex < FRAME_COUNT) {
        order.push(frameIndex);
      }
    }
  }

  return order;
}

function getSnapshot(): SequencePreloadSnapshot {
  return {
    images,
    loadedCount,
    isStarted,
    hasInitialFrames: firstPassOrder.slice(0, FIRST_PASS_SIZE).every((index) => images[index]),
    isComplete,
  };
}

function notifyListeners() {
  const snapshot = getSnapshot();

  for (const listener of listeners) {
    listener(snapshot);
  }
}

export function getSequencePreloadSnapshot() {
  return getSnapshot();
}

export function subscribeToSequencePreload(listener: (snapshot: SequencePreloadSnapshot) => void) {
  listeners.add(listener);
  listener(getSnapshot());

  return () => {
    listeners.delete(listener);
  };
}

export function preloadSequenceFrames() {
  if (typeof window === "undefined") {
    return Promise.resolve(getSnapshot());
  }

  if (completionPromise) {
    return completionPromise;
  }

  isStarted = true;
  notifyListeners();

  completionPromise = new Promise<SequencePreloadSnapshot>((resolve) => {
    let nextOrderIndex = 0;
    let activeLoads = 0;

    const schedule = () => {
      if (isComplete) {
        resolve(getSnapshot());
        return;
      }

      while (activeLoads < LOAD_CONCURRENCY && nextOrderIndex < loadOrder.length) {
        const frameIndex = loadOrder[nextOrderIndex];
        nextOrderIndex += 1;
        activeLoads += 1;

        const image = new Image();
        image.decoding = "async";

        const finalize = (didLoad: boolean) => {
          images[frameIndex] = didLoad ? image : null;
          loadedCount += 1;

          if (loadedCount === FRAME_COUNT) {
            isComplete = true;
          }

          notifyListeners();
          activeLoads -= 1;

          if (isComplete && activeLoads === 0) {
            resolve(getSnapshot());
            return;
          }

          schedule();
        };

        image.onload = () => {
          if (typeof image.decode === "function") {
            image.decode().catch(() => undefined).finally(() => finalize(true));
            return;
          }

          finalize(true);
        };

        image.onerror = () => finalize(false);
        image.src = FRAME_SOURCES[frameIndex];
      }
    };

    schedule();
  });

  return completionPromise;
}
