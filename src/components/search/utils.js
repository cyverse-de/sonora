import NavigationConstants from "../../common/NavigationConstants";

export const getSearchLink = ({ searchTerm = "", advancedDataQuery = "" }) => {
    return {
        pathname: `/${NavigationConstants.SEARCH}`,
        query: {
            searchTerm,
            advancedDataQuery: JSON.stringify(advancedDataQuery),
        },
    };
};

export const extractTotal = (result) => {
    return typeof result?.total === "object"
        ? result?.total?.value
        : result?.total;
};
