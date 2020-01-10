import { gql } from "apollo-server-express";

export default gql`
    scalar JSON
    scalar BigInt

    type Query {
        status: String

        newUUID: String
    }
`;
