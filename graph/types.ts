export type GraphNode = {
  id: string;
  description: string;
  faculty: string;
  prerequisites: string[];
  unlocks: string[];
  description: string;
  level: number;

  // --- simulation / layout fields (optional) ---
  x?: number;
  y?: number;
  z?: number;
  fx?: number;
  fy?: number;
  fz?: number;
};

export type GraphLink = {
  source: string;
  target: string;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};
