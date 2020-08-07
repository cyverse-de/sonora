import analysisFields from "components/analyses/analysisFields";

const analysesfilter = {
    field: "",
    value: "",
};

export const getAnalysesSearchQueryFilter = (searchTerm) => {
    const searchFilters = [];

    const nameFilterObj = Object.create(analysesfilter);
    nameFilterObj.field = analysisFields.NAME.key;
    nameFilterObj.value = searchTerm;
    searchFilters.push(nameFilterObj);

    const appNameFilterObj = Object.create(analysesfilter);
    appNameFilterObj.field = analysisFields.APP.key;
    appNameFilterObj.value = searchTerm;
    searchFilters.push(appNameFilterObj);

    const filterString = searchFilters
        .map((filterItem) => JSON.stringify(filterItem))
        .join(",");

    return filterString;
}
