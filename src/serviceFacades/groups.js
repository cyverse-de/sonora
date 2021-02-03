/**
 * @author aramsey
 */
import callApi from "../common/callApi";
import {
    getPrivilegeUpdates,
    PUBLIC_TEAM_PRIVILEGE,
} from "../components/teams/util";

const MY_TEAMS_QUERY = "fetchMyTeams";
const ALL_TEAMS_QUERY = "fetchAllTeams";
const SEARCH_TEAMS_QUERY = "searchAllTeams";
const TEAM_PRIVILEGES_QUERY = "fetchTeamPrivileges";
const TEAM_MEMBERS_QUERY = "fetchTeamMembers";
const TEAM_DETAILS_QUERY = "fetchTeamDetails";

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
        endpoint: `/api/teams/${encodeURIComponent(name)}/privileges`,
        method: "GET",
    });
}

function getTeamMembers(key, { name }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/members`,
        method: "GET",
    });
}

function getTeamDetails(key, { name }) {
    return Promise.all([
        getTeamPrivileges(TEAM_PRIVILEGES_QUERY, { name }),
        getTeamMembers(TEAM_MEMBERS_QUERY, { name }),
    ]);
}

function createTeam({ name, description, isPublicTeam }) {
    return callApi({
        endpoint: "/api/teams",
        method: "POST",
        body: {
            name,
            description,
            public_privileges: isPublicTeam ? [PUBLIC_TEAM_PRIVILEGE] : null,
        },
    });
}

function updateTeam({ originalName, name, description }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(originalName)}`,
        method: "PATCH",
        body: {
            name,
            description,
        },
    });
}

function deleteTeam({ name }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}`,
        method: "DELETE",
    });
}

function addTeamMembers({ name, members }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/members`,
        method: "POST",
        body: {
            members,
        },
    });
}

function removeTeamMembers({ name, members }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/members/deleter`,
        method: "POST",
        body: {
            members,
        },
    });
}

function updateTeamPrivileges({ name, updates }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/privileges`,
        method: "POST",
        body: {
            updates,
        },
    });
}

function createPrivilegeUpdates(privilegeList) {
    return privilegeList.map((privilege) => {
        return {
            subject_id: privilege.subject.id,
            privileges: [privilege.name],
        };
    });
}

function updateTeamMemberStats({
    name,
    oldPrivileges,
    newPrivileges,
    isPublicTeam,
    wasPublicTeam,
}) {
    const { remove, add, update } = getPrivilegeUpdates(
        oldPrivileges,
        newPrivileges
    );

    const promises = [];

    if (remove?.length > 0) {
        promises.push(removeTeamMembers({ name, members: remove }));
        const updates = remove.map((userId) => {
            return {
                subject_id: userId,
                privileges: [],
            };
        });
        promises.push(updateTeamPrivileges({ name, updates }));
    }

    if (add?.length > 0) {
        const userIds = Object.values(add).map(
            (privilege) => privilege.subject.id
        );
        promises.push(addTeamMembers({ name, members: userIds }));
        const updates = createPrivilegeUpdates(Object.values(add));
        promises.push(updateTeamPrivileges({ name, updates }));
    }

    if (update?.length > 0) {
        const updates = createPrivilegeUpdates(Object.values(update));
        promises.push(updateTeamPrivileges({ name, updates }));
    }

    if (isPublicTeam !== wasPublicTeam) {
        promises.push(
            updateTeamPrivileges({
                name,
                updates: [
                    {
                        subject_id: "GrouperAll",
                        privileges: isPublicTeam ? [PUBLIC_TEAM_PRIVILEGE] : [],
                    },
                ],
            })
        );
    }

    return Promise.all(promises);
}

export {
    MY_TEAMS_QUERY,
    ALL_TEAMS_QUERY,
    SEARCH_TEAMS_QUERY,
    TEAM_DETAILS_QUERY,
    getMyTeams,
    getAllTeams,
    searchTeams,
    getTeamDetails,
    createTeam,
    updateTeam,
    deleteTeam,
    updateTeamMemberStats,
};
