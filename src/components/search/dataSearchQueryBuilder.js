export const getDataSimpleSearchQuery = (
    searchTerm,
    userHomeDir,
    rowsPerPage,
    offset,
    sortField,
    sortDir,
) => {
    if (userHomeDir) {
        return {
            query: {
                all: [
                    {
                        type: "label",
                        args: {
                            exact: false,
                            label: searchTerm,
                        },
                    },
                    {
                        type: "path",
                        args: {
                            prefix: userHomeDir,
                        },
                    },
                ],
            },
            size: rowsPerPage,
            from: offset,
            sort: [
                {
                    field: sortField,
                    order: sortDir,
                },
            ],
        };
    } else {
        return {
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
                ],
            },
            size: rowsPerPage,
            from: offset,
            sort: [
                {
                    field: sortField,
                    order: sortDir,
                },
            ],
        };
    }
};
