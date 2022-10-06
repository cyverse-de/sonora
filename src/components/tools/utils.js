import Permissions, {
    permissionHierarchy,
} from "components/models/Permissions";

const canShare = (selectedTools) => {
    return (
        selectedTools &&
        selectedTools.length > 0 &&
        !selectedTools.find((tool) => tool.permission !== Permissions.OWN)
    );
};

const isWritable = (permission) => {
    return (
        permissionHierarchy(permission) >=
        permissionHierarchy(Permissions.WRITE)
    );
};

const TOOL_FILTER_VALUES = {
    MY_TOOLS: "MY_TOOLS",
    PUBLIC: "PUBLIC",
};

export { TOOL_FILTER_VALUES, isWritable, canShare };
