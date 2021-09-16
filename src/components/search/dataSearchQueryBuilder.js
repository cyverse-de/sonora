export const getDataSimpleSearchQuery = (
    searchTerm,
    userHomeDir,
    communityDataDir,
    rowsPerPage,
    offset,
    sortField,
    sortDir
) => {
    const searchClauses = [
        { type: "label", args: { exact: false, label: searchTerm } },
    ];
    const pathPrefix = userHomeDir ? userHomeDir : communityDataDir;
    return {
        query: {
            all: searchClauses.concat({
                type: "path",
                args: { prefix: pathPrefix },
            }),
        },
        size: rowsPerPage,
        from: offset,
        sort: [{ field: sortField, order: sortDir }],
    };
};
