export default (t) => ({
    NAME: { fieldName: t("name"), key: "display_extension" },
    CREATOR: {
        fieldName: t("creator"),
        key: "detail.created_by_detail.name",
    },
    DESCRIPTION: { fieldName: t("description"), key: "description" },
    DETAILS: { fieldName: "", key: "name" },
});
