import { gql } from "apollo-server-express";

export default gql`
    enum SortColumn {
        NAME
        ID
        LASTMODIFIED
        DATECREATED
        SIZE
        PATH
    }

    enum EntityType {
        FILE
        FOLDER
        ANY
    }

    enum SortDirection {
        ASC
        DESC
    }

    enum Permission {
        READ
        WRITE
        OWN
    }

    interface FilesystemObject {
        id: String!
        label: String
        path: String!
        permission: Permission
        dateCreated: BigInt
        dateModified: BigInt
        type: EntityType
        shareCount: Int
    }

    type File implements FilesystemObject {
        # Interface implementation
        id: String!
        label: String
        path: String!
        permission: Permission
        dateCreated: BigInt
        dateModified: BigInt
        type: EntityType!
        shareCount: Int

        # Specific to files
        infoType: String
        md5: String
        fileSize: BigInt
    }

    # Allows us to later extend the kinds of objects returned by a listing
    union FolderListingResult = File | Folder

    type Folder implements FilesystemObject {
        #Interface implementation
        id: String!
        label: String
        path: String!
        permission: Permission
        dateCreated: BigInt
        dateModified: BigInt
        type: EntityType!
        shareCount: Int

        # Specific to folders
        fileCount: Int
        listing(
            limit: Int = 50
            offset: Int = 0
            entityType: EntityType = ANY
            infoType: [String] = []
            sortColumn: SortColumn = NAME
        ): [FolderListingResult]
    }
`;
