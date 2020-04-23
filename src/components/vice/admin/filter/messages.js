import common from "../messages";

export default {
    locales: common.locales,
    messages: {
        ...common.messages,
        image: "Image",
        port: "Port",
        uid: "UID",
        gid: "GID",
        command: "Command",
    },
};
