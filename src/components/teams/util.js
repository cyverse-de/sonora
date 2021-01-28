import Privilege from "../models/Privilege";
import { groupBy } from "../../common/functions";
import { getIn } from "formik";

export const DEFAULT_MEMBER_PRIVILEGE = Privilege.READ.value;
export const PUBLIC_TEAM_PRIVILEGE = Privilege.VIEW.value;

export const privilegeHasRead = (privilege) => {
    return privilegeNum(privilege) >= Privilege.READ.num;
};

export const privilegeIsAdmin = (privilege) => {
    return privilegeNum(privilege) === Privilege.ADMIN.num;
};

const restrictedGroupNameChars = ":_";

export function validateGroupName(value, t) {
    if (!value || value.length < 1) {
        return "Empty value";
    }

    const restrictedRegex = new RegExp(
        "[" + restrictedGroupNameChars + "]",
        "g"
    );
    const invalid = value.match(restrictedRegex);
    if (invalid) {
        return t("invalidTeamName", {
            invalidCharList: restrictedGroupNameChars,
            invalidChars: invalid.join(""),
        });
    }
}

function privilegeNum(privilege) {
    return privilege ? Privilege[privilege.name.toUpperCase()].num : 0;
}

function getDefaultPrivilege(privilege) {
    return { ...privilege, name: DEFAULT_MEMBER_PRIVILEGE };
}

/**
 * It's possible via the API to assign multiple privileges to the same person, however,
 * it's only logical to have one permission as they mostly build on top of each
 * other.
 *
 * For Sonora, we have simplified privileges to only ADMIN or READ for members,
 * VIEW for public privileges or nothing if the team is private.
 *
 * The grouper admin privilege is removed so users don't try to modify it.
 *
 * @param privileges - an array of privilege objects expected to have a name key with a
 * value from {@link Privilege}, as well as a subject key with
 * a value containing a subject object
 */
function simplifyPrivileges(privileges) {
    return privileges.reduce((acc, privilege) => {
        const subjectId = privilege.subject.id;
        if (subjectId === "de_grouper") {
            return acc;
        }

        const currentPriv = acc[subjectId] || getDefaultPrivilege(privilege);

        return {
            ...acc,
            [subjectId]:
                subjectId === "GrouperAll"
                    ? { ...privilege, name: Privilege.VIEW.value }
                    : privilegeNum(currentPriv) > privilegeNum(privilege)
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
 * @param privilegeMap
 * @param members
 * @return
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

export function getAllPrivileges(privileges, members) {
    const privilegeMap = simplifyPrivileges(privileges);
    return addMembersToPrivileges(privilegeMap, members);
}

const getPrivilegeSubjectId = (privilege) => {
    return privilege.subject.id;
};

export function getPrivilegeUpdates(original, updates) {
    const originalMap = groupBy(original, getPrivilegeSubjectId);
    const originalUsers = Object.keys(originalMap);

    const updateMap = groupBy(updates, getPrivilegeSubjectId);
    const updateUsers = Object.keys(updateMap);

    const deletedUserIds = originalUsers.filter(
        (userId) => !updateUsers.includes(userId)
    );
    const addedPrivileges = updateUsers.reduce((acc, userId) => {
        return !originalUsers.includes(userId)
            ? [...acc, ...updateMap[userId]]
            : acc;
    }, []);

    const updatedPrivileges = originalUsers.reduce((acc, userId) => {
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
