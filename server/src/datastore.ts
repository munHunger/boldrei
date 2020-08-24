// @ts-ignore
import * as Datason from "datason";
import { resolveHome } from "./util";

export const db = new Datason.Database(resolveHome("~/.boldrei"));
