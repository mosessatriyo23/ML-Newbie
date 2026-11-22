import type { Lesson } from "../../../types.ts";
import { lesson as syntax } from "./01-syntax.ts";
import { lesson as comments } from "./02-comments.ts";
import { lesson as variables } from "./03-variables.ts";
import { lesson as dataTypes } from "./04-data-types.ts";
import { lesson as numbers } from "./05-numbers.ts";
import { lesson as strings } from "./06-strings.ts";
import { lesson as boolean } from "./07-boolean.ts";
import { lesson as operators } from "./08-operators.ts";
import { lesson as list } from "./09-list.ts";
import { lesson as tuple } from "./10-tuple.ts";
import { lesson as set } from "./11-set.ts";
import { lesson as dictionary } from "./12-dictionary.ts";
import { lesson as conditionals } from "./13-conditionals.ts";
import { lesson as forLoop } from "./14-for-loop.ts";
import { lesson as whileLoop } from "./15-while-loop.ts";
import { lesson as functions } from "./16-functions.ts";
import { lesson as builtins } from "./17-builtins.ts";
import { lesson as modules } from "./18-modules.ts";
import { lesson as errors } from "./19-errors.ts";
import { lesson as files } from "./20-files.ts";

export const PYTHON_LESSONS: Lesson[] = [
  syntax, comments, variables, dataTypes, numbers, strings, boolean, operators, list, tuple, set, dictionary, conditionals, forLoop, whileLoop, functions, builtins, modules, errors, files,
];
