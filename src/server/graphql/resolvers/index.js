import { merge } from "lodash";

import Query from "./Query";
import BigInt from "graphql-bigint";

export default merge(
    {
        BigInt: BigInt,
    },
    Query
);
