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
    const teamName = "ipcdev:team1";

    mockAxios
        .onGet(`/api/teams/${encodeURIComponent(teamName)}/privileges`)
        .reply(200, privilegeList(false));
    mockAxios
        .onGet(`/api/teams/${encodeURIComponent(teamName)}/members`)
        .reply(200, memberList);
    mockAxios
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/leave`)
        .replyOnce(200, { results: [{ success: false }] })
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/leave`)
        .reply(200, { results: [{ success: true }] });
    mockAxios
        .onGet(`/api/teams/${encodeURIComponent(teamName)}`)
        .reply(200, teamMock(teamName));

    return (
        <TeamForm
            parentId="form"
            teamName={teamName}
            goBackToTeamView={() => console.log("Redirect back to /teams")}
        />
    );
};

export const EditFormAdmin = ({ newTeam }) => {
    const teamName = "ipcdev:team2";
    const updatedTeamName = "ipcdev:UpdatedTeam";

    mockAxios.onGet(/\/api\/subjects.*/).reply(200, {
        subjects: [
            ...Object.values(userInfoResp),
            { id: "test_user", email: "test@test.com", name: "Testy Test" },
        ],
    });
    mockAxios
        .onGet(`/api/teams/${encodeURIComponent(teamName)}/privileges`)
        .reply(200, privilegeList(false, Privilege.ADMIN.value));
    mockAxios
        .onGet(`/api/teams/${encodeURIComponent(teamName)}/members`)
        .reply(200, memberList);

    mockAxios
        .onGet(`/api/teams/${encodeURIComponent(teamName)}`)
        .reply(200, teamMock(teamName));
    mockAxios
        .onPost(`/api/teams`)
        .replyOnce(500, {
            error_code: "ERR_NO_CREATION",
            reason: "No team for you",
        })
        .onPost(`/api/teams`)
        .reply(200, { name: teamName });

    mockAxios
        .onPatch(`/api/teams/${encodeURIComponent(teamName)}`)
        .replyOnce(500, {
            error_code: "ERR_NO_TEAM_UPDATE",
            reason: "Change is bad",
        })
        .onPatch(`/api/teams/${encodeURIComponent(teamName)}`)
        .reply(200, { name: updatedTeamName });

    mockAxios
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/privileges`)
        .replyOnce(500, {
            error_code: "ERR_FAILED_PRIVILEGE",
            reason: "Check your privilege",
        })
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/privileges`)
        .reply(200);

    mockAxios
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/members`)
        .reply(200);
    mockAxios
        .onPost(`/api/teams/${encodeURIComponent(teamName)}/members/deleter`)
        .reply(200);

    mockAxios.onDelete(`/api/teams/${encodeURIComponent(teamName)}`).reply(200);

    return (
        <TeamForm
            parentId="form"
            teamName={newTeam ? null : teamName}
            goBackToTeamView={() => console.log("Redirect back to /teams")}
        />
    );
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
