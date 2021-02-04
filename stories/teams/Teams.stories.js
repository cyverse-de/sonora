import React from "react";
import { mockAxios } from "../axiosMock";

import TeamView from "components/teams";
import TeamListing from "components/teams/Listing";
import { teamList } from "./TeamMocks";

const errorResp = { error_code: "ERR_NOT_TODAY", reason: "No teams today" };

export const View = () => {
    mockAxios.onGet(/\/api\/teams*/).reply(200, teamList);
    return <TeamView baseId="teams" />;
};

export const ViewWithError = () => {
    mockAxios.onGet(/\/api\/teams*/).reply(400, errorResp);
    return <TeamView baseId="teams" />;
};

export const SearchResults = () => {
    mockAxios.onGet(/\/api\/teams*/).reply(200, teamList);
    return (
        <TeamListing
            searchTerm="test"
            updateResultCount={(count) => console.log(`Total Teams: ${count}`)}
        />
    );
};

export const SearchResultsWithError = () => {
    mockAxios.onGet(/\/api\/teams*/).reply(400, errorResp);
    return (
        <TeamListing
            searchTerm="test"
            updateResultCount={(count) => console.log(`Total Teams: ${count}`)}
        />
    );
};

export default {
    title: "Teams",
};
