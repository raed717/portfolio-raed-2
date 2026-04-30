"use client";

import NextImage from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  FRAME_COUNT,
  LAST_FRAME_SOURCE,
  getSequencePreloadSnapshot,
  preloadSequenceFrames,
  subscribeToSequencePreload,
} from "@/components/sequence-preload";
const FOG_COLOR = "transparent";

const QUOTES = [
  {
    title: '"Every interface is a promise."',
    body:
      "Before the logic, there is the interaction. A seamless surface waiting to be engaged, where design and intent meet.",
  },
  {
    title: '"Beyond the glass, the system breathes."',
    body:
      "True engineering isn't just about the polished exterior-it's orchestrating the chaos beneath. It is the architecture of the unseen layers.",
  },
  {
    title: '"Architecture in motion."',
    body:
      "Where elegant constraints meet raw execution. Building robust, scalable systems that endure the weight of reality.",
  },
] as const;

function getQuoteIndex(progress: number) {
  if (progress < 0.4) {
    return 0;
  }

  if (progress < 0.72) {
    return 1;
  }

  return 2;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function findClosestLoadedFrameIndex(targetIndex: number, images: Array<HTMLImageElement | null>) {
  if (images[targetIndex]) {
    return targetIndex;
  }

  for (let distance = 1; distance < FRAME_COUNT; distance += 1) {
    const previousIndex = targetIndex - distance;

    if (previousIndex >= 0 && images[previousIndex]) {
      return previousIndex;
    }

    const nextIndex = targetIndex + distance;

    if (nextIndex < FRAME_COUNT && images[nextIndex]) {
      return nextIndex;
    }
  }

  return -1;
}

export default function LaptopScroll() {
  const preloadSnapshot = getSequencePreloadSnapshot();
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>(preloadSnapshot?.images ?? []);
  const currentFrameRef = useRef(-1);
  const pendingFrameRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const viewportRef = useRef({ width: 0, height: 0 });
  const [loadedCount, setLoadedCount] = useState(preloadSnapshot?.loadedCount ?? 0);
  const [isReady, setIsReady] = useState(preloadSnapshot?.hasInitialFrames ?? false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const loadProgress = loadedCount / FRAME_COUNT;

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const loadedFrameIndex = findClosestLoadedFrameIndex(frameIndex, imagesRef.current);

    if (loadedFrameIndex === -1) {
      return;
    }

    const image = imagesRef.current[loadedFrameIndex];

    if (!canvas || !image) {
      return;
    }

    const { width, height } = viewportRef.current;

    if (!width || !height) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: false });

    if (!context) {
      return;
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.fillStyle = FOG_COLOR;
    context.fillRect(0, 0, width, height);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const coverScale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * 1.08;
    const coverWidth = image.naturalWidth * coverScale;
    const coverHeight = image.naturalHeight * coverScale;
    const coverX = (width - coverWidth) / 2;
    const coverY = (height - coverHeight) / 2;

    context.save();
    context.filter = "blur(34px)";
    context.globalAlpha = 0.88;
    context.drawImage(image, coverX, coverY, coverWidth, coverHeight);
    context.restore();

    const baseScale = 1;
    const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight) * baseScale;
    const drawWidth = image.naturalWidth * scale;
    const drawHeight = image.naturalHeight * scale;
    const x = (width - drawWidth) / 2;
    const y = (height - drawHeight) / 2;

    context.drawImage(image, x, y, drawWidth, drawHeight);
    currentFrameRef.current = loadedFrameIndex;
  }, []);

  const requestDraw = useCallback(
    (frameIndex: number) => {
      pendingFrameRef.current = clamp(frameIndex, 0, FRAME_COUNT - 1);

      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;

        if (pendingFrameRef.current === currentFrameRef.current) {
          return;
        }

        drawFrame(pendingFrameRef.current);
      });
    },
    [drawFrame],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const width = Math.max(window.innerWidth, 1);
    const height = Math.max(window.innerHeight, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    viewportRef.current = { width, height };
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    currentFrameRef.current = -1;

    drawFrame(pendingFrameRef.current);
  }, [drawFrame]);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = subscribeToSequencePreload((snapshot) => {
      if (mounted) {
        imagesRef.current = snapshot.images;
        setLoadedCount(snapshot.loadedCount);

        if (snapshot.hasInitialFrames) {
          setIsReady(true);
          requestDraw(pendingFrameRef.current);
        }
      }
    });

    preloadSequenceFrames();
    resizeCanvas();

    return () => {
      mounted = false;
      unsubscribe();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [requestDraw, resizeCanvas]);

  useEffect(() => {
    resizeCanvas();

    const handleResize = () => resizeCanvas();

    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const initialFrame = clamp(
      Math.round(scrollYProgress.get() * (FRAME_COUNT - 1)),
      0,
      FRAME_COUNT - 1,
    );

    pendingFrameRef.current = initialFrame;
    resizeCanvas();
  }, [isReady, resizeCanvas, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveQuoteIndex(getQuoteIndex(latest));

    if (!isReady) {
      return;
    }

    requestDraw(Math.round(latest * (FRAME_COUNT - 1)));
  });

  return (
    <section
      ref={sectionRef}
      className="relative h-[350vh] w-full"
      aria-label="WpDev laptop scroll sequence"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <NextImage
          src={LAST_FRAME_SOURCE}
          alt=""
          fill
          sizes="100vw"
          className="scale-110 object-cover opacity-45 blur-[48px]"
          priority
        />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[100svh]">
        <NextImage
          src={LAST_FRAME_SOURCE}
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-85 blur-[34px]"
          priority
        />
        <NextImage
          src={LAST_FRAME_SOURCE}
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-contain"
          priority
        />
      </div>

      <div className="sticky top-0 z-10 h-[100svh] overflow-hidden">
        <canvas ref={canvasRef} className="h-[100svh] w-full" />

        <AnimatePresence mode="wait">
          <motion.div
            key={QUOTES[activeQuoteIndex].title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-3xl rounded-[30px] border border-white/10 bg-black/50 px-8 py-10 sm:px-12 sm:py-12 backdrop-blur-sm">
              <p className="display-face text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.04em] text-white text-balance">
                {QUOTES[activeQuoteIndex].title}
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-[var(--muted)] sm:text-lg sm:leading-8">
                {QUOTES[activeQuoteIndex].body}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {!isReady && (
          <div className="absolute inset-0 z-30 grid place-items-center">
            <div className="flex flex-col items-center gap-5 px-6 text-center">
              <div className="sequence-spinner h-10 w-10 rounded-full border border-white/10 border-t-[#1ed760]" />
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#b3b3b3] md:text-[13px]">
                  Loading WpDev sequence...
                </p>
                <p className="text-sm text-[#b3b3b3]">
                  {Math.round(loadProgress * 100)}% of frames decoded
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
