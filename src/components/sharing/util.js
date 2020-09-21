import { SharingPermissions } from "../models/Permissions";

/**
 * Returns a boolean indicating if the given user is a group
 * @param {Subject} user
 * @returns {boolean} True if the user is a group
 */
export const isGroup = (user) => {
    return user.source_id === "g:gsa";
};

/**
 * Returns a group's short name for display
 * @param {Subject} subject
 * @returns {string} The displayable group name
 */
export const groupName = (subject) => {
    return subject.name.split(":").pop();
};

/**
 * Takes a list and returns a new list with only unique, non-empty values
 * @param {any[]} list
 * @returns {any[]}
 */
const getUniqueList = (list) => {
    return [...new Set(list)].filter((item) => !!item);
};

/**
 * Takes a list of permission values {@link SharingPermissions} and returns
 * what to display as the overall permission
 * @param {SharingPermissions[]} permissionList
 * @param {number} resourceTotal
 * @returns {string}
 */
const getDisplayPermission = (permissionList, resourceTotal) => {
    if (permissionList.length !== resourceTotal) {
        return SharingPermissions.VARIES;
    }
    const values = getUniqueList(permissionList);
    return values.length === 1 ? values[0] : SharingPermissions.VARIES;
};

/**
 * These are the keys to each permission-lister response object and correspond
 * to each type of resource that can be shared in Sonora
 */
export const TYPE = {
    DATA: "paths",
    APPS: "apps",
    ANALYSES: "analyses",
    TOOLS: "tools",
};

const allResourceTypes = [TYPE.DATA, TYPE.APPS, TYPE.ANALYSES, TYPE.TOOLS];

/**
 * Takes a permission list response object and returns the TYPE
 * @param {PermissionListResponse} resp
 * @returns {string} One of the types (TYPE)
 */
const getResponseType = (resp) => Object.keys(resp)[0];

/**
 * Helper functions for retrieving information across the different types of
 * permission-lister responses.
 * @param {string} type - one of TYPE
 * @returns {{formatUnsharing: (function(Resource): *), formatSharing: (function(Resource): *), formatSubject: (function(Subject): *), getId: (function(Sharing): *), getPermList: (function(Sharing): *), getUserId: (function(AnySubjectPermission): *)}}
 */
export const getSharingFns = (type) => {
    switch (type) {
        case TYPE.DATA: {
            return {
                getId: (sharing) => sharing.path,
                getPermList: (sharing) => sharing["user-permissions"],
                getUserId: (permission) => permission.user,
                formatSubject: (user) => {
                    return {
                        user: user.id,
                    };
                },
                formatSharing: (resource) => {
                    return {
                        path: resource.path,
                    };
                },
                formatUnsharing: (resource) => resource.path,
            };
        }
        case TYPE.APPS: {
            return {
                getId: (sharing) => sharing.app_id || sharing.id,
                getPermList: (sharing) => sharing.permissions,
                getUserId: (permission) => permission.subject.id,
                formatSubject: (user) => {
                    return {
                        subject: {
                            source_id: user.source_id,
                            id: user.id,
                        },
                    };
                },
                formatSharing: (resource) => {
                    return {
                        app_id: resource.id || resource.app_id,
                        system_id: resource.system_id,
                    };
                },
                formatUnsharing: (resource) => {
                    return {
                        app_id: resource.id || resource.app_id,
                        system_id: resource.system_id,
                    };
                },
            };
        }
        case TYPE.ANALYSES: {
            return {
                getId: (sharing) => sharing.id || sharing.analysis_id,
                getPermList: (sharing) => sharing.permissions,
                getUserId: (permission) => permission.subject.id,
                formatSubject: (user) => {
                    return {
                        subject: {
                            source_id: user.source_id,
                            id: user.id,
                        },
                    };
                },
                formatSharing: (resource) => {
                    return {
                        analysis_id: resource.id || resource.analysis_id,
                    };
                },
                formatUnsharing: (resource) =>
                    resource.id || resource.analysis_id,
            };
        }
        case TYPE.TOOLS: {
            return {
                getId: (sharing) => sharing.id || sharing.tool_id,
                getPermList: (sharing) => sharing.permissions,
                getUserId: (permission) => permission.subject.id,
                formatSubject: (user) => {
                    return {
                        subject: {
                            source_id: user.source_id,
                            id: user.id,
                        },
                    };
                },
                formatSharing: (resource) => {
                    return {
                        tool_id: resource.id || resource.tool_id,
                    };
                },
                formatUnsharing: (resource) => resource.id || resource.tool_id,
            };
        }
        default:
            return null;
    }
};

