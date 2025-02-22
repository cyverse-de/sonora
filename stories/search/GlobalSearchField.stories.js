/**
 * @author sriram
 *
 * Global search story
 *
 */

import React, { useState } from "react";
import { mockAxios } from "../axiosMock";
import GlobalSearchField from "components/search/GlobalSearchField";
import {
    analysesSearchResp,
    appsSearchResp,
    dataSearchResp,
} from "./searchMocks";
import { teamList } from "../teams/TeamMocks";
import { AppBar, Toolbar, Typography } from "@mui/material";
import SearchConstants from "components/search/constants";
import AppSearchDrawer from "../../src/components/search/detailed/AppSearchDrawer";

function GlobalSearchFieldTest() {
    mockAxios.onPost(/\/api\/filesystem\/search.*/).reply(200, dataSearchResp);
    mockAxios.onGet(/\/api\/apps.*/).reply(200, appsSearchResp);
    mockAxios.onGet(/\/api\/analyses.*/).reply(200, analysesSearchResp);
    mockAxios.onGet(/\/api\/teams*/).reply(200, teamList);

    const [appSearchDrawerQuery, setAppSearchDrawerQuery] = useState(false);

    const globalOnShowDetailedSearch = (query) => {
        console.log("Go to Search page with settings", query);
    };
    const onConfirmSelectedApps = (apps) => {
        setAppSearchDrawerQuery(null);
        console.log("Selected apps:", apps);
    };
    const appOnShowDetailedSearch = (query) => {
        setAppSearchDrawerQuery(query);
    };
    const validateAppSelection = (apps) => {
        return apps.length === 1 && apps[0].name === "DE Word Count"
            ? false
            : "Only DE Word Count is acceptable";
    };

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
                    onOptionSelected={(resource) =>
                        console.log("Selected app", resource)
                    }
                />
            </Toolbar>
            <AppSearchDrawer
                open={!!appSearchDrawerQuery}
                onConfirm={onConfirmSelectedApps}
                onClose={() => setAppSearchDrawerQuery(null)}
                searchTerm={appSearchDrawerQuery?.searchTerm || ""}
                validateSelection={validateAppSelection}
            />

            <Typography>Data Only Search</Typography>
            <Toolbar>
                <GlobalSearchField
                    singleSearchOption={true}
                    selectedFilter={SearchConstants.DATA}
                    onShowDetailedSearch={globalOnShowDetailedSearch}
                />
            </Toolbar>
        </AppBar>
    );
}

export default { title: "Search / Global" };

export const SearchField = () => <GlobalSearchFieldTest />;
