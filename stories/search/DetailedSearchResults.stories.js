/**
 * @author sriram
 *
 * Global search story
 *
 */

import React from "react";
import { mockAxios } from "../axiosMock";
import DetailedSearchResults from "components/search/detailed/DetailedSearchResults";
import {dataSearchResp, appsSearchResp, analysesSearchResp} from "./searchMocks";

function DetailedSearchResultsTest() {
    mockAxios.onPost(/\/api\/filesystem\/search.*/).reply(200, dataSearchResp);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);
    mockAxios.onGet(/\/api\/analyses.*/).reply(200, analysesSearchResp);

    return <DetailedSearchResults searchTerm="test" filter="all" />;
}

export default { title: "Search" };

export const DetailedSearch = () => <DetailedSearchResultsTest />;
