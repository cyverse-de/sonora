/**
 * @author aramsey
 */
import callApi from "../common/callApi";
import {
    getPrivilegeUpdates,
    PUBLIC_TEAM_PRIVILEGE,
} from "../components/teams/util";
import { getUserInfo } from "./users";
import { USER_INFO_QUERY_KEY } from "./filesystem";

const MY_TEAMS_QUERY = "fetchMyTeams";
const ALL_TEAMS_QUERY = "fetchAllTeams";
const SEARCH_TEAMS_QUERY = "searchAllTeams";
const TEAM_PRIVILEGES_QUERY = "fetchTeamPrivileges";
const TEAM_MEMBERS_QUERY = "fetchTeamMembers";
const TEAM_DETAILS_QUERY = "fetchTeamDetails";
const LIST_SINGLE_TEAM_QUERY = "fetchSingleTeam";

const RECENT_CONTACTS_QUERY = "fetchRecentContactsList";
const RECENT_CONTACTS_LIST_NAME = "default"; // `default` collaborator list

const MY_COMMUNITIES_QUERY = "fetchMyCommunities";
const ALL_COMMUNITIES_QUERY = "fetchAllCommunities";
const COMMUNITY_INFO_QUERY = "fetchCommunityInfo";
const COMMUNITY_ADMINS_QUERY = "fetchCommunityAdmins";
const COMMUNITY_FOLLOWERS_QUERY = "fetchCommunityFollowers";
const COMMUNITY_APPS_QUERY = "fetchCommunityApps";
const COMMUNITY_DETAILS_QUERY = "fetchCommunityDetails";

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

function requestJoinTeam({ name, message }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/join-request`,
        method: "POST",
        body: {
            message,
        },
    });
}

function denyRequestJoinTeam({ teamName, requesterId, message }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(
            teamName
        )}/join-request/${requesterId}/deny`,
        method: "POST",
        body: {
            message,
        },
    });
}

function approveRequestJoinTeam({ teamName, requesterId, privilege }) {
    const privilegeUpdate = {
        subject_id: requesterId,
        privileges: [privilege],
    };

    return updateTeamPrivileges({
        name: teamName,
        updates: [privilegeUpdate],
    }).then((privilegeResult) => {
        return addTeamMembers({
            name: teamName,
            members: [requesterId],
        }).then((memberResults) => {
            return [privilegeResult, memberResults];
        });
    });
}

function fetchRecentContactsList() {
    /**
     * The members endpoint only returns the user ID and source_id.  We'll take
     * this response and ask the user-info endpoint to give us more detailed
     * info
     */
    return callApi({
        endpoint: `/api/collaborator-lists/${RECENT_CONTACTS_LIST_NAME}/members`,
    }).then((resp) => {
        const userIds = resp?.members?.map((member) => member.id);
        return getUserInfo(USER_INFO_QUERY_KEY, { userIds });
    });
}

function addRecentContacts({ members }) {
    return callApi({
        endpoint: `/api/collaborator-lists/${encodeURIComponent(
            RECENT_CONTACTS_LIST_NAME
        )}/members`,
        method: "POST",
        body: {
            members,
        },
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to add a recent contact");
        } else {
            return resp;
        }
    });
}

function removeRecentContacts({ members }) {
    return callApi({
        endpoint: `/api/collaborator-lists/${encodeURIComponent(
            RECENT_CONTACTS_LIST_NAME
        )}/members/deleter`,
        method: "POST",
        body: {
            members,
        },
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to remove a recent contact");
        } else {
            return resp;
        }
    });
}

function getMyCommunities(key, { userId }) {
    return callApi({
        endpoint: "/api/communities",
        method: "GET",
        params: {
            member: userId,
        },
    });
}

function getAllCommunities(key) {
    return callApi({
        endpoint: "/api/communities",
        method: "GET",
    });
}

function getCommunityInfo(key, { name }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}`,
        method: "GET",
    });
}

function getCommunityAdmins(key, { name }) {
    /**
     * The members endpoint only returns the user ID and source_id.  We'll take
     * this response and ask the user-info endpoint to give us more detailed
     * info
     */
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}/admins`,
        method: "GET",
    }).then((resp) => {
        const userIds = resp?.members?.map((member) => member.id);
        return getUserInfo(USER_INFO_QUERY_KEY, { userIds });
    });
}

function getCommunityFollowers(key, { name }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}/members`,
        method: "GET",
    });
}

function getCommunityApps(key, { name, sortField, sortDir, appFilter }) {
    const params = {
        "sort-field": sortField || "name",
        "sort-dir": sortDir?.toUpperCase() || "ASC",
    };
    if (appFilter) {
        params["app-type"] = appFilter;
    }

    return callApi({
        endpoint: `/api/apps/communities/${encodeURIComponent(name)}/apps`,
        method: "GET",
        params,
    });
}

function getCommunityDetails(
    key,
    { name, fullName, userId, sortField, sortDir, appFilter }
) {
    return Promise.all([
        getCommunityInfo(COMMUNITY_INFO_QUERY, { name }),
        getCommunityAdmins(COMMUNITY_ADMINS_QUERY, { name }),
        getCommunityFollowers(COMMUNITY_FOLLOWERS_QUERY, { name }),
        getCommunityApps(COMMUNITY_APPS_QUERY, {
            name: fullName,
            sortField,
            sortDir,
            appFilter,
        }),
    ]).then((resp) => {
        if (resp) {
            const community = resp[0];

            const adminObj = resp[1];
            const admins = Object.values(adminObj);
            const isAdmin = !!adminObj[userId];

            const followers = resp[2];
            const isFollower = !!followers?.members?.find(
                (member) => member.id === userId
            );

            const apps = resp[3];
            return { community, isAdmin, admins, isFollower, apps };
        }
    });
}

function followCommunity({ communityName }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(communityName)}/join`,
        method: "POST",
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to follow community");
        } else {
            return resp;
        }
    });
}

