const appFields = (appsI18n) => ({
    NAME: { fieldName: appsI18n("name"), key: "name" },
    INTEGRATOR: { fieldName: appsI18n("integratedBy"), key: "integrator_name" },
    RATING: { fieldName: appsI18n("rating"), key: "average" },
    SYSTEM: { fieldName: appsI18n("systemId"), key: "system_id" },
    STATUS: { fieldName: "", key: "status" },
    TYPE: { fieldName: appsI18n("appType"), key: "overall_job_type" },
    DOT_MENU: { fieldName: "", key: "dotMenu" },
});

export default appFields;
