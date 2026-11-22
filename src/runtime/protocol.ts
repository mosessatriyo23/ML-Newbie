// Kontrak pesan antara UI dan Web Worker Python.
export const PYODIDE_VERSION = "314.0.7";
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export interface PyError {
  type: string;
  message: string;
  line: number | null;
  traceback: string;
}

export interface TestResult {
  desc: string;
  passed: boolean;
  error: string | null;
}

export interface RawRunResult {
  output: string;
  error: PyError | null;
  figures: string[];
  tests: TestResult[] | null;
}

export type WorkerRequest =
  | { type: "init"; files: { path: string; content: string }[]; assetBase: string; indexURL: string }
  | { type: "run"; id: number; code: string; tests?: string }
  | { type: "writeFile"; id: number; path: string; content: string | Uint8Array }
  | { type: "listFiles"; id: number }
  | { type: "readFile"; id: number; path: string };

export type WorkerResponse =
  | { type: "status"; text: string }
  | { type: "ready"; pyodideVersion: string; pythonVersion: string }
  | { type: "stdout"; text: string }
  | { type: "stderr"; text: string }
  | { type: "started"; id: number }
  | { type: "result"; id: number; result: RawRunResult }
  | { type: "ack"; id: number }
  | { type: "files"; id: number; files: { name: string; size: number }[] }
  | { type: "fileData"; id: number; data: Uint8Array }
  | { type: "fatal"; text: string };
