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
    analysesSearchResp,
    appsSearchResp,
    dataSearchResp,
} from "./searchMocks";
import { teamList } from "../teams/TeamMocks";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import SearchConstants from "components/search/constants";

function GlobalSearchFieldTest() {
    mockAxios.onPost(/\/api\/filesystem\/search.*/).reply(200, dataSearchResp);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);
    mockAxios.onGet(/\/api\/analyses.*/).reply(200, analysesSearchResp);
    mockAxios.onGet(/\/api\/teams*/).reply(200, teamList);

    const globalOnShowDetailedSearch = (query) => {
        console.log("Go to Search page with settings", query);
    };

    const appOnShowDetailedSearch = (query) => {};

    return (
        <AppBar color="primary">
            <Typography>Global Search</Typography>
            <Toolbar>
                <GlobalSearchField
                    selectedFilter={SearchConstants.ALL}
                    onShowDetailedSearch={globalOnShowDetailedSearch}
                />
            </Toolbar>

            <Typography>App Only Search</Typography>
            <Toolbar>
                <GlobalSearchField
                    singleSearchOption={true}
                    selectedFilter={SearchConstants.APPS}
                    onShowDetailedSearch={appOnShowDetailedSearch}
                />
            </Toolbar>

            <Typography>Data Only Search</Typography>
            <Toolbar>
                <GlobalSearchField
                    singleSearchOption={true}
                    selectedFilter={SearchConstants.DATA}
                    onShowDetailedSearch={appOnShowDetailedSearch}
                />
            </Toolbar>
        </AppBar>
    );
}

export default { title: "Search / Global" };

export const SearchField = () => <GlobalSearchFieldTest />;
