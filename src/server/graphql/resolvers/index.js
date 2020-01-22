import Query from "./Query";
import BigInt from "graphql-bigint";
import Filesystem from "./Filesystem";

export default {
    ...{
        BigInt: BigInt,
    },
    ...Filesystem,
    ...Query,
};
