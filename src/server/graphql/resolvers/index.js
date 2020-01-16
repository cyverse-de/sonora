import { merge } from "lodash";

import Query from "./Query";
import BigInt from "graphql-bigint";
import Filesystem from "./Filesystem";

export default merge(
    {
        BigInt: BigInt,
    },
    Filesystem,
    Query
);
