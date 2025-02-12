import dateConstants from "components/utils/dateConstants";

import { bytesInGiB, bytesToGiB } from "../utils";
import { formatDateObject } from "components/utils/DateFormatter";

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
    const { username, paid, plan_name, start_date, end_date } = values;

    const submission = {
        username,
        plan_name,
        paid,
        start_date: start_date
            ? formatDateObject(new Date(start_date), dateConstants.ISO_8601)
            : undefined,
        end_date: end_date
            ? formatDateObject(new Date(end_date), dateConstants.ISO_8601)
            : undefined,
    };
    console.log(submission);
    return submission;
}

export function formatQuotas(values) {
    const { quotas } = values;
    const isBytes = (item) => item.resource_type.unit.toLowerCase() === "bytes";
    const dataSizeQuotaIndex = quotas.findIndex(isBytes);

    // Format the quota submission from GiB to B
    values.quotas[dataSizeQuotaIndex].quota =
        parseFloat(values.quotas[dataSizeQuotaIndex].quota) * bytesInGiB;

    return values;
}

export function mapSubAddonsPropsToValues(selectedSubAddons) {
    let values = {
        addons: [],
    };

    if (selectedSubAddons?.length) {
        values.addons = selectedSubAddons.map(
            ({ uuid, addon, amount, paid }) => ({
                uuid,
                name: addon.name,
                amount:
                    addon.resource_type.unit === "bytes"
                        ? bytesToGiB(amount)
                        : amount,
                paid,
                resource_type: addon.resource_type.unit,
            })
        );
    }

    return values;
}

export function formatSubAddonSubmission(values) {
    const { addon_uuid } = values;
    const submission = { uuid: addon_uuid };
    return submission;
}

export function formatUpdatedAddonSubmission(values) {
    let submission = values.addons.map((addon) => {
        const { uuid, amount, paid, resource_type } = addon;
        const submissionAmount =
            resource_type.toLowerCase() === "bytes"
                ? parseFloat(amount * bytesInGiB)
                : amount;
        const submissionBody = { amount: submissionAmount, paid };
        return { uuid, submissionBody };
    });

    return submission;
}
