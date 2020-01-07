import { gql } from "apollo-server-express";

export default gql`
    type Query {
        status: String

        newUUID: String
    }
`;