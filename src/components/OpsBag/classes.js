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

class AnalysisBagItem extends BagItem {
    get icon() {
        return <img src="/analyses_selected.png" alt={"analyses"} />;
    }
}

class AppBagItem extends BagItem {
    get icon() {
        return <img src="/apps_selected.png" alt={"apps"} />;
    }
}

export const FOLDER_TYPE = "dir";
export const FILE_TYPE = "file";
export const ANALYSIS_TYPE = "analysis";
export const APP_TYPE = "app";

export const createNewBagItem = (item) => {
    if (item?.name && item?.path && item?.type !== FOLDER_TYPE) {
        return new FileBagItem(item);
    }

    if (item?.name && item?.path && item?.type === FOLDER_TYPE) {
        return new FolderBagItem(item);
    }

    if (item?.type === ANALYSIS_TYPE) {
        return new AnalysisBagItem(item);
    }

    if (item?.type === APP_TYPE) {
        return new AppBagItem(item);
    }
};
