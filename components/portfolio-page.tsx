"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import LaptopScroll from "@/components/laptopScroll";

export type Project = {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github?: string;
  live?: string;
  github_available?: boolean;
  live_available?: boolean;
  detailsUrl?: string;
  details_available?: boolean;
};

export type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  link?: string;
};

type HeroMetric = {
  value: string;
  label: string;
};

type SkillGroup = {
  title: string;
  items: string[];
};

type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  impact: string;
  tools: string[];
  highlights: string[];
};

type LanguageItem = {
  name: string;
  level: string;
};

type Person = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  avatar: string;
  tagline: string;
  summary: string;
  availability: string;
};

export type ProfileData = {
  person: Person;
  heroMetrics: HeroMetric[];
  skills: SkillGroup[];
  experience: ExperienceItem[];
  languages: LanguageItem[];
  principles: string[];
};

type PortfolioPageProps = {
  profile: ProfileData;
  projects: Project[];
  education: EducationItem[];
  certifications: Certification[];
};

const SECTION_IDS = ["sequence", "hero", "experience", "projects", "education", "contact"];

const NAV_ITEMS = [
  { id: "sequence", mobileLabel: "Reel", index: "00" },
  { id: "hero", mobileLabel: "Intro", index: "01" },
  { id: "experience", mobileLabel: "Work", index: "02" },
  { id: "projects", mobileLabel: "Builds", index: "03" },
  { id: "education", mobileLabel: "Study", index: "04" },
  { id: "contact", mobileLabel: "Reach", index: "05" },
];

const PROJECT_LAYOUTS = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-6",
];

const SIGNAL_CARDS = [
  {
    title: "Architecture",
    detail: "Clean contracts and modular systems",
    icon: "/images/icons8-brain-96.png",
    className: "left-0 top-[4.5rem] lg:-left-10",
    delay: "0s",
  },
  {
    title: "AI Workflows",
    detail: "Prompting, agents, and scoring loops",
    icon: "/images/icons8-machine-learning-96.png",
    className: "right-2 top-28 lg:-right-8",
    delay: "1.2s",
  },
  {
    title: "Vision and QA",
    detail: "Playwright, OpenCV, reliability discipline",
    icon: "/images/icons8-vision-96.png",
    className: "left-8 bottom-20 lg:-left-6",
    delay: "2.4s",
  },
];

function initials(value: string) {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow mono-face text-[0.72rem] uppercase tracking-[0.36em] text-[var(--muted)]">
        {index} / {eyebrow}
      </p>
      <h2 className="display-face mt-4 text-[clamp(2.5rem,5vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white text-balance">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">{description}</p>
    </div>
  );
}

