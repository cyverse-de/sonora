export const getDataSimpleSearchQuery = (
    searchTerm,
    userHomeDir,
    rowsPerPage,
    offset
) => ({
    query: {
        all: [
            {
                type: "label",
                args: {
                    exact: false,
                    negated: false,
                    label: searchTerm,
                },
            },
            {
                type: "path",
                args: {
                    prefix: userHomeDir,
                    negated: false,
                },
            },
        ],
    },
    size: rowsPerPage,
    from: offset,
    sort: [
        {
            field: "label",
            order: "ascending",
        },
    ],
});
