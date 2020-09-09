import React from "react";
import { Label, InsertDriveFile, Folder } from "@material-ui/icons";

class BagItem {
    constructor(item) {
        this.item = item;
    }

    get icon() {
        return <Label />;
    }

    get label() {
        return (
            this.item?.label ||
            this.item?.name ||
            this.item?.description ||
            "override label() please"
        );
    }
}

class FileBagItem extends BagItem {
    get icon() {
        return <InsertDriveFile />;
    }
}

class FolderBagItem extends BagItem {
    get icon() {
        return <Folder />;
    }
}

const DIR_TYPE = "dir";

export const createNewBagItem = (item) => {
    if (item?.name && item?.path && item?.type !== DIR_TYPE) {
        return new FileBagItem(item);
    }

    if (item?.name && item?.path && item?.type === DIR_TYPE) {
        return new FolderBagItem(item);
    }
};
