import { DEFAULT_PAGE_SETTINGS } from "./utils";

const dataFields = (dataI18n) => ({
    NAME: {
        fieldName: dataI18n("name"),
        key: DEFAULT_PAGE_SETTINGS.orderBy,
    },
    LAST_MODIFIED: {
        fieldName: dataI18n("modified"),
        key: "datemodified",
    },
    CREATED: {
        fieldName: dataI18n("created"),
        key: "datecreated",
    },
    SIZE: {
        fieldName: dataI18n("fileSize"),
        key: "size",
    },

    INFO_TYPE: {
        fieldName: dataI18n("infoType"),
        key: "infoType",
    },
    PERMISSION: {
        fieldName: dataI18n("permissions"),
        key: "permission",
    },
    PATH: {
        fieldName: dataI18n("path"),
        key: "path",
    },
    CHECKBOX: { fieldName: "", key: "checkbox" },
    DOT_MENU: { fieldName: "", key: "dotMenu" },
});

export default dataFields;
