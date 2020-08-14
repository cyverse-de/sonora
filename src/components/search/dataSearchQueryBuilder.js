export const getDataSimpleSearchQuery = (
    searchTerm,
    userHomeDir,
    rowsPerPage,
    offset,
    sortField,
    sortDir
) => {
    const searchClauses = [
        { type: "label", args: { exact: false, label: searchTerm } },
    ];
    return {
        query: {
            all: userHomeDir
                ? searchClauses.concat({
                      type: "path",
                      args: { prefix: userHomeDir },
                  })
                : searchClauses,
        },
        size: rowsPerPage,
        from: offset,
        sort: [{ field: sortField, order: sortDir }],
    };
};
