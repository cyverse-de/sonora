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
        name: "Name",
        nodePort: "Node Port",
        targetPort: "Target Port",
        targetPortName: "Target Port Name",
        protocol: "Protocol",
        namespace: "Namespace",
        portName: "Port Name",
    },
};
