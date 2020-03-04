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
    console.log(
        "logging in user => " + userId + " for company=>" + companyName
    );

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
    window.Intercom("shutdown");
}

function trackIntercomEvent(event, metadata) {
    console.log("track event");
}
export { intercomLogin, intercomLogout, trackIntercomEvent };
