export function mapPropsToValues(subscription) {
    let values = {
        username: "",
        plan_name: "",
        quotas: [],
    };

    if (subscription) {
        const { user, plan, quotas } = subscription;

        values = {
            username: user.username,
            plan_name: plan.name,
        };

        if (quotas.length) {
            values.quotas = quotas.map(({ quota, resource_type }) => ({
                quota,
                resource_type,
            }));
        }
    }

    return values;
}

export function formatSubscriptions(values) {
    const { username, plan_name } = values;

    const submission = {
        username,
        plan_name,
    };
    return submission;
}
