import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const UUID = gql`
    query uuid {
        newUUID
    }
`;

function UuidTest(props) {
    const {data} = useQuery(UUID);
    console.log(data);
    const uuid = data?.newUUID;

    return (
       <span>{uuid}</span>
    )
}

export default UuidTest;