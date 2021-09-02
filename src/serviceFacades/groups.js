/**
 * @author aramsey
 */
import callApi from "../common/callApi";
import {
    getPrivilegeUpdates,
    PUBLIC_TEAM_PRIVILEGE,
} from "../components/teams/util";
import { getUserInfo } from "./users";

const MY_TEAMS_QUERY = "fetchMyTeams";
const ALL_TEAMS_QUERY = "fetchAllTeams";
const SEARCH_TEAMS_QUERY = "searchAllTeams";
const TEAM_DETAILS_QUERY = "fetchTeamDetails";

const RECENT_CONTACTS_QUERY = "fetchRecentContactsList";
const RECENT_CONTACTS_LIST_NAME = "default"; // `default` collaborator list

const MY_COMMUNITIES_QUERY = "fetchMyCommunities";
const ALL_COMMUNITIES_QUERY = "fetchAllCommunities";
const COMMUNITY_DETAILS_QUERY = "fetchCommunityDetails";

// Checks if a grouper member update response returned 200, but with `success`
// set to false on any of the updates
function responseHasFailures(response) {
    const hasFailures = response?.results?.filter((result) => !result.success);
    return hasFailures?.length > 0;
}

function getMyTeams({ userId }) {
    return callApi({
        endpoint: "/api/teams",
        method: "GET",
        params: {
            member: userId,
            details: true,
        },
    });
}

function getAllTeams() {
    return callApi({
        endpoint: "/api/teams",
        method: "GET",
        params: {
            details: true,
        },
    });
}

function searchTeams({ searchTerm }) {
    return callApi({
        endpoint: "/api/teams",
        method: "GET",
        params: {
            search: searchTerm,
            details: true,
        },
    });
}

function listSingleTeam({ name }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}`,
        method: "GET",
    });
}

function getTeamPrivileges({ name }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/privileges`,
        method: "GET",
    });
}

function getTeamMembers({ name }) {
    return callApi({
        endpoint: `/api/teams/${encodeURIComponent(name)}/members`,
        method: "GET",
    });
}

function getTeamDetails({ name }) {
    return Promise.all([
        listSingleTeam({ name }),
        getTeamPrivileges({ name }),
        getTeamMembers({ name }),
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
        return getUserInfo({ userIds });
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

function getMyCollections({ userId }) {
    return callApi({
        endpoint: "/api/communities",
        method: "GET",
        params: {
            member: userId,
        },
    });
}

<<<<<<< HEAD
function getAllCollections(key) {
=======
function getAllCommunities() {
>>>>>>> 1fff9106 (Update react-query syntax for communities.)
    return callApi({
        endpoint: "/api/communities",
        method: "GET",
    });
}

<<<<<<< HEAD
function getCollectionInfo(key, { name }) {
=======
function getCommunityInfo({ name }) {
>>>>>>> 1fff9106 (Update react-query syntax for communities.)
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}`,
        method: "GET",
    });
}

<<<<<<< HEAD
function getCollectionAdmins(key, { name }) {
=======
function getCommunityAdmins({ name }) {
>>>>>>> 1fff9106 (Update react-query syntax for communities.)
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
        return getUserInfo({ userIds });
    });
}

<<<<<<< HEAD
function getCollectionFollowers(key, { name }) {
=======
function getCommunityFollowers({ name }) {
>>>>>>> 1fff9106 (Update react-query syntax for communities.)
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}/members`,
        method: "GET",
    });
}

<<<<<<< HEAD
function getCollectionApps({ name, sortField, sortDir, appFilter }) {
=======
function getCommunityApps({ name, sortField, sortDir, appFilter }) {
>>>>>>> 1fff9106 (Update react-query syntax for communities.)
    const params = {
        "sort-field": sortField || "name",
        "sort-dir": sortDir?.toUpperCase() || "ASC",
    };
    if (appFilter) {
        params["app-type"] = appFilter.value;
    }

    return callApi({
        endpoint: `/api/apps/communities/${encodeURIComponent(name)}/apps`,
        method: "GET",
        params,
    });
}

<<<<<<< HEAD
function getCollectionDetails(
    key,
    { name, fullName, userId, sortField, sortDir, appFilter }
) {
    return Promise.all([
        getCollectionInfo(COLLECTION_INFO_QUERY, { name }),
        getCollectionAdmins(COLLECTION_ADMINS_QUERY, { name }),
        getCollectionFollowers(COLLECTION_FOLLOWERS_QUERY, { name }),
        getCollectionApps(COLLECTION_APPS_QUERY, {
=======
function getCommunityDetails({
    name,
    fullName,
    userId,
    sortField,
    sortDir,
    appFilter,
}) {
    return Promise.all([
        getCommunityInfo({ name }),
        getCommunityAdmins({ name }),
        getCommunityFollowers({ name }),
        getCommunityApps({
>>>>>>> 1fff9106 (Update react-query syntax for communities.)
            name: fullName,
            sortField,
            sortDir,
            appFilter,
        }),
    ]).then((resp) => {
        if (resp) {
            const collection = resp[0];

            const adminObj = resp[1];
            const admins = Object.values(adminObj);
            const isAdmin = !!adminObj[userId];

            const followers = resp[2];
            const isFollower = !!followers?.members?.find(
                (member) => member.id === userId
            );

            const apps = resp[3];
            return { collection, isAdmin, admins, isFollower, apps };
        }
    });
}

function followCollection({ collectionName }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(collectionName)}/join`,
        method: "POST",
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to follow collection");
        } else {
            return resp;
        }
    });
}

function unfollowCollection({ collectionName }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(
            collectionName
        )}/leave`,
        method: "POST",
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to unfollow collection");
        } else {
            return resp;
        }
    });
}

function deleteCollection({ collectionName }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(collectionName)}`,
        method: "DELETE",
    });
}

function createCollection({ name, description }) {
    return callApi({
        endpoint: "/api/communities",
        method: "POST",
        body: {
            name,
            description,
        },
    });
}

function updateCollectionNameDesc({
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

function addCollectionAdmins({ name, adminIds }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}/admins`,
        method: "POST",
        body: {
            members: adminIds,
        },
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to add a collection admin");
        } else {
            return resp;
        }
    });
}

