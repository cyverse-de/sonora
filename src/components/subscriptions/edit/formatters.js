export function mapPropsToValues(subscription) {
    let values = {
        username: "",
        plan: {
            name: "",
            plan_quota_defaults: [],
        },
        usages: [],
        quotas: [],
    };

    if (subscription) {
        const { usages, user, plan, quotas } = subscription;

        values = {
            username: user.username,
            plan_name: plan.name,
        };

        if (usages.length) {
            values.usages = usages.map(({ usage, resource_type }) => ({
                usage,
                resource_type,
            }));
        }

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
