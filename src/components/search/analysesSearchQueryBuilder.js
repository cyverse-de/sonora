import analysisFields from "components/analyses/analysisFields";

const analysesfilter = {
    field: "",
    value: "",
};

export const getAnalysesSearchQueryFilter = (searchTerm, t) => {
    const analysisRecordfields = analysisFields(t);
    const searchFilters = [];

    const nameFilterObj = Object.create(analysesfilter);
    nameFilterObj.field = analysisRecordfields.NAME.key;
    nameFilterObj.value = searchTerm;
    searchFilters.push(nameFilterObj);

    const appNameFilterObj = Object.create(analysesfilter);
    appNameFilterObj.field = analysisRecordfields.APP.key;
    appNameFilterObj.value = searchTerm;
    searchFilters.push(appNameFilterObj);

    const filterString = searchFilters
        .map((filterItem) => JSON.stringify(filterItem))
        .join(",");

    return filterString;
};
