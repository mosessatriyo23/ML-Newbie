export interface WorkflowStep {
  id: string;
  n: number;
  title: string;
  phase: "data" | "model" | "result";
  goal: string;
  input: string;
  output_desc: string;
  libraries: string;
  functions: string[];
  code?: string;
  /** Output persis dari `code` (diverifikasi). */
  output?: string;
  mistakes: string[];
  next: string;
  lessons: string[];
}
export const WORKFLOW_STEPS: WorkflowStep[] = [];
