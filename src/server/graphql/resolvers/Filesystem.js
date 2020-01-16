export default {
    // Mapping for the SortColumn enum.
    SortColumn: {
        NAME: "name",
        ID: "id",
        LASTMODIFIED: "lastmodified",
        DATECREATED: "datecreated",
        SIZE: "size",
        PATH: "path",
    },

    // Mapping for the EntityType enum.
    EntityType: {
        FILE: "file",
        FOLDER: "folder",
        DIR: "dir",
        ANY: "any",
    },

    // Mapping for the SortDirection enum.
    SortDirection: {
        ASC: "asc",
        DESC: "desc",
    },

    // Mapping for the Permission enum.
    Permission: {
        READ: "read",
        WRITE: "write",
        OWN: "own",
    },

    FilesystemObject: {
        __resolveType(obj, _context, _info) {
            if (obj.type) {
                if (obj.type.toUpperCase() === "FILE") {
                    return "File"; // File is the name of the concrete GraphQL type.
                }
                if (obj.type === "dir" || obj.type.toUpperCase() === "FOLDER") {
                    return "Folder"; // Folder is the name of the concrete GraphQL type.
                }
            }
            return null;
        },
    },

    File: {
        md5: async (file, _args, { dataSources }) => {
            const stats = await dataSources.terrain.filesystemStat([file.path]);
            return stats[0]["md5"];
        },
        shareCount: async (file, _args, { dataSources }) => {
            const stats = await dataSources.terrain.filesystemStat([file.path]);
            return stats[0]["share-count"];
        },
    },

    Folder: {
        fileCount: async (folder, _args, { dataSources }) => {
            const stats = await dataSources.terrain.filesystemStat([
                folder.path,
            ]);
            return stats[0]["file-count"];
        },
        shareCount: async (folder, _args, { dataSources }) => {
            const stats = await dataSources.terrain.filesystemStat([
                folder.path,
            ]);
            return stats[0]["share-count"];
        },
        contents: async (folder, args, { dataSources }) =>
            await dataSources.terrain.listFolder(
                folder.path,
                args.limit || 50,
                args.offset || 0,
                args.entityType || "any",
                args.sortColumn || "name",
                args.sortDirection || "asc"
            ),
    },
};
