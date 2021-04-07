import analysisFields from "components/analyses/analysisFields";

const analysesFilter = {
    field: "",
    value: "",
};

export const getAnalysesSearchQueryFilter = (searchTerm, t) => {
    const analysisRecordFields = analysisFields(t);
    const searchFilters = [];

    const nameFilterObj = Object.create(analysesFilter);
    nameFilterObj.field = analysisRecordFields.NAME.key;
    nameFilterObj.value = searchTerm;
    searchFilters.push(nameFilterObj);

    const appNameFilterObj = Object.create(analysesFilter);
    appNameFilterObj.field = analysisRecordFields.APP.key;
    appNameFilterObj.value = searchTerm;
    searchFilters.push(appNameFilterObj);

    return JSON.stringify(searchFilters);
};
