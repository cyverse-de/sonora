import { bytesInGiB, bytesToGiB } from "../utils";

export function mapPropsToValues(subscription) {
    let values = {
        username: "",
        paid: true,
        plan_name: "",
        quotas: [],
    };

    if (subscription) {
        const { user, paid, plan, quotas } = subscription;

        values = {
            username: user.username,
            plan_name: plan.name,
            paid,
        };

        if (quotas.length) {
            values.quotas = quotas.map(({ quota, resource_type }) => ({
                // Convert data size quota from B to GiB
                quota:
                    resource_type.unit === "bytes" ? bytesToGiB(quota) : quota,
                resource_type,
            }));
        }
    }

    return values;
}

export function formatSubscriptions(values) {
    const { username, paid, plan_name } = values;

    const submission = {
        username,
        plan_name,
        paid,
    };
    return submission;
}

export function formatQuotas(values) {
    const { quotas } = values;
    const isBytes = (item) => item.resource_type.unit.toLowerCase() === "bytes";
    const dataSizeQuotaIndex = quotas.findIndex(isBytes);

    // Format the quota submission from GiB to B
    values.quotas[dataSizeQuotaIndex].quota =
        parseInt(values.quotas[dataSizeQuotaIndex].quota) * bytesInGiB;

    return values;
}
