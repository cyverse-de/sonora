import common from "../messages";

export default {
    locales: common.locales,
    messages: {
        ...common.messages,
        imageColumn: "Image",
        portColumn: "Port",
        uidColumn: "UID",
        gidColumn: "GID",
        commandColumn: "Command",
    },
};
