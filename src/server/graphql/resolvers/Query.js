export default {
    Query: {
        status: async (_source, _args, { dataSources }) =>
            await dataSources.terrain.getStatus(),
        newUUID: async (_source, _args, { dataSources }) =>
            await dataSources.terrain.getNewUUID(),
        filesystem: async (_source, { path }, { dataSources }) =>
            await dataSources.terrain.filesystemStat(path),
    },
};
