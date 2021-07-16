import Privilege from "../models/Privilege";
import { groupBy } from "common/functions";
import NavigationConstants from "common/NavigationConstants";
import { getIn } from "formik";

/**
 * @typedef {object} Privilege
 * @property {string} name - the privilege value (i.e. read, view, admin, etc.)
 * @property {Subject} subject - a user
 */

/**
 * @typedef {{string, Privilege}} PrivilegeMap - privileges grouped by subject ID
 */

export const DEFAULT_MEMBER_PRIVILEGE = Privilege.READ.value;
export const PUBLIC_TEAM_PRIVILEGE = Privilege.VIEW.value;
const RESTRICTED_GROUP_NAME_CHARS = ":_";

export const getTeamLinkRefs = (teamName) => {
    return [
        `${NavigationConstants.TEAMS}/${encodeURIComponent(teamName)}`,
        `${NavigationConstants.TEAMS}/${encodeURIComponent(teamName)}`,
    ];
};

export const groupShortName = (groupName) => {
    return groupName?.split(":").pop();
};

export const privilegeHasRead = (privilege) => {
    return privilegeLevel(privilege) >= Privilege.READ.level;
};

export const privilegeIsAdmin = (privilege) => {
    return privilegeLevel(privilege) === Privilege.ADMIN.level;
};

const getPrivilegeSubjectId = (privilege) => {
    return privilege.subject.id;
};

export const userIsMember = (userId, privileges) => {
    return !!privileges.find(
        (privilege) => getPrivilegeSubjectId(privilege) === userId
    );
};

export function validateGroupName(value, t) {
    if (!value || value.length < 1) {
        return t("emptyTeamName");
    }

    const restrictedRegex = new RegExp(
        "[" + RESTRICTED_GROUP_NAME_CHARS + "]",
        "g"
    );
    const invalid = value.match(restrictedRegex);
    if (invalid) {
        return t("invalidTeamName", {
            invalidCharList: RESTRICTED_GROUP_NAME_CHARS,
            invalidChars: invalid.join(""),
        });
    }
}

function privilegeLevel(privilege) {
    return privilege ? Privilege[privilege.name.toUpperCase()].level : 0;
}

function getDefaultPrivilege(privilege) {
    return { ...privilege, name: DEFAULT_MEMBER_PRIVILEGE };
}

/**
 * It's possible via the API to assign multiple privileges to the same person, however,
 * it's only logical to have one permission as they mostly buildID on top of each
 * other.
 *
 * For Sonora, we have simplified privileges to only ADMIN or READ for members,
 * VIEW for public privileges or nothing if the team is private.
 *
 * The grouper admin's privilege is removed so users don't try to modify it.
 *
 * @param {Privilege[]} privileges - privileges returned from the
 * GET /team/:name/privileges endpoint
 * @param {string} GrouperAllUsersId - Grouper ID for all users
 * @param {string} GrouperAdminId - Grouper Admin ID
 * @return {PrivilegeMap} - map where keys are subject IDs, values are the privilege
 * for that subject
 */
function simplifyPrivileges(privileges, GrouperAllUsersId, GrouperAdminId) {
    return privileges.reduce((acc, privilege) => {
        const subjectId = getPrivilegeSubjectId(privilege);
        if (subjectId === GrouperAdminId) {
            return acc;
        }

        const currentPriv = acc[subjectId] || getDefaultPrivilege(privilege);

        return {
            ...acc,
            [subjectId]:
                subjectId === GrouperAllUsersId
                    ? { ...privilege, name: Privilege.VIEW.value }
                    : privilegeLevel(currentPriv) > privilegeLevel(privilege)
                    ? currentPriv
                    : privilege,
        };
    }, {});
}

/**
 * It's possible via the API to add a member who has no privileges.
 * The API also returns the most succinct list of privileges - e.g. if public
 * privileges are set to VIEW and a member also has VIEW, that member will
 * not be returned from the GET /team/[teamName]/privileges endpoint because
 * it's already implied by the public privilege.
 *
 * For sonora, members will by default have READ unless they have ADMIN
 *
 * @param {PrivilegeMap} privilegeMap - map where keys are subject IDs, values
 * are the privilege for that subject
 * @param {Subject[]} members - array of subjects who are members to a team
 * @return {PrivilegeMap} - new privilege map where excluded members are now
 * added to the map
 */
function addMembersToPrivileges(privilegeMap, members) {
    members &&
        members.forEach((member) => {
            const subjectId = member.id;
            if (!privilegeMap[subjectId]) {
                privilegeMap[subjectId] = {
                    name: DEFAULT_MEMBER_PRIVILEGE,
                    subject: { ...member },
                };
            }
        });

    return privilegeMap;
}

/**
 * Takes the results from fetching a team's privileges and members and
 * combines them into a map where each user only has one privilege.
 *
 * For Sonora, we have simplified privileges to only ADMIN or READ for members,
 * VIEW for public privileges or nothing if the team is private.
 *
 * @param {Privilege[]} privileges - list of privileges from GET /teams/:name/privileges
 * @param {Subject[]} members - list of members from GET /teams/:name/members
 * @param {string} GrouperAllUsersId - Grouper ID for all users
 * @param {string} GrouperAdminId - Grouper Admin ID
 * @return {PrivilegeMap} - map where keys are subject IDs, values are the privilege
 * for that subject
 */
export function getAllPrivileges(
    privileges,
    members,
    GrouperAllUsersId,
    GrouperAdminId
) {
    const privilegeMap = simplifyPrivileges(
        privileges,
        GrouperAllUsersId,
        GrouperAdminId
    );
    return addMembersToPrivileges(privilegeMap, members);
}

/**
 * Takes the privileges a team had before and after the form is filled out
 * and returns a map containing what privileges (and therefore members)
 * need to be added, what privileges need to be updated, and what privileges
 * (and therefore members) need to be removed.
 *
 * @param {Privilege[]} original - privileges for a team before edits
 * @param {Privilege[]} updates - privileges for a team after edits
 * @return {{add: Privilege[], update: Privilege[], remove: string[]}}
 */
export function getPrivilegeUpdates(original, updates) {
    const originalMap = groupBy(original, getPrivilegeSubjectId);
    const originalUserIds = Object.keys(originalMap);

    const updateMap = groupBy(updates, getPrivilegeSubjectId);
    const updateUserIds = Object.keys(updateMap);

    //delete - user IDs in original that are not in updates
    const deletedUserIds = originalUserIds.filter(
        (userId) => !updateUserIds.includes(userId)
    );

    //add - privileges not in original that are in updates
    const addedPrivileges = updateUserIds.reduce((acc, userId) => {
        return !originalUserIds.includes(userId)
            ? [...acc, ...updateMap[userId]]
            : acc;
    }, []);

    //update - privileges whose value has changed
    const updatedPrivileges = originalUserIds.reduce((acc, userId) => {
        return !updateMap[userId]
            ? acc
            : getIn(originalMap, `${userId}.0.name`) ===
              getIn(updateMap, `${userId}.0.name`)
            ? acc
            : [...acc, ...updateMap[userId]];
    }, []);

    return {
        remove: deletedUserIds,
        add: addedPrivileges,
        update: updatedPrivileges,
    };
}
