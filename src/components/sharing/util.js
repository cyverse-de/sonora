import { SharingPermissions } from "../models/Permissions";

// Returns whether the given user object (returned from user-info call) is a group
export const isGroup = (user) => {
    return user.source_id === "g:gsa";
};

// Returns the short group name for display
export const groupName = (subject) => {
    return subject.name.split(":").pop();
};

// Takes a list and returns a new list with only unique, non-empty values
const getUniqueList = (list) => {
    return [...new Set(list)].filter((item) => !!item);
};

// Takes a list of permission values (i.e. read, write, own) and returns
// what to display as their overall permission
const getDisplayPermission = (permissionList, resourceTotal) => {
    if (permissionList.length !== resourceTotal) {
        return SharingPermissions.VARIES;
    }
    const values = getUniqueList(permissionList);
    return values.length === 1 ? values[0] : SharingPermissions.VARIES;
};

// These are the keys to each permission-lister response object and correspond
// to each type of resource that can be shared in Sonora
export const TYPE = {
    DATA: "paths",
    APPS: "apps",
    ANALYSES: "analyses",
    TOOLS: "tools",
};

const allResourceTypes = [TYPE.DATA, TYPE.APPS, TYPE.ANALYSES, TYPE.TOOLS];

// Function for returning the response type based on the key in the `resp` obj
// The key should be one of those keys in TYPE
const getResponseType = (resp) => Object.keys(resp)[0];

/**
 * Helper functions for retrieving information across the different types of
 * permission-lister responses.
 *
 * A "sharing" is the object containing the resource information,
 * such as the resource id and name, plus an array of permissions for that
 * resource.
 *
 * A "permission" is the object containing the subject information
 * and the actual permission value that the subject has on a resource.
 *
 * A "user" is an object containing the details for a user returned from the user-info
 * service
 *
 * A "resource" is a resource object that the user has selected to share
 *
 * -getId will return a resource's ID
 * -getPermList will return the list of permissions in the sharing object
 * -getUserId will return a user's ID
 * -formatSubject will return the formatted user information meant for sending
 * to the sharing and unsharing endpoints
 * -formatSharing will return the formatted resource information meant for sending
 * to the sharing endpoints
 * -formatUnsharing will return the formatted resource information meant for
 * sending to the unsharing endpoints
 *
 * @param type
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

// A user can have all or no resources.  Check for each resource type and
// return a list containing them all
const getUserResourceList = (user) => {
    return [
        ...(user[TYPE.DATA] || []),
        ...(user[TYPE.ANALYSES] || []),
        ...(user[TYPE.APPS] || []),
        ...(user[TYPE.TOOLS] || []),
    ];
};

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
 * This will create a mapping where each key is a user ID.  The value is
 * the user's information from the user-info service with 3 things added:
 * - originalPermission: contains the original overall permission for the user
 *
 * - displayPermission: contains the current overall permission for the user.
 * If the user's permission gets updated in the sharing dialog, this value will
 * update.
 *
 * - paths, apps, analyses, tools keys for storing the array of resources the
 * user has or will have permissions on
 *
 * @param responses - permission-lister responses
 * @param userInfos
 * @param resourceTotal
 * @returns {{}}
 */
export const getUserMap = (responses, userInfos, resourceTotal) => {
    const userMap = responses.reduce((acc, resp) => {
        const type = getResponseType(resp);
        const { getPermList, getUserId, formatSharing } = getSharingFns(type);
        return resp[type].reduce((shares, sharing) => {
            const permissions = getPermList(sharing);

            return permissions.reduce((userMap, permission) => {
                const userId = getUserId(permission);
                const currentUser = userMap[userId] || userInfos[userId];
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

// Takes a user and examines its paths, apps, analyses, and tools keys to compare
// against the resources list to find missing resources.  Adds the missing resources.
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

// Takes as input an array of all the permission-lister responses and returns a
// list of each unique user ID found in those responses for the purpose
// of fetching their detailed info from the user-info service
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

// Takes the resources provided from the bag and returns the total #
export const getResourceTotal = (resources) => {
    return Object.values(resources).reduce((acc, type) => {
        return acc + type.length;
    }, 0);
};

// Checks a response from the sharing endpoints and will find which resource
// type key exists and will return the values
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
 * Will return an object that looks like
 * `{paths: [updates], apps: [updates], analyses: [updates], tools: [updates]}`
 * @param userMap
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
 * Will return an object that looks like
 * `{paths: [updates], apps: [updates], analyses: [updates], tools: [updates]}`
 * @param originalUsers - original userMap
 * @param userMap - updated userMap
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
