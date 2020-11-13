/**
 * @author sriram
 *
 * Global search story
 *
 */

import React from "react";
import { mockAxios } from "../axiosMock";
import DetailedSearchResults from "components/search/detailed/DetailedSearchResults";
import SEARCH_RESULTS_TABS from "components/search/detailed/tabs";
import {
    dataSearchResp,
    appsSearchResp,
    analysesSearchResp,
} from "./searchMocks";
import { fileTypesResp } from "../data/DataMocks";

function DetailedSearchResultsTest() {
    mockAxios.onGet(/\/api\/filetypes\/type-list.*/).reply(200, fileTypesResp);
    mockAxios.onPost(/\/api\/filesystem\/search.*/).reply(200, dataSearchResp);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);
    mockAxios.onGet(/\/api\/analyses.*/).reply(200, analysesSearchResp);

    const [currentTab, setCurrentTab] = React.useState(
        SEARCH_RESULTS_TABS.data
    );

    return (
        <DetailedSearchResults
            searchTerm="test"
            filter="all"
            selectedTab={currentTab}
            onTabSelectionChange={(event, selection) => {
                console.log("Selected tab=" + selection);
                setCurrentTab(selection);
            }}
        />
    );
}

export default { title: "Search / Detailed" };

export const DetailedSearch = () => <DetailedSearchResultsTest />;