function MetricCard({ value, label }: HeroMetric) {
  return (
    <div className="cinematic-panel soft-border rounded-[26px] px-4 py-4 transition-transform duration-300 hover:-translate-y-1 sm:px-5">
      <p className="display-face text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{value}</p>
      <p className="mono-face mt-2 text-[0.64rem] uppercase tracking-[0.24em] text-[var(--muted)] sm:text-[0.72rem] sm:tracking-[0.28em]">
        {label}
      </p>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  layout,
}: {
  project: Project;
  index: number;
  layout: string;
}) {
  return (
    <article
      className={`group relative min-h-[360px] overflow-hidden rounded-[30px] border border-white/8 bg-[var(--surface)] shadow-[var(--shadow-card)] ${layout}`}
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.74)_58%,rgba(0,0,0,0.92))]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.58),transparent)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-black/35 px-3 py-2 backdrop-blur-sm">
            <span className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          </div>
          <span className="rounded-full border border-white/12 bg-black/30 px-3 py-2 text-[0.72rem] uppercase tracking-[0.24em] text-white/80 backdrop-blur-sm">
            {project.live_available ? "Live" : project.github_available ? "Code" : "Private"}
          </span>
        </div>

        <div>
          <p className="mono-face text-[0.72rem] uppercase tracking-[0.32em] text-[var(--accent)]">
            Featured build
          </p>
          <h3 className="display-face mt-3 text-[2rem] font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-[2.4rem]">
            {project.title}
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/78">{project.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={`${project.title}-${technology}`}
                className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm text-white/80 backdrop-blur-sm"
              >
                {technology}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.live_available && project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-transform duration-300 hover:-translate-y-1"
              >
                Launch
              </a>
            ) : (
              <span className="rounded-full border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.18em] text-white/55">
                Demo on request
              </span>
            )}

            {project.github_available && project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/14 bg-black/35 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Source
              </a>
            ) : (
              <span className="rounded-full border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.18em] text-white/55">
                Private repo
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PortfolioPage({
  profile,
  projects,
  education,
  certifications,
}: PortfolioPageProps) {
  const [scrollRatio, setScrollRatio] = useState(0);
  const [activeSection, setActiveSection] = useState("sequence");

  const stackRibbon = useMemo(
    () => profile.skills.flatMap((group) => group.items).slice(0, 14),
    [profile.skills],
  );

  useEffect(() => {
    const updateScrollState = () => {
      const root = document.documentElement;
      const maxScroll = root.scrollHeight - window.innerHeight;
      const ratio = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;

      setScrollRatio(ratio);

      const probe = window.scrollY + window.innerHeight * 0.38;
      let current = SECTION_IDS[0];

      for (const sectionId of SECTION_IDS) {
        const section = document.getElementById(sectionId);

        if (section && probe >= section.offsetTop) {
          current = sectionId;
        }
      }

      setActiveSection(current);
    };

    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateScrollState);
    };

    const onPointerMove = (event: PointerEvent) => {
      const pointerX = `${(event.clientX / window.innerWidth) * 100}%`;
      const pointerY = `${(event.clientY / window.innerHeight) * 100}%`;

      document.documentElement.style.setProperty("--pointer-x", pointerX);
      document.documentElement.style.setProperty("--pointer-y", pointerY);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 z-0 ambient-grid opacity-60" />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-24 bg-[linear-gradient(180deg,rgba(6,6,6,0.82),rgba(6,6,6,0))] transition-opacity duration-500"
        style={{ opacity: activeSection === "sequence" ? 0 : 1 }}
      />

      <aside className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 xl:flex xl:flex-col xl:gap-4">
        <div className="cinematic-panel soft-border flex w-20 flex-col items-center gap-4 rounded-[28px] px-4 py-5">
          <div className="relative h-40 w-1 overflow-hidden rounded-full bg-white/6">
            <div
              className="absolute inset-x-0 bottom-0 rounded-full bg-[linear-gradient(180deg,#6cf89d,#1ed760)] transition-all duration-300"
              style={{ height: `${Math.max(scrollRatio * 100, 6)}%` }}
            />
          </div>
          <p className="mono-face rotate-180 text-[0.7rem] uppercase tracking-[0.28em] text-[var(--muted)] [writing-mode:vertical-rl]">
            Scroll mix
          </p>
        </div>

        <nav className="cinematic-panel soft-border flex w-20 flex-col gap-2 rounded-[28px] px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`rounded-[18px] px-2 py-2 text-center transition-colors duration-300 ${
                  isActive ? "bg-white text-black" : "bg-white/0 text-white/55 hover:bg-white/6 hover:text-white"
                }`}
              >
                <span className="mono-face block text-[0.64rem] uppercase tracking-[0.22em]">{item.index}</span>
                <span className="mt-1 block text-[0.64rem] uppercase tracking-[0.18em]">{item.mobileLabel}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="relative z-10 pb-32 sm:pb-28">
        <section id="sequence" className="section-anchor">
          <LaptopScroll />
        </section>

        <section id="hero" className="section-anchor relative lg:min-h-[180vh]">
          <div className="flex min-h-screen items-start lg:sticky lg:top-0 lg:items-center">
            <div className="mx-auto grid w-full max-w-[1520px] grid-cols-1 gap-8 px-4 pb-24 pt-24 sm:px-6 sm:pb-[4.5rem] sm:pt-28 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:px-20 xl:px-28">
              <div
                className="flex flex-col justify-center"
                style={{ transform: `translate3d(0, ${scrollRatio * -110}px, 0)` }}
              >
                <div className="inline-flex w-fit max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/4 px-4 py-2 backdrop-blur-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_20px_rgba(30,215,96,0.72)]" />
                  <span className="mono-face text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)] sm:text-[0.72rem] sm:tracking-[0.28em]">
                    Software architect engineer / Tunisia / available now
                  </span>
                </div>

                <h1 className="display-face mt-8 max-w-[8ch] text-[clamp(3rem,13vw,4.85rem)] font-semibold leading-[0.9] tracking-[-0.07em] text-white text-balance sm:max-w-[10ch] sm:text-[clamp(4.2rem,10vw,6.5rem)] lg:max-w-5xl lg:text-[clamp(5.5rem,8vw,8.8rem)] lg:leading-[0.86]">
                  Architecture with the pulse of a live release.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-xl sm:leading-8">
                  {profile.person.tagline}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                  {profile.person.summary}
                </p>


                <div className="mt-10 grid grid-cols-2 gap-4 xl:grid-cols-4">
                  {profile.heroMetrics.map((metric) => (
                    <MetricCard key={metric.label} {...metric} />
                  ))}
                </div>
              </div>

              <div className="relative flex items-center lg:justify-end">
                <div
                  className="relative ml-auto w-full max-w-[690px]"
                  style={{ transform: `translate3d(0, ${scrollRatio * -55}px, 0)` }}
                >
                  <div className="cinematic-panel soft-border relative overflow-hidden rounded-[36px] px-5 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,215,96,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
                    <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="mono-face text-[0.72rem] uppercase tracking-[0.32em] text-[var(--muted)]">
                          Now playing
                        </p>
                        <p className="display-face mt-2 text-2xl tracking-[-0.04em] text-white sm:text-3xl">
                          {profile.person.name}
                        </p>
                      </div>
                      <div className="rounded-full border border-white/12 bg-black/20 px-4 py-2 text-[0.72rem] uppercase tracking-[0.22em] text-[var(--accent)]">
                        Mock avatar slot
                      </div>
                    </div>

                      <div className="relative mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[0.62fr_0.38fr]">
                      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.16))] p-4 sm:p-5">
                        <div className="scan-line absolute inset-0" />

                        {SIGNAL_CARDS.map((card) => (
                          <div
                            key={card.title}
                            className={`hero-orbit absolute hidden w-48 rounded-[22px] border border-white/10 bg-black/42 p-3 shadow-[var(--shadow-card)] backdrop-blur-md lg:block ${card.className}`}
                            style={{ animationDelay: card.delay }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6">
                                <Image src={card.icon} alt={card.title} width={28} height={28} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                                  {card.title}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-white/60">{card.detail}</p>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="relative mx-auto flex min-h-[360px] max-w-[420px] items-end justify-center sm:min-h-[430px]">
                          <div className="accent-ring relative h-[380px] w-[272px] overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),#121212] shadow-[0_35px_90px_rgba(0,0,0,0.55)] sm:h-[440px] sm:w-[340px]">
                            <Image
                              src={profile.person.avatar}
                              alt={`${profile.person.name} avatar placeholder`}
                              fill
                              priority
                              sizes="(max-width: 1024px) 100vw, 40vw"
                              className="object-cover object-center opacity-[0.88]"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),transparent_34%,rgba(0,0,0,0.8))]" />
                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="mono-face text-[0.7rem] uppercase tracking-[0.26em] text-[var(--muted)]">
                                    Base
                                  </p>
                                  <p className="mt-2 text-lg font-semibold text-white">{profile.person.location}</p>
                                </div>
                                <div className="flex gap-1.5" aria-hidden="true">
                                  {[0, 1, 2, 3, 4].map((bar) => (
                                    <span
                                      key={bar}
                                      className="equalizer-bar block w-2 rounded-full bg-[var(--accent)]"
                                      style={{ animationDelay: `${bar * 0.16}s` }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-white/10 bg-black/24 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm">
                          <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                            Engineer.json
                          </p>
                          <div className="mono-face mt-4 space-y-2 text-sm leading-7 text-white/76">
                            <p>{"{"}</p>
                            <p className="pl-4 text-[var(--accent)]">
                              {`role: "${profile.person.role}",`}
                            </p>
                            <p className="pl-4">{`focus: ["architecture", "frontend", "AI"],`}</p>
                            <p className="pl-4">{`status: "available",`}</p>
                            <p className="pl-4">{`location: "${profile.person.location}"`}</p>
                            <p>{"}"}</p>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-white/10 bg-black/24 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm">
                          <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                            Stack frequencies
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {profile.skills.slice(0, 3).map((group) => (
                              <span
                                key={group.title}
                                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-white/82"
                              >
                                {group.title}
                              </span>
                            ))}
                          </div>
                          <p className="mt-5 text-sm leading-6 text-white/66">{profile.person.availability}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-full border border-white/8 bg-black/22 py-3">
                      <div className="marquee flex min-w-max items-center gap-3 whitespace-nowrap px-4">
                        {[...stackRibbon, ...stackRibbon].map((item, index) => (
                          <span key={`${item}-${index}`} className="inline-flex items-center gap-3 text-sm text-white/70">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience" className="section-anchor pt-20 lg:pt-24">
          <div className="mx-auto grid max-w-[1520px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-20 xl:px-28">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionHeading
                index="02"
                eyebrow="Career arc"
                title="From dashboards to AI-assisted systems and map-heavy platforms."
                description="Each role sharpens a different frequency: product delivery, spatial systems, quality engineering, and interfaces built to survive real usage."
              />

              <div className="mt-8 grid gap-4">
                {profile.skills.map((group) => (
                  <article key={group.title} className="cinematic-panel soft-border rounded-[24px] p-5">
                    <p className="mono-face text-[0.72rem] uppercase tracking-[0.26em] text-[var(--accent)]">
                      {group.title}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={`${group.title}-${item}`}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {profile.experience.map((item, index) => (
                <article key={`${item.company}-${item.role}`} className="cinematic-panel soft-border reveal-card rounded-[28px] p-6 sm:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-black">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                          {item.period}
                        </span>
                      </div>

                      <h3 className="display-face mt-5 text-[2rem] font-semibold leading-[0.96] tracking-[-0.04em] text-white">
                        {item.role}
                      </h3>
                      <p className="mt-2 text-base text-white/74">
                        {item.company} - {item.location}
                      </p>
                      <p className="mt-5 text-lg leading-8 text-white/82">{item.summary}</p>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {item.highlights.map((highlight) => (
                          <div
                            key={`${item.company}-${highlight}`}
                            className="rounded-[20px] border border-white/8 bg-black/16 px-4 py-4 text-sm leading-6 text-white/74"
                          >
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full max-w-sm space-y-4 lg:min-w-[280px]">
                      <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                        <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                          Impact note
                        </p>
                        <p className="mt-3 text-lg leading-7 text-white">{item.impact}</p>
                      </div>

                      <div className="rounded-[22px] border border-white/10 bg-black/20 p-5">
                        <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                          Toolkit
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.tools.map((tool) => (
                            <span
                              key={`${item.role}-${tool}`}
                              className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-white/80"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section-anchor py-20 lg:py-28">
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-20 xl:px-28">
            <SectionHeading
              index="03"
              eyebrow="Selected work"
              title="Projects staged like headline releases, with the interface carrying the atmosphere."
              description="The UI stays dark and focused. The project imagery carries the color. Each card acts like a case-study poster with direct links when the build is public."
            />

            <div className="mt-12 grid grid-cols-1 auto-rows-[minmax(320px,1fr)] gap-5 lg:grid-cols-12">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  layout={PROJECT_LAYOUTS[index % PROJECT_LAYOUTS.length]}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section-anchor py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1520px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-20 xl:px-28">
            <div>
              <SectionHeading
                index="04"
                eyebrow="Formation"
                title="Engineering fundamentals, certifications, and a habit of learning in public."
                description="The foundation is software engineering, but the portfolio also reflects QA depth, AI exploration, and a strong appetite for production-focused tooling."
              />

              <div className="mt-8 space-y-5">
                {education.map((item) => (
                  <article key={`${item.institution}-${item.degree}`} className="cinematic-panel soft-border rounded-[28px] p-6 sm:p-7">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)] text-base font-semibold uppercase tracking-[0.18em] text-black">
                        {initials(item.institution)}
                      </div>
                      <div>
                        <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                          {item.period}
                        </p>
                        <h3 className="display-face mt-3 text-[1.8rem] leading-[0.98] tracking-[-0.04em] text-white">
                          {item.degree}
                        </h3>
                        <p className="mt-2 text-base text-white/74">
                          {item.institution} - {item.location}
                        </p>
                        <p className="mt-4 text-base leading-7 text-white/78">{item.description}</p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {item.achievements.map((achievement) => (
                            <span
                              key={`${item.institution}-${achievement}`}
                              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80"
                            >
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-5 lg:pt-20">
              <article className="cinematic-panel soft-border rounded-[28px] p-6 sm:p-7">
                <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--accent)]">
                  Certifications
                </p>
                <div className="mt-5 space-y-4">
                  {certifications.map((item) => (
                    <div
                      key={`${item.issuer}-${item.name}`}
                      className="rounded-[22px] border border-white/10 bg-black/18 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <p className="mt-1 text-sm text-white/66">
                            {item.issuer} - {item.date}
                          </p>
                        </div>
                        <div className="rounded-full border border-white/10 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                          {item.date}
                        </div>
                      </div>

                      <p className="mono-face mt-4 text-[0.72rem] uppercase tracking-[0.24em] text-white/54">
                        Credential: {item.credentialId}
                      </p>
                      {item.link ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex rounded-full border border-white/14 px-4 py-2 text-sm uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                        >
                          View credential
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>

              <article className="cinematic-panel soft-border rounded-[28px] p-6 sm:p-7">
                <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--accent)]">
                  Languages
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {profile.languages.map((language) => (
                    <div
                      key={language.name}
                      className="rounded-[22px] border border-white/10 bg-black/18 p-4"
                    >
                      <p className="text-lg font-semibold text-white">{language.name}</p>
                      <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--muted)]">
                        {language.level}
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="cinematic-panel soft-border rounded-[28px] p-6 sm:p-7">
                <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--accent)]">
                  Operating principles
                </p>
                <div className="mt-5 grid gap-3">
                  {profile.principles.map((principle) => (
                    <div
                      key={principle}
                      className="rounded-[20px] border border-white/10 bg-black/18 px-4 py-4 text-sm leading-6 text-white/78"
                    >
                      {principle}
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="contact" className="section-anchor pt-12 lg:pt-20">
          <div className="mx-auto max-w-[1520px] px-4 sm:px-6 lg:px-20 xl:px-28">
            <div className="cinematic-panel soft-border relative overflow-hidden rounded-[34px] px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,215,96,0.18),transparent_28%),linear-gradient(120deg,rgba(255,255,255,0.03),transparent_46%)]" />
              <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
                <div>
                  <p className="mono-face text-[0.72rem] uppercase tracking-[0.34em] text-[var(--muted)]">
                    05 / Closing track
                  </p>
                  <h2 className="display-face mt-5 max-w-4xl text-[clamp(2.8rem,6vw,5.6rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-white text-balance">
                    Ready to tune the next system, product surface, or platform release.
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">
                    If you need architecture thinking, full-stack delivery, QA discipline, or AI-assisted features that still feel grounded in product reality, I am ready to build.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${profile.person.email}`}
                      className="rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-black transition-transform duration-300 hover:-translate-y-1"
                    >
                      {profile.person.email}
                    </a>
                    <a
                      href={phoneHref(profile.person.phone)}
                      className="rounded-full border border-white/14 bg-white/4 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {profile.person.phone}
                    </a>
                    <a
                      href={profile.person.github}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/14 bg-white/4 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      GitHub
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                    <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                      Location
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">{profile.person.location}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                    <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                      Focus
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">Architecture + product systems</p>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-black/18 p-5">
                    <p className="mono-face text-[0.72rem] uppercase tracking-[0.28em] text-[var(--muted)]">
                      Availability
                    </p>
                    <p className="mt-3 text-lg font-semibold text-white">Open for new roles and selective freelance work</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
