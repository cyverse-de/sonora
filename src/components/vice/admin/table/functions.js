// Constructs an ID for an element.
import { build as buildID } from "@cyverse-de/ui-lib";

import ids from "./ids";

export const id = (...names) => buildID(ids.BASE, ...names);
