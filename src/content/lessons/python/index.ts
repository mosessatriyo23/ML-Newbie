import type { Lesson } from "../../../types.ts";
import { lesson as syntax } from "./01-syntax.ts";
import { lesson as comments } from "./02-comments.ts";
import { lesson as variables } from "./03-variables.ts";
import { lesson as dataTypes } from "./04-data-types.ts";
import { lesson as numbers } from "./05-numbers.ts";
import { lesson as strings } from "./06-strings.ts";
import { lesson as boolean } from "./07-boolean.ts";
import { lesson as operators } from "./08-operators.ts";

export const PYTHON_LESSONS: Lesson[] = [syntax, comments, variables, dataTypes, numbers, strings, boolean, operators];
