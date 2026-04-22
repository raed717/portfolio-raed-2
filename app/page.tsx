import { readFile } from "node:fs/promises";
import path from "node:path";

import PortfolioBoot from "@/components/portfolio-boot";
import {
  type Certification,
  type EducationItem,
  type ProfileData,
  type Project,
} from "@/components/portfolio-page";

type ProjectsPayload = {
  projects: Project[];
};

type EducationPayload = {
  education: EducationItem[];
  certifications: Certification[];
};

async function loadJson<T>(fileName: string): Promise<T> {
  const filePath = path.join(process.cwd(), "public", "data", fileName);
  const content = await readFile(filePath, "utf8");

  return JSON.parse(content) as T;
}

export default async function Home() {
  const [projectsPayload, educationPayload, profile] = await Promise.all([
    loadJson<ProjectsPayload>("projects.json"),
    loadJson<EducationPayload>("education.json"),
    loadJson<ProfileData>("profile.json"),
  ]);

  return (
    <PortfolioBoot
      profile={profile}
      projects={projectsPayload.projects}
      education={educationPayload.education}
      certifications={educationPayload.certifications}
    />
  );
}
