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
const LIST_SINGLE_TEAM_QUERY = "fetchSingleTeam";

// Checks if a grouper member update response returned 200, but with `success`
// set to false on any of the updates
function responseHasFailures(response) {
    const hasFailures = response?.results?.filter((result) => !result.success);
    return hasFailures?.length > 0;
}

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

function listSingleTeam(key, { name }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}`,
        method: "GET",
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
        listSingleTeam(LIST_SINGLE_TEAM_QUERY, { name }),
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

function leaveTeam({ name }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/leave`,
        method: "POST",
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to leave team");
        } else {
            return resp;
        }
    });
}

function addTeamMembers({ name, members }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/members`,
        method: "POST",
        body: {
            members,
        },
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to add a team member");
        } else {
            return resp;
        }
    });
}

function removeTeamMembers({ name, members }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/members/deleter`,
        method: "POST",
        body: {
            members,
        },
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to remove a team member");
        } else {
            return resp;
        }
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
    selfId,
    GrouperAllUsersId,
}) {
    const { remove, add, update } = getPrivilegeUpdates(
        oldPrivileges,
        newPrivileges
    );

    const memberPromises = [];
    const privilegeUpdates = [];

    if (update?.length > 0) {
        const updates = createPrivilegeUpdates(update);
        privilegeUpdates.push(...updates);
    }

    if (remove?.length > 0) {
        const updates = remove.map((userId) => {
            return {
                subject_id: userId,
                privileges: [],
            };
        });
        privilegeUpdates.push(...updates);
        memberPromises.push(() => removeTeamMembers({ name, members: remove }));
    }

    if (add?.length > 0) {
        // the create team form automatically adds the current user as an admin
        // don't include this in the request
        const noSelfUpdates = add.filter(
            (privilege) => privilege.subject.id !== selfId
        );
        const updates = createPrivilegeUpdates(noSelfUpdates);
        privilegeUpdates.push(...updates);

        const userIds = add.map((privilege) => privilege.subject.id);
        memberPromises.push(() => addTeamMembers({ name, members: userIds }));
    }

    if (isPublicTeam !== wasPublicTeam) {
        privilegeUpdates.push({
            subject_id: GrouperAllUsersId,
            privileges: isPublicTeam ? [PUBLIC_TEAM_PRIVILEGE] : [],
        });
    }

    // Run the privilege updates first, then all of the member updates
    // Privilege updates cannot run in parallel with member updates
    return updateTeamPrivileges({ name, updates: privilegeUpdates }).then(
        (privilegeResult) => {
            return Promise.all(memberPromises.map((promise) => promise())).then(
                (memberResults) => {
                    return [privilegeResult, memberResults];
                }
            );
        }
    );
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
    leaveTeam,
    updateTeamMemberStats,
};
