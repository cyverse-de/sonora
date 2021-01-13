/**
 * @author aramsey
 */
import callApi from "../common/callApi";

const MY_TEAMS_QUERY = "fetchMyTeams";
const ALL_TEAMS_QUERY = "fetchAllTeams";
const SEARCH_TEAMS_QUERY = "searchAllTeams";
const TEAM_PRIVILEGES_QUERY = "fetchTeamPrivileges";
const TEAM_MEMBERS_QUERY = "fetchTeamMembers";

function getMyTeams(key, { userId }) {
    return callApi({
        endpoint: "/api/teams",
        method: "GET",
        params: {
            member: userId,
            details: true,
        },
    });
}

function getAllTeams(key) {
    return callApi({
        endpoint: "/api/teams",
        method: "GET",
        params: {
            details: true,
        },
    });
}

function searchTeams(key, { searchTerm }) {
    return callApi({
        endpoint: "/api/teams",
        method: "GET",
        params: {
            search: searchTerm,
            details: true,
        },
    });
}

function getTeamPrivileges(key, { name }) {
    return callApi({
        endpoint: `/api/teams/${name}/privileges`,
        method: "GET",
    });
}

function getTeamMembers(key, { name }) {
    return callApi({
        endpoint: `/api/teams/${name}/members`,
        method: "GET",
    });
}

export {
    MY_TEAMS_QUERY,
    ALL_TEAMS_QUERY,
    SEARCH_TEAMS_QUERY,
    getMyTeams,
    getAllTeams,
    searchTeams,
};