function unfollowCommunity({ communityName }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(communityName)}/leave`,
        method: "POST",
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to unfollow community");
        } else {
            return resp;
        }
    });
}

function deleteCommunity({ communityName }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(communityName)}`,
        method: "DELETE",
    });
}

function createCommunity({ name, description }) {
    return callApi({
        endpoint: "/api/communities",
        method: "POST",
        body: {
            name,
            description,
        },
    });
}

function updateCommunityNameDesc({
    originalName,
    name,
    description,
    retagApps,
}) {
    const params = {
        "retag-apps": retagApps,
    };
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(originalName)}`,
        method: "PATCH",
        params,
        body: {
            name,
            description,
        },
    });
}

function addCommunityAdmins({ name, adminIds }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}/admins`,
        method: "POST",
        body: {
            members: adminIds,
        },
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to add a community admin");
        } else {
            return resp;
        }
    });
}

function removeCommunityAdmins({ name, adminIds }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}/admins/deleter`,
        method: "POST",
        body: {
            members: adminIds,
        },
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to remove a community admin");
        } else {
            return resp;
        }
    });
}

function addAppToCommunity({ avu, appId }) {
    return callApi({
        endpoint: `/api/apps/${appId}/communities`,
        method: "POST",
        body: {
            avus: [avu],
        },
    });
}

function addAppsToCommunity({ name, apps, attr }) {
    const avu = {
        attr,
        value: name,
        unit: "",
    };

    return Promise.all(apps.map((appId) => addAppToCommunity({ avu, appId })));
}

function removeAppFromCommunity({ avu, appId }) {
    return callApi({
        endpoint: `/api/apps/${appId}/communities`,
        method: "DELETE",
        body: {
            avus: [avu],
        },
    });
}

function removeAppsFromCommunity({ name, apps, attr }) {
    const avu = {
        attr,
        value: name,
        unit: "",
    };

    return Promise.all(
        apps.map((appId) => removeAppFromCommunity({ avu, appId }))
    );
}

function updateCommunityDetails({
    name,
    fullName,
    oldAdmins,
    newAdmins,
    oldApps,
    newApps,
    attr,
}) {
    const oldAdminIds = oldAdmins.map((admin) => admin.id);
    const newAdminIds = newAdmins.map((admin) => admin.id);
    const oldAppIds = oldApps.map((app) => app.id);
    const newAppIds = newApps.map((app) => app.id);

    const addAdminIds = newAdminIds.filter(
        (adminId) => !oldAdminIds.includes(adminId)
    );
    const removeAdminIds = oldAdminIds.filter(
        (adminId) => !newAdminIds.includes(adminId)
    );
    const addAppIds = newAppIds.filter((id) => !oldAppIds.includes(id));
    const removeAppIds = oldAppIds.filter((id) => !newAppIds.includes(id));

    let promises = [];

    if (addAdminIds.length > 0) {
        promises.push(addCommunityAdmins({ name, adminIds: addAdminIds }));
    }
    if (removeAdminIds.length > 0) {
        promises.push(
            removeCommunityAdmins({ name, adminIds: removeAdminIds })
        );
    }
    if (addAppIds.length > 0) {
        promises.push(
            addAppsToCommunity({ name: fullName, apps: addAppIds, attr })
        );
    }
    if (removeAppIds.length > 0) {
        promises.push(
            removeAppsFromCommunity({
                name: fullName,
                apps: removeAppIds,
                attr,
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
    RECENT_CONTACTS_QUERY,
    RECENT_CONTACTS_LIST_NAME,
    MY_COMMUNITIES_QUERY,
    ALL_COMMUNITIES_QUERY,
    COMMUNITY_DETAILS_QUERY,
    getMyTeams,
    getAllTeams,
    searchTeams,
    getTeamDetails,
    createTeam,
    updateTeam,
    deleteTeam,
    leaveTeam,
    updateTeamMemberStats,
    requestJoinTeam,
    denyRequestJoinTeam,
    approveRequestJoinTeam,
    fetchRecentContactsList,
    addRecentContacts,
    removeRecentContacts,
    getMyCommunities,
    getAllCommunities,
    getCommunityDetails,
    followCommunity,
    unfollowCommunity,
    deleteCommunity,
    createCommunity,
    updateCommunityNameDesc,
    addCommunityAdmins,
    removeCommunityAdmins,
    updateCommunityDetails,
};
