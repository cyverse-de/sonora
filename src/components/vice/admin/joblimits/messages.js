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
        jobLimitLookupError:
            "Unable to look up the job limit for {username}. Please try again.",
        jobLimitUpdateError:
            "Unable to set the job limit for {username} to {currentLimit}. Please try again.",
    },
};
