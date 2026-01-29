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
        data.nodes.forEach((node) => {
          if (node.id === "Root") {
            node.fx = 0;
            node.fy = 0;
            node.fz = 0;
          }
        });

        // Faculty nodes = level 0 excluding Root
        const facultyNodes = data.nodes.filter(
          (node) => node.level === 0 && node.id !== "Root",
        );

        // Place faculties evenly on a sphere around Root
        const FACULTY_RADIUS = 20;
        const n = facultyNodes.length;

        // Fibonacci sphere
        const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399...

        facultyNodes.forEach((node, i) => {
          // y goes from 1 to -1
          const t = n === 1 ? 0.5 : i / (n - 1);
          const y = 1 - 2 * t;

          const r = Math.sqrt(1 - y * y); // radius of circle at that y
          const theta = goldenAngle * i;

          const x = Math.cos(theta) * r;
          const z = Math.sin(theta) * r;

          node.fx = x * FACULTY_RADIUS;
          node.fy = y * FACULTY_RADIUS;
          node.fz = z * FACULTY_RADIUS;
        });

        // Build a map of faculty positions for the custom force
        const facultyPositions = new Map<string, { x: number; y: number; z: number }>();
        facultyNodes.forEach((node) => {
          facultyPositions.set(node.id, {
            x: node.fx!,
            y: node.fy!,
            z: node.fz!,
          });
        });

        // Custom force to push nodes in the direction of their faculty
        function facultyDirectionForce(alpha: number) {
          data.nodes.forEach((node: any) => {
            if (node.id === "Root" || node.level === 0) return;

            const facultyPos = facultyPositions.get(node.faculty);
            if (!facultyPos) return;

            // Normalize faculty direction
            const len = Math.sqrt(
              facultyPos.x ** 2 + facultyPos.y ** 2 + facultyPos.z ** 2,
            );
            if (len === 0) return;

            const dirX = facultyPos.x / len;
            const dirY = facultyPos.y / len;
            const dirZ = facultyPos.z / len;

            // Target position based on level
            const targetRadius = (node.level + 1) * 30;
            const targetX = dirX * targetRadius;
            const targetY = dirY * targetRadius;
            const targetZ = dirZ * targetRadius;

            // Apply force towards target
            const strength = 0.3 * alpha;
            node.vx += (targetX - (node.x || 0)) * strength;
            node.vy += (targetY - (node.y || 0)) * strength;
            node.vz += (targetZ - (node.z || 0)) * strength;
          });
        }

        const graph = ForceGraph3D()(ref.current!)
          .graphData(data)
          .nodeLabel("id")
          .nodeAutoColorBy("faculty")
          .backgroundColor("#050510")
          .d3Force("facultyDirection", facultyDirectionForce);
      });
  }, []);

  return <div ref={ref} className="w-full h-screen" />;
}
