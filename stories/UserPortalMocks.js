export const STATUS = {
    GRACE: "gracePeriod",
    EXPIRED: "expired",
    UPDATED: "updated",
};

export const portalUserStatus = (status) => ({
    updated_at: null,
    update_required: STATUS.EXPIRED === status,
    warning_required: STATUS.GRACE === status,
    update_period: 365,
    warning_period: 30,
    update_text:
        "We request that you update your profile information on an annual basis.  Please do so now in order to proceed to the application.",
    warning_text:
        "We request that you update your profile information on an annual basis.",
    update_url: "https://portaldev.cyverse.org/account?reviewMode=1",
});
