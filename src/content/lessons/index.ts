import type { Lesson } from "../../types.ts";
import { NUMPY_LESSONS } from "./numpy/index.ts";
import { PYTHON_LESSONS } from "./python/index.ts";

/** Semua lesson yang kontennya SUDAH lengkap. Lesson lain di kurikulum otomatis berstatus "sedang ditulis". */
export const ALL_LESSONS: Lesson[] = [...PYTHON_LESSONS, ...NUMPY_LESSONS];
