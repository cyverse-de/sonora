import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

export const id = (...name) => buildID(ids.BASE, ...name);
