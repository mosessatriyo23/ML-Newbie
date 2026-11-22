import type { Lesson } from "../../../types.ts";
import { lesson as intro } from "./01-intro.ts";
import { lesson as series } from "./02-series.ts";
import { lesson as dataframe } from "./03-dataframe.ts";
import { lesson as creating } from "./04-creating.ts";
import { lesson as selectCols } from "./05-select-cols.ts";
import { lesson as selectRows } from "./06-select-rows.ts";
import { lesson as loc } from "./07-loc.ts";
import { lesson as iloc } from "./08-iloc.ts";
import { lesson as filtering } from "./09-filtering.ts";

export const PANDAS_LESSONS: Lesson[] = [intro, series, dataframe, creating, selectCols, selectRows, loc, iloc, filtering];
