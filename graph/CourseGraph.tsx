"use client";

import ForceGraph3D from "3d-force-graph";
import { useEffect, useRef, useState } from "react";
import { GraphData, GraphNode } from "./types";
import FacultySelector from "./FacultySelector";
import NodeInfoBox from "./NodeInfoBox";
const FACULTY_COLORS: Record<string, string> = {
  MAT: "#df1aa0",
  SCI: "#0072da",
  HEA: "#2596be",
  ENV: "#b6bf00",
  ENG: "#5d0096",
  ART: "#ed8c00",
  "N/A": "#888888",
};

const FACULTY_IDS = new Set(Object.keys(FACULTY_COLORS));

function mixWithWhite(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const newR = Math.round(r + (255 - r) * amount);
  const newG = Math.round(g + (255 - g) * amount);
  const newB = Math.round(b + (255 - b) * amount);

  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

export default function CourseGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ReturnType<typeof ForceGraph3D> | null>(null);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    const loadData = async () => {
      let data: GraphData;

      if (selectedFaculties.length === 0) {
        // Show empty graph when nothing selected
        data = {
          nodes: [],
          links: [],
        };
      } else {
        const url = `/api/graph?faculties=${selectedFaculties.join(",")}`;
        const res = await fetch(url);
        data = await res.json();

        // Count how many courses each node unlocks
        const unlockCount: Record<string, number> = {};
        data.nodes.forEach((node) => {
          node.prerequisites.forEach((prereq) => {
            unlockCount[prereq] = (unlockCount[prereq] || 0) + 1;
          });
        });

        // Find max unlock count for normalization
        const maxUnlocks = Math.max(...Object.values(unlockCount), 1);

        data.nodes.forEach((node: any) => {
          node.unlockCount = unlockCount[node.id] || 0;
          node.unlockRatio = node.unlockCount / maxUnlocks;
        });
      }

      if (graphRef.current) {
        graphRef.current.graphData(data);
      } else {
        graphRef.current = ForceGraph3D()(ref.current!)
          .graphData(data)
          .nodeLabel("title")
          .nodeColor((node: any) => {
            const baseColor = FACULTY_COLORS[node.faculty] || "#888888";
            if (FACULTY_IDS.has(node.id)) {
              return mixWithWhite(baseColor, 0.7);
            }
            return baseColor;
          })
          .nodeVal((node: any) => {
            if (FACULTY_IDS.has(node.id)) return 15;
            const unlockCount = node.unlockCount || 0;
            return Math.min(Math.max(1, Math.pow(1.15, unlockCount)), 10);
          })
          .backgroundColor("#050510")
          .onNodeClick((node) => {
            setSelectedNode(node as GraphNode);
          });
      }
    };

    loadData();
  }, [selectedFaculties]);

  return (
    <div className="relative w-full h-screen">
      {selectedNode && (
        <NodeInfoBox
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
      <FacultySelector
        selected={selectedFaculties}
        onChange={setSelectedFaculties}
      />
      <div ref={ref} className="w-full h-full" />
    </div>
  );
}
