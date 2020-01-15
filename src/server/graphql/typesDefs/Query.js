import { gql } from "apollo-server-express";

export default gql`
    scalar JSON
    scalar BigInt

    type Query {
        status: String

        newUUID: String

        filesystemStat(paths: [String]): [FilesystemObject]

        listFolder(
            path: String
            limit: Int = 50
            offset: Int = 0
            entityType: EntityType = "any"
            sortColumn: SortColumn = "name"
            sortDirection: SortDirection = "asc"
        ): FolderListing
    }
`;
