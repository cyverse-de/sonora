/**
 * @author sriram
 *
 * Global search story
 *
 */

import React from "react";
import { mockAxios } from "../axiosMock";
import GlobalSearchField from "components/search/GlobalSearchField";
import {
    dataSearchResp,
    appsSearchResp,
    analysesSearchResp,
} from "./searchMocks";
import { teamList } from "../teams/TeamMocks";

function GlobalSearchFieldTest() {
    mockAxios.onPost(/\/api\/filesystem\/search.*/).reply(200, dataSearchResp);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);
    mockAxios.onGet(/\/api\/analyses.*/).reply(200, analysesSearchResp);
    mockAxios.onGet(/\/api\/teams*/).reply(200, teamList);

    return <GlobalSearchField />;
}

export default { title: "Search / Global" };

export const SearchField = () => <GlobalSearchFieldTest />;
