export interface CheatEntry {
  name: string;
  syntax: string;
  use: string;
  params?: string;
  example?: string;
  /** Output persis dari `example` (diverifikasi oleh scripts/test-content.ts). */
  output?: string;
}
export interface CheatCategory {
  id: string;
  title: string;
  items: CheatEntry[];
}
export const ML_WORKFLOW_CODE = ``;
export const CHEATSHEETS: CheatCategory[] = [];