/**
 * Returns a list containing all the resources a user has or will have
 * permissions on
 * @param {SharingUser} user
 * @return {Resource[]}
 */
const getUserResourceList = (user) => {
    return [
        ...(user[TYPE.DATA] || []),
        ...(user[TYPE.ANALYSES] || []),
        ...(user[TYPE.APPS] || []),
        ...(user[TYPE.TOOLS] || []),
    ];
};

/**
 * Takes a userMap and returns the same userMap with the displayPermission
 * and originalPermission values set
 * @param {UserMap} userMap - original userMap
 * @param {number} resourceTotal - the total number of resources supplied to the sharing dialog
 * @return {UserMap} userMap with original and display permissions added
 */
const addDisplayPermissions = (userMap, resourceTotal) => {
    return Object.keys(userMap).reduce((userMap, userId) => {
        const user = userMap[userId];
        const resources = getUserResourceList(user);

        const permissions = resources.map((resource) => resource.permission);
        const displayPermission = getDisplayPermission(
            permissions,
            resourceTotal
        );
        return {
            ...userMap,
            [userId]: {
                ...user,
                displayPermission,
                originalPermission: displayPermission,
            },
        };
    }, userMap);
};

/**
 * This will create a UserMap based on the resources provided to the sharing
 * dialog.  The basic structure is each key will be a user ID and the values
 * will be SharingUser objects
 *
 * @param {PermissionListResponse[]} responses
 * @param {Subject[]} userInfos
 * @param {number} resourceTotal
 * @returns {UserMap}
 */
export const getUserMap = (responses, userInfos, resourceTotal) => {
    const userMap = responses.reduce((acc, resp) => {
        const type = getResponseType(resp);
        const { getPermList, getUserId, formatSharing } = getSharingFns(type);
        return resp[type].reduce((shares, sharing) => {
            const permissions = getPermList(sharing);

            return permissions.reduce((userMap, permission) => {
                const userId = getUserId(permission);
                const currentUser = userMap[userId] ||
                    userInfos[userId] || { id: userId };
                const permissionValue = permission.permission;

                // Create an obj with the resource details and the user's
                // current permission
                const resourceWithPermission = {
                    ...formatSharing(sharing),
                    permission: permissionValue,
                };

                const updatedUser = {
                    ...currentUser,
                    [type]: [
                        ...(currentUser[type] || []),
                        resourceWithPermission,
                    ],
                };
                return { ...userMap, [userId]: updatedUser };
            }, shares);
        }, acc);
    }, {});
    return addDisplayPermissions(userMap, resourceTotal);
};

/**
 * Takes a user and examines its paths, apps, analyses, and tools keys to compare
 * against the resources list to find missing resources.  Adds the missing resources.
 * @param {SharingUser} user
 * @param {Resource[]} resources
 * @return {SharingUser}
 */
export const addMissingResourcesToUser = (user, resources) => {
    const currentResources = getUserResourceList(user);

    return Object.keys(resources).reduce((newUser, type) => {
        const { getId, formatSharing } = getSharingFns(type);
        return resources[type].reduce((newResources, resource) => {
            return currentResources.some(
                (perm) => getId(perm) === getId(resource)
            )
                ? newResources
                : {
                      ...newResources,
                      [type]: [
                          ...(newResources[type] || []),
                          formatSharing(resource),
                      ],
                  };
        }, newUser);
    }, user);
};