function removeCollectionAdmins({ name, adminIds }) {
    return callApi({
        endpoint: `/api/communities/${encodeURIComponent(name)}/admins/deleter`,
        method: "POST",
        body: {
            members: adminIds,
        },
    }).then((resp) => {
        const hasFailures = responseHasFailures(resp);
        if (hasFailures) {
            throw new Error("Failed to remove a collection admin");
        } else {
            return resp;
        }
    });
}

function addAppToCollection({ avu, appId }) {
    return callApi({
        endpoint: `/api/apps/${appId}/communities`,
        method: "POST",
        body: {
            avus: [avu],
        },
    });
}

function addAppsToCollection({ name, apps, attr }) {
    const avu = {
        attr,
        value: name,
        unit: "",
    };

    return Promise.all(apps.map((appId) => addAppToCollection({ avu, appId })));
}

function removeAppFromCollection({ avu, appId }) {
    return callApi({
        endpoint: `/api/apps/${appId}/communities`,
        method: "DELETE",
        body: {
            avus: [avu],
        },
    });
}

function removeAppsFromCollection({ name, apps, attr }) {
    const avu = {
        attr,
        value: name,
        unit: "",
    };

    return Promise.all(
        apps.map((appId) => removeAppFromCollection({ avu, appId }))
    );
}

function updateCollectionDetails({
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
        promises.push(addCollectionAdmins({ name, adminIds: addAdminIds }));
    }
    if (removeAdminIds.length > 0) {
        promises.push(
            removeCollectionAdmins({ name, adminIds: removeAdminIds })
        );
    }
    if (addAppIds.length > 0) {
        promises.push(
            addAppsToCollection({ name: fullName, apps: addAppIds, attr })
        );
    }
    if (removeAppIds.length > 0) {
        promises.push(
            removeAppsFromCollection({
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
    MY_COLLECTIONS_QUERY,
    ALL_COLLECTIONS_QUERY,
    COLLECTION_DETAILS_QUERY,
    COLLECTION_APPS_QUERY,
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
    getMyCollections,
    getAllCollections,
    getCollectionDetails,
    followCollection,
    unfollowCollection,
    deleteCollection,
    createCollection,
    updateCollectionNameDesc,
    addCollectionAdmins,
    removeCollectionAdmins,
    updateCollectionDetails,
    getCollectionApps,
};
