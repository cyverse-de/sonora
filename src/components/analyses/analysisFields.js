const analysisFields = (t) => ({
    NAME: { fieldName: t("name"), key: "name" },
    OWNER: { fieldName: t("owner"), key: "owner" },
    APP: { fieldName: t("app"), key: "app_name" },
    START_DATE: { fieldName: t("startDate"), key: "startdate" },
    END_DATE: { fieldName: t("endDate"), key: "enddate" },
    STATUS: { fieldName: t("status"), key: "status" },
    ACTIONS: { key: "actions" },
    CHECKBOX: { name: "", key: "checkbox" },
    DOT_MENU: { name: "", key: "dotMenu" },
});

export default analysisFields;
