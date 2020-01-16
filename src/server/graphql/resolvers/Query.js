export default {
    Query: {
        status: async (_source, _args, { dataSources }) =>
            await dataSources.terrain.getStatus(),
        newUUID: async (_source, _args, { dataSources }) =>
            await dataSources.terrain.getNewUUID(),
        filesystem: async (_source, { paths }, { dataSources }) =>
            await dataSources.terrain.filesystemStat(paths),
    },
};
