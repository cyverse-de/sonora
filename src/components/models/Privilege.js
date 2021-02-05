/**
 * These are all the privileges accepted by Grouper. In Sonora, we've
 * simplified privileges to only the below MemberPrivileges and PublicPrivileges
 *
 * The value is the value accepted by Grouper.
 * The num is a value to establish a hierarchy where a greater number indicates more
 * power with that privilege.
 */
const Privileges = {
    ADMIN: {
        value: "admin",
        num: 5,
    },
    READ: {
        value: "read",
        num: 4,
    },
    OPTIN: {
        value: "optin",
        num: 3,
    },
    VIEW: {
        value: "view",
        num: 2,
    },
    OPTOUT: {
        value: "optout",
        num: 1,
    },
};
export default Privileges;

export const MemberPrivileges = [Privileges.ADMIN, Privileges.READ];

export const PublicPrivileges = [Privileges.VIEW];
