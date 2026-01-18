"use client";

import ForceGraph3D from "3d-force-graph";
import { useEffect, useRef } from "react";
import { GraphData } from "./types";

export default function CourseGraph() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/graph")
      .then((res) => res.json())
      .then((data: GraphData) => {
        const graph = ForceGraph3D()(ref.current!)
          .graphData(data)
          .nodeLabel("label")
          .nodeAutoColorBy("faculty")
          .backgroundColor("#050510");
      });
  }, []);

  return <div ref={ref} className="w-full h-screen" />;
}
