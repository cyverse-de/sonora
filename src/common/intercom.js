function intercomLogin(userId, email, appId, companyId, companyName) {
    console.log(
        "logging in user => " + userId + " for company=>" + companyName
    );
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

function intercomLogout() {
    console.log("logging out");
    window.Intercom("shutdown");
}

function trackIntercomEvent(event, metadata) {
    console.log("track event");
}
export { intercomLogin, intercomLogout, trackIntercomEvent };
