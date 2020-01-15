export default {
    Query: {
        status: async (_source, _args, { dataSources }) =>
            await dataSources.terrain.getStatus(),
        newUUID: async (_source, _args, { dataSources }) =>
            await dataSources.terrain.getNewUUID(),
        filesystemStat: async (_source, { path }, { dataSources }) =>
            await dataSources.terrain.filesystemStat(path),

        // The defaults for the args don't seem to get passed down, we're setting
        // them here.
        listFolder: async (_source, args, { dataSources }) =>
            await dataSources.terrain.listFolder(
                args.path,
                args.limit || 50,
                args.offset || 0,
                args.entityType || "any",
                args.sortColumn || "name",
                args.sortDirection || "asc"
            ),
    },
};
