"use client";

import { useEffect, useState, useRef } from "react";

type AppLoadingScreenProps = {
  progress?: number | null;
  label?: string;
  isComplete?: boolean;
  onLaunch?: () => void;
};

const BOOT_LINES = [
  { delay: 0, text: "BIOS v2.4.1 — Portfolio Runtime Environment" },
  { delay: 180, text: "Checking memory banks... OK" },
  { delay: 360, text: "Loading kernel modules..." },
  { delay: 520, text: "  [✓] experience.mod" },
  { delay: 640, text: "  [✓] projects.mod" },
  { delay: 760, text: "  [✓] contact.mod" },
  { delay: 900, text: "  [✓] animations.gpu" },
  { delay: 1050, text: "Mounting filesystem... OK" },
  { delay: 1200, text: "Resolving DNS → portfolio.local" },
  { delay: 1380, text: "Fetching remote assets..." },
  { delay: 1540, text: "  → profile.json         [████████████] 100%" },
  { delay: 1700, text: "  → canvas.frames        [████████████] 100%" },
  { delay: 1860, text: "  → typography.woff2     [████████████] 100%" },
  { delay: 2040, text: "Warming interaction layer..." },
  { delay: 2200, text: "Running pre-flight checks..." },
  { delay: 2360, text: "  [✓] render pipeline nominal" },
  { delay: 2520, text: "  [✓] animation frame budget OK" },
  { delay: 2700, text: "  [✓] no critical errors detected" },
  { delay: 2900, text: "System ready. Launching interface..." },
];

export default function AppLoadingScreen({
  progress = null,
  label = "Preparing portfolio systems",
  isComplete = false,
  onLaunch,
}: AppLoadingScreenProps) {
  const progressValue =
    typeof progress === "number"
      ? Math.max(0, Math.min(100, Math.round(progress)))
      : null;

  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [glitch, setGlitch] = useState(false);
  const [simProgress, setSimProgress] = useState(4);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const launchButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines((v) => Math.max(v, i + 1)), line.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCursorBlink((b) => !b), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  useEffect(() => {
    if (!isComplete || !onLaunch) {
      return;
    }

    launchButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      onLaunch();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isComplete, onLaunch]);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  // Simulate progress for preview
  useEffect(() => {
    const id = setInterval(() => {
      setSimProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          return 100;
        }
        return p + Math.random() * 3.5;
      });
    }, 160);
    return () => clearInterval(id);
  }, []);

  const displayProgress = isComplete ? 100 : progressValue ?? Math.round(simProgress);
  const now = new Date();
  const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  const lineColor = (text: string) => {
    if (text.startsWith("  [✓]")) return "#22d45e";
    if (text.startsWith("  →")) return "#5b9cf6";
    if (text.startsWith("  [")) return "#f0c33c";
    if (text.includes("OK")) return "#22d45e";
    if (text.startsWith("BIOS")) return "#e8e8e8";
    if (text.includes("ready") || text.includes("Launching")) return "#22d45e";
    return "#9a9a9a";
  };

  const total = 38;
  const filled = Math.round((displayProgress / 100) * total);
  const empty = total - filled;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#0c0c0c",
        padding: "2rem 1rem",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      }}
    >
      {/* Scanlines */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          zIndex: 20,
          opacity: 0.04,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)",
        }}
      />
      {/* CRT vignette */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          zIndex: 20,
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.72) 100%)",
        }}
      />
      {/* Ambient glow */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,255,80,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Terminal */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "600px",
          filter: glitch
            ? "drop-shadow(2px 0 0 rgba(255,0,60,0.6)) drop-shadow(-2px 0 0 rgba(0,255,200,0.6))"
            : "none",
          transition: "filter 0.06s",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#161616",
            borderRadius: "8px 8px 0 0",
            border: "1px solid #2a2a2a",
            borderBottom: "none",
            padding: "10px 16px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#ff5f57",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#febc2e",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#28c840",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "#4a4a4a",
              letterSpacing: "0.12em",
            }}
          >
            portfolio — boot.sh — 80×24
          </span>
          <span style={{ fontSize: "11px", color: "#2e2e2e" }}>
            {timestamp}
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            background: "#0d0d0d",
            border: "1px solid #2a2a2a",
            borderRadius: "0 0 8px 8px",
            padding: "20px",
            minHeight: "400px",
          }}
        >
          <div
            ref={terminalRef}
            style={{
              maxHeight: "280px",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  fontSize: "12px",
                  lineHeight: "1.7",
                  marginBottom: "1px",
                }}
              >
                <span
                  style={{
                    color: "#2d2d2d",
                    fontSize: "10px",
                    minWidth: "2ch",
                    textAlign: "right",
                    userSelect: "none",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ color: lineColor(line.text) }}>{line.text}</span>
              </div>
            ))}
            {visibleLines < BOOT_LINES.length && (
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  fontSize: "12px",
                  lineHeight: "1.7",
                }}
              >
                <span
                  style={{
                    color: "#2d2d2d",
                    fontSize: "10px",
                    minWidth: "2ch",
                    textAlign: "right",
                  }}
                >
                  {String(visibleLines + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 14,
                    background: cursorBlink ? "#22d45e" : "transparent",
                    verticalAlign: "text-bottom",
                    transition: "background 0.1s",
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid #1e1e1e", margin: "20px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              marginBottom: "12px",
            }}
          >
            <span style={{ color: "#3d3d3d" }}>$ ./boot.sh --verbose</span>
            <span style={{ color: "#22d45e" }}>{displayProgress}%</span>
          </div>

          <div
            style={{
              background: "#161616",
              border: "1px solid #222",
              borderRadius: "3px",
              padding: "7px 10px",
              fontSize: "12px",
              letterSpacing: "0.5px",
              marginBottom: "14px",
            }}
          >
            <span style={{ color: "#22d45e" }}>{"█".repeat(filled)}</span>
            <span style={{ color: "#222" }}>{"█".repeat(empty)}</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "11px",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#22d45e",
                boxShadow: "0 0 8px rgba(34,212,94,0.8)",
                animation: "pulse 1.4s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#555" }}>{label}</span>
            {!isComplete && (
              <span
                style={{
                  color: "#22d45e",
                  opacity: cursorBlink ? 1 : 0,
                  transition: "opacity 0.1s",
                }}
              >
                ▋
              </span>
            )}
          </div>

          {isComplete && onLaunch && (
            <div
              style={{
                marginTop: "18px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                ref={launchButtonRef}
                type="button"
                onClick={onLaunch}
                style={{
                  appearance: "none",
                  border: "1px solid #2c6f40",
                  background: "linear-gradient(180deg, #27da61 0%, #159647 100%)",
                  color: "#04110a",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "12px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  outline: "none",
                  boxShadow: "0 0 20px rgba(34,212,94,0.22)",
                }}
              >
                Launch Platform
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
