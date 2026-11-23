import type { Lesson } from "../../../types.ts";
import { lesson as dataset } from "./01-dataset.ts";
import { lesson as featuresTarget } from "./02-features-target.ts";
import { lesson as numerical } from "./03-numerical.ts";
import { lesson as categorical } from "./04-categorical.ts";
import { lesson as csv } from "./05-csv.ts";
import { lesson as excel } from "./06-excel.ts";
import { lesson as json } from "./07-json.ts";
import { lesson as upload } from "./08-upload.ts";
import { lesson as url } from "./09-url.ts";

export const LOADING_LESSONS: Lesson[] = [dataset, featuresTarget, numerical, categorical, csv, excel, json, upload, url];
