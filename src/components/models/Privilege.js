/**
 * These are all the privileges used by Teams.  These are also all the privileges
 * accepted by Grouper, save for READOPTIN, which is a fake privilege to represent
 * READ and OPTIN together.
 *
 * The value is the value accepted by Grouper.
 * The num is a value to establish a hierarchy where a greater number indicates more
 * power with that privilege.
 */
export default {
    ADMIN: {
        value: "admin",
        num: 6,
    },
    READOPTIN: {
        value: "readOptin",
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
