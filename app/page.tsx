"use client";

import dynamic from "next/dynamic";

const CourseGraph = dynamic(() => import("@/graph/CourseGraph"), {
  ssr: false,
});

export default function ViewerPage() {
  return <CourseGraph />;
}
