/**
 * Login user to intercom with their profile
 *
 * @param {string} userId - User Id of the logged in user
 * @param {string} email - Email of the logged in user
 * @param {string} appId - Intercom app id
 * @param {string} companyId - Intercom company id
 * @param {string} companyName - Intercom company name
 */
function intercomLogin(userId, email, appId, companyId, companyName) {
    if (window.Intercom) {
        window.Intercom("boot", {
            app_id: appId,
            email: email,
            user_id: userId,
            created_at: Date.now(),
            company: {
                id: companyId,
                name: companyName,
            },
        });
    }
}

function intercomLogout() {
    console.log("logging out");
    if (window.Intercom) {
        window.Intercom("shutdown");
    }
}

function intercomShow() {
    if (window.Intercom) {
        window.Intercom("show");
    }
}

function trackIntercomEvent(event, metadata) {
    console.log("track event: " + event + " " + JSON.stringify(metadata));
    if (window.Intercom) {
        if (metadata) {
            window.Intercom("trackEvent", event, metadata);
        } else {
            window.Intercom("trackEvent", event);
        }
    }
}

const IntercomEvents = {
    VIEWED_FOLDER: "viewed folder",
    VIEWED_FILE: "viewed file",
    VIEWED_APPS: "viewed apps",
    VIEWED_ANALYSES: "viewed analyses",
    VIEWED_TOOLS: "viewed tools",
    VIEWED_NOTIFICATIONS: "viewed notifications",
    LAUNCHED_JOB: "launched job",
    VIEWED_HELP: "viewed help",
    URL_IMPORT_SUBMITTED: "url import submitted",
    FILE_UPLOADED: "file uploaded",
    SEARCHED_DATA: "searched data",
    SEARCHED_APPS: "searched apps",
    SEARCHED_ANALYSES: "searched analyses",
    SEARCHED_TEAMS: "searched teams",
    SEARCHING_DATA: "searching data",
    SEARCHING_APPS: "searching apps",
    SEARCHING_ANALYSES: "searching analyses",
    SEARCHING_TEAMS: "searching teams",
    VIEWED_ALL_TEAMS: "view all teams",
    VIEWED_MY_TEAMS: "view my teams",
    CREATED_NEW_TEAM: "created new team",
    DELETED_TEAM: "deleted team",
    REQUESTED_JOIN_TEAM: "request to join team",
    ENCOUNTERED_ERROR: "encountered error",
    VIEWED_METADATA: "viewed metadata",
    SUBMITTED_DOI_REQUEST: "submitted doi request",
    ANALYSIS_CANCELLED: "analysis cancelled",
};

export {
    intercomLogin,
    intercomLogout,
    intercomShow,
    trackIntercomEvent,
    IntercomEvents,
};