/**
 * Takes as input an array of all the permission-lister responses and returns a
 * list of each unique user ID found in those responses for the purpose
 * of fetching their detailed info from the user-info service
 * @param {PermissionListResponse[]} responses
 * @return {string[]} - array of user IDs
 */
export const getUserSet = (responses) => {
    //resource type
    const allUsers = responses.reduce((acc, resp) => {
        const type = getResponseType(resp);
        const { getPermList, getUserId } = getSharingFns(type);
        // permission list
        const users = resp[type].reduce((currUsers, sharing) => {
            const permList = getPermList(sharing);
            return [...currUsers, ...permList.map((perm) => getUserId(perm))];
        }, []);
        return [...acc, ...users];
    }, []);
    return getUniqueList(allUsers);
};

/**
 * Takes the resources provided from the bag and returns the total #
 * @param {Resource[]} resources
 * @return {number} - total
 */
export const getResourceTotal = (resources) => {
    return Object.values(resources).reduce((acc, type) => {
        return acc + type.length;
    }, 0);
};

/**
 * Checks a response from the sharing endpoints and will find which resource
 * type key exists and will return the values
 */
export const getShareResponseValues = (resp) => {
    return (
        resp[TYPE.DATA] ||
        resp[TYPE.APPS] ||
        resp[TYPE.ANALYSES] ||
        resp[TYPE.TOOLS]
    );
};

/**
 * Takes the userMap returned from `groupByUser`, and returns all the
 * sharing requests that need to be sent out for each resource type.
 * @param {UserMap} userMap
 * @return {{string, ShareRequest[]}} - keys are TYPEs, values are the sharing requests
 */
export const getSharingUpdates = (userMap) => {
    return Object.keys(userMap).reduce((acc, userId) => {
        const user = userMap[userId];
        const { originalPermission, displayPermission } = user;

        if (originalPermission !== displayPermission) {
            return allResourceTypes.reduce((acc, type) => {
                const resources = user[type];

                if (resources && resources.length > 0) {
                    const { formatSubject } = getSharingFns(type);
                    const updates = resources.filter(
                        (resource) => displayPermission !== resource.permission
                    );

                    if (updates && updates.length > 0) {
                        const sharingReq = {
                            ...formatSubject(user),
                            [type]: updates.map((resource) => {
                                return {
                                    ...resource,
                                    permission: displayPermission,
                                };
                            }),
                        };
                        return {
                            ...acc,
                            [type]: [...(acc[type] || []), sharingReq],
                        };
                    }
                    return acc;
                }
                return acc;
            }, acc);
        }
        return acc;
    }, {});
};

/**
 * Takes two userMaps (generated by `groupByUsers`) and finds which users
 * have been removed in order to create unsharing requests.
 * @param {UserMap} originalUsers - original userMap
 * @param {UserMap} userMap - updated userMap
 * @return {{string, UnshareRequest[]}} - keys are TYPEs, values are unshare requests
 */
export const getUnsharingUpdates = (originalUsers, userMap) => {
    const currentUserIds = Object.keys(userMap);

    return Object.keys(originalUsers).reduce((acc, id) => {
        if (!currentUserIds.includes(id)) {
            const user = originalUsers[id];

            return allResourceTypes.reduce((acc, type) => {
                const resources = user[type];

                if (resources && resources.length > 0) {
                    const { formatSubject, formatUnsharing } = getSharingFns(
                        type
                    );
                    const subject = formatSubject(user);
                    const unshareReq = {
                        ...subject,
                        [type]: resources.map((resource) =>
                            formatUnsharing(resource)
                        ),
                    };
                    return {
                        ...acc,
                        [type]: [...(acc[type] || []), unshareReq],
                    };
                }
                return acc;
            }, acc);
        }
        return acc;
    }, {});
};
