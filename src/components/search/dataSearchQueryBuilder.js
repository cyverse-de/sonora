export const getDataSimpleSearchQuery = (
    searchTerm,
    userHomeDir,
    communityDataDir,
    isDetailed = false,
    userProfile,
    rowsPerPage,
    offset,
    sortField,
    sortDir
) => {
    const searchClauses = [
        { type: "label", args: { exact: false, label: searchTerm } },
    ];
    let pathPrefix = communityDataDir;
    if (userProfile?.id) {
        //logged in user
        if (isDetailed) {
            pathPrefix = ""; //show all results
        } else {
            pathPrefix = userHomeDir; //global search at top show top 10 from home dir
        }
    }
    return {
        query: {
            all: pathPrefix
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
