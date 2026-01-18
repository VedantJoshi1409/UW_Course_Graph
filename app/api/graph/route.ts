import { NextResponse } from "next/server";
import { GraphData } from "@/graph/types";

export async function GET() {
  const data: GraphData = {
    nodes: [
      {
        id: "Root",
        description: "Root Node",
        faculty: "None",
        prerequisites: [],
        unlocks: [],
        level: 0,
      },

      // ===== Faculty =====
      {
        id: "Math",
        description: "Faculty of Mathematics",
        faculty: "Math",
        prerequisites: ["Root"],
        unlocks: [],
        level: 0,
      },
      {
        id: "Health",
        description: "Faculty of Health Sciences",
        faculty: "Health",
        prerequisites: ["Root"],
        unlocks: [],
        level: 0,
      },
      {
        id: "Engineering",
        description: "Faculty of Engineering",
        faculty: "Engineering",
        prerequisites: ["Root"],
        unlocks: [],
        level: 0,
      },
      {
        id: "Science",
        description: "Faculty of Science",
        faculty: "Science",
        prerequisites: ["Root"],
        unlocks: [],
        level: 0,
      },
      {
        id: "Arts",
        description: "Faculty of Arts",
        faculty: "Arts",
        prerequisites: ["Root"],
        unlocks: [],
        level: 0,
      },
      {
        id: "Environment",
        description: "Faculty of Environment",
        faculty: "Environment",
        prerequisites: ["Root"],
        unlocks: [],
        level: 0,
      },

      // ===== CS Core =====
      {
        id: "CS115",
        description: "Intro to Computer Programming",
        faculty: "Math",
        prerequisites: ["Math"],
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
        prerequisites: ["Math"],
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
        prerequisites: ["Math"],
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
        prerequisites: ["Math"],
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

      // ===== Arts =====
      {
        id: "ECON101",
        description: "Introduction to Microeconomics",
        faculty: "Arts",
        prerequisites: ["Arts"],
        unlocks: ["ECON102"],
        level: 1,
      },
      {
        id: "ECON102",
        description: "Introduction to Macroeconomics",
        faculty: "Arts",
        prerequisites: ["ECON101"],
        unlocks: ["ECON201"],
        level: 1,
      },
      {
        id: "ECON201",
        description: "Intermediate Microeconomic Theory",
        faculty: "Arts",
        prerequisites: ["ECON102"],
        unlocks: [],
        level: 2,
      },

      {
        id: "PSYCH101",
        description: "Introductory Psychology",
        faculty: "Arts",
        prerequisites: ["Arts"],
        unlocks: ["PSYCH207"],
        level: 1,
      },
      {
        id: "PSYCH207",
        description: "Cognitive Processes",
        faculty: "Arts",
        prerequisites: ["PSYCH101"],
        unlocks: [],
        level: 2,
      },

      // ===== Science =====
      {
        id: "PHYS121",
        description: "Mechanics",
        faculty: "Science",
        prerequisites: ["Science", "MATH137"],
        unlocks: ["PHYS122"],
        level: 1,
      },
      {
        id: "PHYS122",
        description: "Waves and Electricity",
        faculty: "Science",
        prerequisites: ["PHYS121"],
        unlocks: [],
        level: 1,
      },

      {
        id: "BIOL130",
        description: "Introduction to Cell Biology",
        faculty: "Science",
        prerequisites: ["Science"],
        unlocks: ["BIOL239"],
        level: 1,
      },
      {
        id: "BIOL239",
        description: "Genetics",
        faculty: "Science",
        prerequisites: ["BIOL130"],
        unlocks: [],
        level: 2,
      },

      // ===== Health =====
      {
        id: "HLTH101",
        description: "Foundations of Health",
        faculty: "Health",
        prerequisites: ["Health"],
        unlocks: ["HLTH204"],
        level: 1,
      },
      {
        id: "HLTH204",
        description: "Health Research Methods",
        faculty: "Health",
        prerequisites: ["HLTH101"],
        unlocks: [],
        level: 2,
      },

      {
        id: "KIN100",
        description: "Introduction to Kinesiology",
        faculty: "Health",
        prerequisites: ["Health"],
        unlocks: ["KIN204"],
        level: 1,
      },
      {
        id: "KIN204",
        description: "Biomechanics",
        faculty: "Health",
        prerequisites: ["KIN100"],
        unlocks: [],
        level: 2,
      },

      // ===== Environment =====
      {
        id: "ENVS100",
        description: "Introduction to Environmental Studies",
        faculty: "Environment",
        prerequisites: ["Environment"],
        unlocks: ["ENVS200"],
        level: 1,
      },
      {
        id: "ENVS200",
        description: "Field Ecology",
        faculty: "Environment",
        prerequisites: ["ENVS100"],
        unlocks: [],
        level: 2,
      },

      {
        id: "GEOG101",
        description: "Global Environmental Systems",
        faculty: "Environment",
        prerequisites: ["Environment"],
        unlocks: ["GEOG202"],
        level: 1,
      },
      {
        id: "GEOG202",
        description: "Climate Change",
        faculty: "Environment",
        prerequisites: ["GEOG101"],
        unlocks: [],
        level: 2,
      },

      // ===== Engineering =====
      {
        id: "ENG101",
        description: "Introduction to Engineering",
        faculty: "Engineering",
        prerequisites: ["Engineering"],
        unlocks: ["ENG121"],
        level: 1,
      },
      {
        id: "ENG121",
        description: "Engineering Mechanics",
        faculty: "Engineering",
        prerequisites: ["ENG101", "MATH137"],
        unlocks: [],
        level: 1,
      },

      {
        id: "ECE105",
        description: "Classical Mechanics",
        faculty: "Engineering",
        prerequisites: ["Engineering"],
        unlocks: ["ECE106"],
        level: 1,
      },
      {
        id: "ECE106",
        description: "Electric Circuits",
        faculty: "Engineering",
        prerequisites: ["ECE105"],
        unlocks: [],
        level: 1,
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
