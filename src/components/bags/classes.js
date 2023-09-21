import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Apps, Label, InsertDriveFile, Folder } from "@mui/icons-material";
import AnalysesIcon from "components/icons/AnalysesIcon";

class BagItem {
    constructor(item) {
        this.item = item;
    }

    icon(t) {
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

    get shareable() {
        return false;
    }

    get downloadable() {
        return false;
    }

    get id() {
        return this.item.id;
    }
}

class FileBagItem extends BagItem {
    icon(t) {
        return <InsertDriveFile />;
    }

    get shareable() {
        return true;
    }

    get downloadable() {
        return true;
    }

    get name() {
        return this.item.path.substring(this.item.path.lastIndexOf("/") + 1);
    }

    get path() {
        return this.item.path;
    }
}

class FolderBagItem extends BagItem {
    icon(t) {
        return <Folder />;
    }

    get shareable() {
        return true;
    }

    get name() {
        return this.item.path.substring(this.item.path.lastIndexOf("/") + 1);
    }
    get path() {
        return this.item.path;
    }
}

class AnalysisBagItem extends BagItem {
    icon(t) {
        return <AnalysesIcon style={{ fontSize: "1.5rem" }} />;
    }

    get shareable() {
        return true;
    }
}

class AppBagItem extends BagItem {
    icon(t) {
        return <Apps color="primary" />;
    }

    get shareable() {
        return true;
    }
}

export const FOLDER_TYPE = "folder";
export const FILE_TYPE = "file";
export const ANALYSIS_TYPE = "analysis";
export const APP_TYPE = "app";

export const createNewBagItem = (item) => {
    if (!item.id) {
        item.id = uuidv4();
    }

    if (item?.path && item?.path && item?.type !== FOLDER_TYPE) {
        return new FileBagItem(item);
    }

    if (item?.path && item?.path && item?.type === FOLDER_TYPE) {
        return new FolderBagItem(item);
    }

    if (item?.type === ANALYSIS_TYPE) {
        return new AnalysisBagItem(item);
    }

    if (item?.type === APP_TYPE) {
        return new AppBagItem(item);
    }
};
