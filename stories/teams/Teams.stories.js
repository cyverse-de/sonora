import React from "react";
import { mockAxios } from "../axiosMock";

import TeamView from "components/teams";
import TeamListing from "components/teams/Listing";
import TeamForm from "components/teams/form/index";
import { memberList, privilegeList, teamList, teamMock } from "./TeamMocks";
import Privilege from "../../src/components/models/Privilege";
import { userInfoResp } from "../data/DataMocks";

const errorResp = { error_code: "ERR_NOT_TODAY", reason: "No teams today" };

export const View = () => {
    mockAxios.onGet("/api/teams").reply(200, teamList);
    return <TeamView baseId="teams" />;
};

export const ViewWithError = () => {
    mockAxios.onGet("/api/teams").reply(400, errorResp);
    return <TeamView baseId="teams" />;
};

export const SearchResults = () => {
    mockAxios.onGet("/api/teams").reply(200, teamList);
    return (
        <TeamListing
            searchTerm="test"
            updateResultCount={(count) => console.log(`Total Teams: ${count}`)}
        />
    );
};

export const SearchResultsWithError = () => {
    mockAxios.onGet("/api/teams").reply(400, errorResp);
    return (
        <TeamListing
            searchTerm="test"
            updateResultCount={(count) => console.log(`Total Teams: ${count}`)}
        />
    );
};

export const EditFormMember = () => {
    mockAxios.onGet(/\/api\/teams\/.*/).reply(200, teamMock);
    mockAxios
        .onGet(/\/api\/teams\/.*\/privileges/)
        .reply(200, privilegeList(false));
    mockAxios.onGet(/\/api\/teams\/.*\/members/).reply(200, memberList);
    mockAxios.onPost(/\/api\/teams\/.*\/leave/).reply(200);

    return <TeamForm parentId="form" teamName="Test Team" />;
};

export const EditFormAdmin = ({ newTeam }) => {
    mockAxios.onGet(/\/api\/teams\/.*/).reply(200, teamMock);
    mockAxios.onGet(/\/api\/subjects.*/).reply(200, {
        subjects: [
            ...Object.values(userInfoResp),
            { id: "test_user", email: "test@test.com", name: "Testy Test" },
        ],
    });
    mockAxios
        .onGet(/\/api\/teams\/.*\/privileges/)
        .reply(200, privilegeList(false, Privilege.ADMIN.value));
    mockAxios.onGet(/\/api\/teams\/.*\/members/).reply(200, memberList);

    mockAxios.onGet(/\/api\/teams\/.*\/members/).reply(200, memberList);

    mockAxios
        .onPost(/\/api\/teams\/.*/)
        .replyOnce(500, {
            error_code: "ERR_NO_CREATION",
            reason: "No team for you",
        })
        .onPost(/\/api\/teams\/.*/)
        .reply(200, { name: "ipcdev:MuhTeam" });

    mockAxios
        .onPatch(/\/api\/teams\/.*/)
        .replyOnce(500, {
            error_code: "ERR_NO_TEAM_UPDATE",
            reason: "Change is bad",
        })
        .onPatch(/\/api\/teams\/.*/)
        .reply(200, { name: "ipcdev:MuhUpdatedTeam" });

    mockAxios
        .onPost(/\/api\/teams\/.*\/privileges/)
        .replyOnce(500, {
            error_code: "ERR_FAILED_PRIVILEGE",
            reason: "Check your privilege",
        })
        .onPost(/\/api\/teams\/.*\/privileges/)
        .reply(200);

    mockAxios.onPost(/\/api\/teams\/.*\/members/).reply(200);
    mockAxios.onPost(/\/api\/teams\/.*\/members\/deleter/).reply(200);

    mockAxios.onDelete(/\/api\/teams\/*/).reply(200);

    return <TeamForm parentId="form" teamName={newTeam ? null : "Test Team"} />;
};

EditFormAdmin.argTypes = {
    newTeam: {
        control: {
            type: "boolean",
        },
    },
};

export default {
    title: "Teams",
};
