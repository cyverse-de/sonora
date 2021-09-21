export const getDataSimpleSearchQuery = (
    searchTerm,
    userHomeDir,
    communityDataDir,
    isDetailed = false,
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
            all: !isDetailed
                ? searchClauses.concat({
                      type: "path",
                      args: { prefix: pathPrefix },
                  })
                : searchClauses,
        },
        size: rowsPerPage,
        from: offset,
        sort: [{ field: sortField, order: sortDir }],
    };
};
