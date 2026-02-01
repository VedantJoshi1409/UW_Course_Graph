import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GraphData, GraphNode } from "@/graph/types";

// Cache for course nodes
let cachedCourseNodes: GraphNode[] | null = null;

const facultyNodes: GraphNode[] = [
  {
    id: "MAT",
    title: "Mathematics",
    subject: "Mathematics",
    description: "Faculty of Mathematics",
    faculty: "MAT",
    prerequisites: [],
    unlocks: [],
    level: 0,
  },
  {
    id: "HEA",
    title: "Health Sciences",
    subject: "Health Sciences",
    description: "Faculty of Health Sciences",
    faculty: "HEA",
    prerequisites: [],
    unlocks: [],
    level: 0,
  },
  {
    id: "ENG",
    title: "Engineering",
    subject: "Engineering",
    description: "Faculty of Engineering",
    faculty: "ENG",
    prerequisites: [],
    unlocks: [],
    level: 0,
  },
  {
    id: "SCI",
    title: "Science",
    subject: "Science",
    description: "Faculty of Science",
    faculty: "SCI",
    prerequisites: [],
    unlocks: [],
    level: 0,
  },
  {
    id: "ART",
    title: "Arts",
    subject: "Arts",
    description: "Faculty of Arts",
    faculty: "ART",
    prerequisites: [],
    unlocks: [],
    level: 0,
  },
  {
    id: "ENV",
    title: "Environment",
    subject: "Environment",
    description: "Faculty of Environment",
    faculty: "ENV",
    prerequisites: [],
    unlocks: [],
    level: 0,
  },
  {
    id: "N/A",
    title: "Other",
    subject: "Other",
    description: "Other Courses",
    faculty: "N/A",
    prerequisites: [],
    unlocks: [],
    level: 0,
  },
];

async function getCourseNodes(): Promise<GraphNode[]> {
  if (cachedCourseNodes) {
    return cachedCourseNodes;
  }

  const courses = await prisma.course.findMany();
  cachedCourseNodes = courses.map((course) => ({
    id: course.id,
    title: course.title,
    subject: course.subject,
    description: course.description,
    faculty: course.faculty,
    level: course.level,
    prerequisites: course.prerequisites || [],
    unlocks: course.unlocks || [],
  }));

  return cachedCourseNodes;
}

function filterByFaculties(
  courseNodes: GraphNode[],
  faculties: string[],
): GraphNode[] {
  if (faculties.length === 0) {
    return courseNodes;
  }
  return courseNodes.filter((node) => faculties.includes(node.faculty));
}

function buildLinks(nodes: GraphNode[], includeFacultyLinks: boolean = true) {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const facultyIds = new Set(facultyNodes.map((n) => n.id));

  return nodes.flatMap((course) => {
    // Skip faculty nodes themselves
    if (facultyIds.has(course.id)) return [];

    if (course.prerequisites.length === 0) {
      if (includeFacultyLinks && nodeIds.has(course.faculty)) {
        return [{ source: course.faculty, target: course.id }];
      }
      return [];
    }

    // Check if any prerequisites exist in our node set
    const validPrereqs = course.prerequisites.filter((pre) => nodeIds.has(pre));

    if (validPrereqs.length === 0) {
      // No valid prereqs in filtered set, link to faculty if available
      if (includeFacultyLinks && nodeIds.has(course.faculty)) {
        return [{ source: course.faculty, target: course.id }];
      }
      return [];
    }

    return validPrereqs.map((pre) => ({
      source: pre,
      target: course.id,
    }));
  });
}

function getUnlockedCoursesRecursive(
  startCourses: string[],
  allCourses: GraphNode[],
): Set<string> {
  const unlocked = new Set<string>(startCourses);
  const courseMap = new Map(allCourses.map((c) => [c.id, c]));

  // BFS to find all recursively unlocked courses using pre-computed unlocks
  const queue = [...startCourses];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentCourse = courseMap.get(current);
    if (!currentCourse) continue;

    for (const courseId of currentCourse.unlocks || []) {
      if (!unlocked.has(courseId)) {
        const course = courseMap.get(courseId);
        if (course) {
          // Check if all prerequisites are unlocked
          unlocked.add(courseId);
          queue.push(courseId);
        }
      }
    }
  }

  return unlocked;
}

function filterByCourses(
  courseNodes: GraphNode[],
  courses: string[],
  includeUnlocked: boolean,
): GraphNode[] {
  if (courses.length === 0) {
    return [];
  }

  const courseIds = courses.map((c) => c.toUpperCase());

  if (!includeUnlocked) {
    return courseNodes.filter((node) => courseIds.includes(node.id));
  }

  const unlockedIds = getUnlockedCoursesRecursive(courseIds, courseNodes);
  return courseNodes.filter((node) => unlockedIds.has(node.id));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const facultiesParam = searchParams.get("faculties");
  const coursesParam = searchParams.get("courses");
  const includeUnlocked = searchParams.get("includeUnlocked") === "true";

  const allCourseNodes = await getCourseNodes();

  let filteredCourseNodes: GraphNode[];
  let filteredFacultyNodes: GraphNode[];

  if (coursesParam) {
    // Course search mode - no faculty nodes
    const courses = coursesParam.split(",").filter((c) => c.length > 0);
    filteredCourseNodes = filterByCourses(
      allCourseNodes,
      courses,
      includeUnlocked,
    );
    filteredFacultyNodes = [];
  } else {
    // Faculty filter mode
    const faculties = facultiesParam ? facultiesParam.split(",") : [];
    filteredCourseNodes = filterByFaculties(allCourseNodes, faculties);

    filteredFacultyNodes =
      faculties.length === 0
        ? facultyNodes
        : facultyNodes.filter((node) => faculties.includes(node.id));
  }

  const nodes = [...filteredFacultyNodes, ...filteredCourseNodes];
  const includeFacultyLinks = !coursesParam;

  const data: GraphData = {
    nodes,
    links: buildLinks(nodes, includeFacultyLinks),
  };

  return NextResponse.json(data);
}
