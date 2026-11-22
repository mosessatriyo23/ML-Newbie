import type { Lesson } from "../../types.ts";
import { PYTHON_LESSONS } from "./python/index.ts";

/** Semua lesson yang kontennya SUDAH lengkap. Lesson lain di kurikulum otomatis berstatus "belum tersedia". */
export const ALL_LESSONS: Lesson[] = [...PYTHON_LESSONS];
