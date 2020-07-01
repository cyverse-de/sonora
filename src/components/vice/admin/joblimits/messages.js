import common from "../messages";

export default {
    locales: common.locales,
    messages: {
        ...common.messages,
        jobLimits: "Job Limits",
        username: "Username",
        set: "Set",
        get: "Get",
        newJobLimit: "New Job Limit",
        search: "Search",
        searchForLimit:
            "Search for the job limit by user to see their current value.",
        currentJobLimit:
            "The current job limit for {username} is {currentLimit}.",
    },
};
