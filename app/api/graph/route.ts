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
    level: 0,
  },
  {
    id: "HEA",
    title: "Health Sciences",
    subject: "Health Sciences",
    description: "Faculty of Health Sciences",
    faculty: "HEA",
    prerequisites: [],
    level: 0,
  },
  {
    id: "ENG",
    title: "Engineering",
    subject: "Engineering",
    description: "Faculty of Engineering",
    faculty: "ENG",
    prerequisites: [],
    level: 0,
  },
  {
    id: "SCI",
    title: "Science",
    subject: "Science",
    description: "Faculty of Science",
    faculty: "SCI",
    prerequisites: [],
    level: 0,
  },
  {
    id: "ART",
    title: "Arts",
    subject: "Arts",
    description: "Faculty of Arts",
    faculty: "ART",
    prerequisites: [],
    level: 0,
  },
  {
    id: "ENV",
    title: "Environment",
    subject: "Environment",
    description: "Faculty of Environment",
    faculty: "ENV",
    prerequisites: [],
    level: 0,
  },
  {
    id: "N/A",
    title: "Other",
    subject: "Other",
    description: "Other Courses",
    faculty: "N/A",
    prerequisites: [],
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
    prerequisites: course.prerequisites,
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

function buildLinks(nodes: GraphNode[]) {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const facultyIds = new Set(facultyNodes.map((n) => n.id));

  return nodes.flatMap((course) => {
    // Skip faculty nodes themselves
    if (facultyIds.has(course.id)) return [];

    if (course.prerequisites.length === 0) {
      return [{ source: course.faculty, target: course.id }];
    }

    // Check if any prerequisites exist in our node set
    const validPrereqs = course.prerequisites.filter((pre) => nodeIds.has(pre));

    if (validPrereqs.length === 0) {
      // No valid prereqs in filtered set, link to faculty instead
      return [{ source: course.faculty, target: course.id }];
    }

    return validPrereqs.map((pre) => ({
      source: pre,
      target: course.id,
    }));
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const facultiesParam = searchParams.get("faculties");
  const faculties = facultiesParam ? facultiesParam.split(",") : [];

  const allCourseNodes = await getCourseNodes();
  const filteredCourseNodes = filterByFaculties(allCourseNodes, faculties);

  // Filter faculty nodes to only include requested faculties
  const filteredFacultyNodes =
    faculties.length === 0
      ? facultyNodes
      : facultyNodes.filter((node) => faculties.includes(node.id));

  const nodes = [...filteredFacultyNodes, ...filteredCourseNodes];

  const data: GraphData = {
    nodes,
    links: buildLinks(nodes),
  };

  return NextResponse.json(data);
}
