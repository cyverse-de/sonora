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
        expandRow: "Expand Row",
        saveAndExit: "Save and Exit",
        exit: "Exit",
        extendTimeLimit: "Extend Time Limit",
        downloadInputs: "Download Inputs",
        uploadOutputs: "Upload Outputs",
    },
};
