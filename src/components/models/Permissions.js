/**
 * Permissions a user can have for a resource
 */

const Permissions = {
    OWN: "own",
    WRITE: "write",
    READ: "read",
};

export const permissionHierarchy = (permission) => {
    switch (permission) {
        case Permissions.OWN:
            return 3;
        case Permissions.WRITE:
            return 2;
        case Permissions.READ:
            return 1;
        default:
            return 0;
    }
};

export default Permissions;
