import type { Lesson } from "../../types.ts";
import { NUMPY_LESSONS } from "./numpy/index.ts";
import { PANDAS_LESSONS } from "./pandas/index.ts";
import { PYTHON_LESSONS } from "./python/index.ts";

export const ALL_LESSONS: Lesson[] = [...PYTHON_LESSONS, ...NUMPY_LESSONS, ...PANDAS_LESSONS];
