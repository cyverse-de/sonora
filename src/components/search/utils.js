import NavigationConstants from "../../common/NavigationConstants";

export const getSearchLink = ({ searchTerm = "", advancedDataQuery = "" }) => {
    return `/${
        NavigationConstants.SEARCH
    }?searchTerm=${searchTerm}&advancedDataQuery=${JSON.stringify(
        advancedDataQuery
    )}`;
};
