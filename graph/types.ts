export type GraphNode = {
  id: string;
  description: string;
  faculty: string;
  prerequisites: string[];
  unlocks: string[];
  description: string;
  level: number;
};

export type GraphLink = {
  source: string;
  target: string;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};
