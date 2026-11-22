import type { Lesson } from "../../../types.ts";
import { lesson as intro } from "./01-intro.ts";
import { lesson as creating } from "./02-creating.ts";
import { lesson as dimensions } from "./03-dimensions.ts";
import { lesson as shape } from "./04-shape.ts";
import { lesson as indexing } from "./05-indexing.ts";
import { lesson as slicing } from "./06-slicing.ts";
import { lesson as dtypes } from "./07-dtypes.ts";
import { lesson as reshaping } from "./08-reshaping.ts";
import { lesson as operations } from "./09-operations.ts";
import { lesson as math } from "./10-math.ts";
import { lesson as stats } from "./11-stats.ts";
import { lesson as random } from "./12-random.ts";
import { lesson as boolean } from "./13-boolean.ts";
import { lesson as broadcasting } from "./14-broadcasting.ts";

export const NUMPY_LESSONS: Lesson[] = [intro, creating, dimensions, shape, indexing, slicing, dtypes, reshaping, operations, math, stats, random, boolean, broadcasting];
