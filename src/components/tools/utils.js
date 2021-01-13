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

export { isWritable, canShare };
