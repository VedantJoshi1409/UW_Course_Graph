import { NextResponse } from "next/server";
import { GraphData } from "@/graph/types";

export async function GET() {
  const data: GraphData = {
    nodes: [
      {
        id: "Root",
        title: "Root",
        subject: "None",
        description: "Root Node",
        faculty: "None",
        prerequisites: [],
        level: 0,
      },

      // ===== Faculty =====
      {
        id: "Math",
        title: "Mathematics",
        subject: "Mathematics",
        description: "Faculty of Mathematics",
        faculty: "Math",
        prerequisites: ["Root"],
        level: 0,
      },
      {
        id: "Health",
        title: "Health Sciences",
        subject: "Health Sciences",
        description: "Faculty of Health Sciences",
        faculty: "Health",
        prerequisites: ["Root"],
        level: 0,
      },
      {
        id: "Engineering",
        title: "Engineering",
        subject: "Engineering",
        description: "Faculty of Engineering",
        faculty: "Engineering",
        prerequisites: ["Root"],
        level: 0,
      },
      {
        id: "Science",
        title: "Science",
        subject: "Science",
        description: "Faculty of Science",
        faculty: "Science",
        prerequisites: ["Root"],
        level: 0,
      },
      {
        id: "Arts",
        title: "Arts",
        subject: "Arts",
        description: "Faculty of Arts",
        faculty: "Arts",
        prerequisites: ["Root"],
        level: 0,
      },
      {
        id: "Environment",
        title: "Environment",
        subject: "Environment",
        description: "Faculty of Environment",
        faculty: "Environment",
        prerequisites: ["Root"],
        level: 0,
      },
    ],
    links: [],
  };

  // Build links automatically from prerequisites
  data.links = data.nodes.flatMap((course) =>
    course.prerequisites.map((pre) => ({
      source: pre,
      target: course.id,
    })),
  );

  return NextResponse.json(data);
}
