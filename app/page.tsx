"use client";

import dynamic from "next/dynamic";

const CourseGraph = dynamic(
  () => {
    // Polyfill GPUShaderStage for browsers without WebGPU support.
    // Three.js (via three-render-objects) has a bug where it evaluates
    // `self.GPUShaderStage` assuming it's defined when `self` exists,
    // causing "can't access property 'VERTEX'" errors in browsers
    // without WebGPU. This polyfill lets the module load safely and
    // fall back to the WebGL renderer.
    if (typeof self !== "undefined" && !(self as any).GPUShaderStage) {
      (self as any).GPUShaderStage = {
        VERTEX: 1,
        FRAGMENT: 2,
        COMPUTE: 4,
      };
    }
    return import("@/graph/CourseGraph");
  },
  { ssr: false },
);

export default function ViewerPage() {
  return <CourseGraph />;
}
