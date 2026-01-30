import { existsSync, readFileSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import type { GraphNode } from "@/graph/types";

const SCRAPER_DIR = path.join(process.cwd(), "lib/scraper");
const PREREQUISITES_PATH = path.join(SCRAPER_DIR, "prerequisites.json");

export type CoursePrerequisite = {
  name: string;
  subject: string;
  prerequisites: string[];
  error?: string;
};

export type PrerequisitesData = Record<string, CoursePrerequisite>;

/**
 * Checks if prerequisites.json exists in the scraper directory
 */
export function prerequisitesExist(): boolean {
  return existsSync(PREREQUISITES_PATH);
}

/**
 * Runs the scraper scripts in order to collect prerequisites data.
 * Executes: collect_subject_links.js -> collect_course_links.js -> collect_prerequisites.js
 */
export async function runScrapers(): Promise<void> {
  const scripts = [
    "collect_subject_links.js",
    "collect_course_links.js",
    "collect_prerequisites.js",
  ];

  for (const script of scripts) {
    const scriptPath = path.join(SCRAPER_DIR, script);
    console.log(`Running ${script}...`);
    execSync(`node ${scriptPath}`, {
      cwd: SCRAPER_DIR,
      stdio: "inherit",
    });
  }
}

/**
 * Ensures prerequisites data exists, running scrapers if necessary,
 * then returns the parsed prerequisites data.
 */
export async function ensurePrerequisites(): Promise<PrerequisitesData> {
  if (!prerequisitesExist()) {
    console.log("Prerequisites not found, running scrapers...");
    await runScrapers();
  }
  return readPrerequisites();
}

/**
 * Reads and parses the prerequisites.json file.
 * Throws an error if the file doesn't exist.
 */
export function readPrerequisites(): PrerequisitesData {
  if (!prerequisitesExist()) {
    throw new Error(
      `Prerequisites file not found at ${PREREQUISITES_PATH}. Run the scrapers first.`
    );
  }

  const data = readFileSync(PREREQUISITES_PATH, "utf-8");
  return JSON.parse(data) as PrerequisitesData;
}

/**
 * Converts prerequisites data into graph nodes.
 * Level is derived from the first digit of the course number.
 */
export function toGraphNodes(
  data: PrerequisitesData,
  getFaculty: (course: CoursePrerequisite) => string
): GraphNode[] {
  return Object.entries(data).map(([code, course]) => {
    // Extract first digit from course number (e.g., "AFM101" -> 1, "CS246" -> 2)
    const match = code.match(/\d/);
    const level = match ? parseInt(match[0], 10) : 0;

    return {
      id: code,
      description: course.name,
      faculty: getFaculty(course),
      prerequisites: course.prerequisites,
      level,
    };
  });
}
