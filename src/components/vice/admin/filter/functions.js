import { build as buildID } from "@cyverse-de/ui-lib";

import ids from "./ids";

export const id = (...name) => buildID(ids.BASE, ...name);
