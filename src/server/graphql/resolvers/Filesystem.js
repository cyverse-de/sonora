export default {
    // Mapping for the SortColumn enum.
    SortColumn: {
        NAME: "NAME",
        ID: "ID",
        LASTMODIFIED: "LASTMODIFIED",
        DATECREATED: "DATECREATED",
        SIZE: "SIZE",
        PATH: "PATH",
    },

    // Mapping for the EntityType enum.
    EntityType: {
        FILE: "FILE",
        FOLDER: "FOLDER",
        ANY: "ANY",
    },

    // Mapping for the SortDirection enum.
    SortDirection: {
        ASC: "ASC",
        DESC: "DESC",
    },

    // Mapping for the Permission enum.
    Permission: {
        READ: "read",
        WRITE: "write",
        OWN: "own",
    },

    FolderListingResult: {
        __resolveType(obj, _context, _info) {
            if (obj.type.toUpperCase() === "FILE") return "File";
            if (obj.type.toUpperCase() === "FOLDER") return "Folder";
            return null;
        },
    },

    FilesystemObject: {
        __resolveType(obj, _context, _info) {
            if (obj.type.toUpperCase() === "FILE") return "File";
            if (obj.type.toUpperCase() === "FOLDER") return "Folder";
            return null;
        },
    },

    Folder: {
        listing: async (folder, args, { dataSources }) =>
            await dataSources.terrain.listFolder(
                args.folderPath,
                args.limit,
                args.offset,
                args.entityType,
                args.sortColumn,
                args.sortDirection
            ),
    },
};
