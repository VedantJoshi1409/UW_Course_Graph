"use client";

import ForceGraph3D from "3d-force-graph";
import { useEffect, useRef, useState } from "react";
import { GraphData } from "./types";
import FacultySelector from "./FacultySelector";

export default function CourseGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ReturnType<typeof ForceGraph3D> | null>(null);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      let data: GraphData;

      if (selectedFaculties.length === 0) {
        // Show only root node when nothing selected
        data = {
          nodes: [
            {
              id: "Root",
              title: "Root",
              subject: "None",
              description: "Root Node",
              faculty: "None",
              prerequisites: [],
              level: 0,
              fx: 0,
              fy: 0,
              fz: 0,
            },
          ],
          links: [],
        };
      } else {
        const url = `/api/graph?faculties=${selectedFaculties.join(",")}`;
        const res = await fetch(url);
        data = await res.json();
        data.nodes.forEach((node) => {
          if (node.id === "Root") {
            node.fx = 0;
            node.fy = 0;
            node.fz = 0;
          }
        });
      }

      if (graphRef.current) {
        graphRef.current.graphData(data);
      } else {
        graphRef.current = ForceGraph3D()(ref.current!)
          .graphData(data)
          .nodeLabel("title")
          .nodeAutoColorBy("faculty")
          .backgroundColor("#050510");
      }
    };

    loadData();
  }, [selectedFaculties]);

  return (
    <div className="relative w-full h-screen">
      <FacultySelector
        selected={selectedFaculties}
        onChange={setSelectedFaculties}
      />
      <div ref={ref} className="w-full h-full" />
    </div>
  );
}
