/**
 * These are all the privileges accepted by Grouper. In Sonora, we've
 * simplified privileges to only the below MemberPrivileges and PublicPrivileges
 *
 * The value is the value accepted by Grouper.
 * The level is a value to establish a hierarchy where a greater number indicates
 * more power with that privilege.
 */
const Privileges = {
    ADMIN: {
        value: "admin",
        level: 5,
    },
    READ: {
        value: "read",
        level: 4,
    },
    OPTIN: {
        value: "optin",
        level: 3,
    },
    VIEW: {
        value: "view",
        level: 2,
    },
    OPTOUT: {
        value: "optout",
        level: 1,
    },
};
export default Privileges;

export const MemberPrivileges = [Privileges.ADMIN, Privileges.READ];

export const PublicPrivileges = [Privileges.VIEW];
