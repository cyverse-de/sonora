// Constructs an ID for an element.
import buildID from "components/utils/DebugIDUtil";

import ids from "./ids";

export const id = (...names) => buildID(ids.BASE, ...names);
