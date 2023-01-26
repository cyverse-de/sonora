export function mapPropsToValues(subscription) {
    let values = {
        username: "",
        plan_name: [],
    };

    if (subscription) {
        const { user, plan } = subscription;

        values = {
            username: user.username,
            plan_name: plan.name,
        };
    }

    return values;
}

export function formatSubscriptions(values) {
    const { username, plan_name } = values;

    const subscriptions = {
        username,
        plan_name,
    };
    return subscriptions;
}
