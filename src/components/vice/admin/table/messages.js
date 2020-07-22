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
        exitCommandSent: "Exit command sent",
        saveAndExitCommandSent: "Save and Exit command sent",
        extendTimeLimit: "Extend Time Limit",
        downloadInputs: "Download Inputs",
        uploadOutputs: "Upload Outputs",
        timeLimitExtended: "Time limit extended by 3 days",
        downloadInputsCommandSent: "Download inputs command sent",
        uploadOutputsCommandSent: "Upload outputs command sent",
    },
};
