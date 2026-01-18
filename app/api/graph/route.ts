import { NextResponse } from "next/server";
import { GraphData } from "@/graph/types";

export async function GET() {
  const data: GraphData = {
    nodes: [
      // ===== CS Core =====
      {
        id: "CS115",
        description: "Intro to Computer Programming",
        faculty: "Math",
        prerequisites: [],
        unlocks: ["CS116", "CS135"],
        level: 1,
      },
      {
        id: "CS116",
        description: "Intro to Computer Science 2",
        faculty: "Math",
        prerequisites: ["CS115"],
        unlocks: ["CS136"],
        level: 1,
      },

      {
        id: "CS135",
        description: "Designing Functional Programs",
        faculty: "Math",
        prerequisites: [],
        unlocks: ["CS136", "CS245"],
        level: 1,
      },
      {
        id: "CS136",
        description: "Elementary Algorithm Design and Data Abstraction",
        faculty: "Math",
        prerequisites: ["CS135"],
        unlocks: ["CS246", "CS245"],
        level: 1,
      },
      {
        id: "CS245",
        description: "Logic and Computation",
        faculty: "Math",
        prerequisites: ["CS136"],
        unlocks: ["CS341", "CS350"],
        level: 2,
      },
      {
        id: "CS246",
        description: "Object-Oriented Software Development",
        faculty: "Math",
        prerequisites: ["CS136"],
        unlocks: ["CS341", "CS348", "CS350"],
        level: 2,
      },

      {
        id: "CS241",
        description: "Foundations of Sequential Programs",
        faculty: "Math",
        prerequisites: ["CS136"],
        unlocks: ["CS251", "CS350"],
        level: 2,
      },
      {
        id: "CS251",
        description: "Computer Organization and Design",
        faculty: "Math",
        prerequisites: ["CS241"],
        unlocks: ["CS350"],
        level: 2,
      },

      {
        id: "CS240",
        description: "Data Structures and Data Management",
        faculty: "Math",
        prerequisites: ["CS136"],
        unlocks: ["CS341", "CS348"],
        level: 2,
      },

      {
        id: "CS341",
        description: "Algorithms",
        faculty: "Math",
        prerequisites: ["CS246", "CS245"],
        unlocks: ["CS451", "CS466"],
        level: 3,
      },
      {
        id: "CS350",
        description: "Operating Systems",
        faculty: "Math",
        prerequisites: ["CS246", "CS245", "CS251"],
        unlocks: ["CS452", "CS454"],
        level: 3,
      },
      {
        id: "CS348",
        description: "Introduction to Database Management",
        faculty: "Math",
        prerequisites: ["CS246", "CS240"],
        unlocks: ["CS448"],
        level: 3,
      },

      {
        id: "CS370",
        description: "Numerical Computation",
        faculty: "Math",
        prerequisites: ["CS136", "MATH137", "MATH235"],
        unlocks: ["CS475"],
        level: 3,
      },

      // ===== CS Upper-Year-ish =====
      {
        id: "CS451",
        description: "Data-Intensive Distributed Computing",
        faculty: "Math",
        prerequisites: ["CS341", "CS348"],
        unlocks: [],
        level: 4,
      },
      {
        id: "CS452",
        description: "Real-Time Programming",
        faculty: "Math",
        prerequisites: ["CS350"],
        unlocks: [],
        level: 4,
      },
      {
        id: "CS454",
        description: "Distributed Systems",
        faculty: "Math",
        prerequisites: ["CS350", "CS341"],
        unlocks: [],
        level: 4,
      },
      {
        id: "CS466",
        description: "Algorithm Design and Analysis",
        faculty: "Math",
        prerequisites: ["CS341"],
        unlocks: [],
        level: 4,
      },
      {
        id: "CS448",
        description: "Introduction to Compilers",
        faculty: "Math",
        prerequisites: ["CS246", "CS241"],
        unlocks: [],
        level: 4,
      },
      {
        id: "CS475",
        description: "Computational Linear Algebra",
        faculty: "Math",
        prerequisites: ["CS370", "MATH235"],
        unlocks: [],
        level: 4,
      },

      // ===== Math Core =====
      {
        id: "MATH135",
        description: "Algebra for Honours Mathematics",
        faculty: "Math",
        prerequisites: [],
        unlocks: ["MATH136", "MATH235", "CO250"],
        level: 1,
      },
      {
        id: "MATH136",
        description: "Linear Algebra 1 (Advanced)",
        faculty: "Math",
        prerequisites: ["MATH135"],
        unlocks: ["MATH235"],
        level: 1,
      },

      {
        id: "MATH137",
        description: "Calculus 1",
        faculty: "Math",
        prerequisites: [],
        unlocks: ["MATH138", "MATH235"],
        level: 1,
      },
      {
        id: "MATH138",
        description: "Calculus 2",
        faculty: "Math",
        prerequisites: ["MATH137"],
        unlocks: ["MATH235"],
        level: 1,
      },

      {
        id: "MATH235",
        description: "Linear Algebra 2",
        faculty: "Math",
        prerequisites: ["MATH136", "MATH138"],
        unlocks: ["CS370"],
        level: 2,
      },

      // ===== Combinatorics & Optimization =====
      {
        id: "CO250",
        description: "Introduction to Optimization",
        faculty: "Math",
        prerequisites: ["MATH135"],
        unlocks: ["CO351"],
        level: 2,
      },
      {
        id: "CO351",
        description: "Network Flow Theory",
        faculty: "Math",
        prerequisites: ["CO250", "CS245"],
        unlocks: [],
        level: 3,
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
