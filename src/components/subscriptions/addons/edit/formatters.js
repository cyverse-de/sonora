import dateConstants from "components/utils/dateConstants";
import { formatDateObject } from "components/utils/DateFormatter";
import { bytesInGiB, bytesToGiB } from "../../utils";

function formatEffectiveDate(effectiveDate) {
    return formatDateObject(new Date(effectiveDate), dateConstants.ISO_8601);
}

function mapPropsToValues(addon) {
    let values = {
        addonName: "",
        description: "",
        defaultAmount: 0,
        defaultPaid: true,
        resourceType: "",
        addonRates: [],
    };

    if (addon) {
        const {
            uuid,
            name,
            description,
            default_amount,
            default_paid,
            resource_type,
            addon_rates,
        } = addon;

        values = {
            uuid,
            addonName: name,
            description,
            defaultAmount:
                // Display default amounts in GiB
                resource_type.unit === "bytes"
                    ? bytesToGiB(default_amount)
                    : default_amount,
            defaultPaid: default_paid,
            resourceType: resource_type.unit,
            addonRates: addon_rates.map((addonRate) => {
                return {
                    uuid: addonRate.uuid,
                    effectiveDate: addonRate.effective_date,
                    rate: addonRate.rate,
                };
            }),
        };
    }

    return values;
}

function formatAddonSubmission(values, resourceTypes, update = false) {
    const {
        uuid,
        addonName,
        description,
        defaultAmount,
        defaultPaid,
        resourceType,
        addonRates,
    } = values;

    const resourceObj = resourceTypes.find(
        (resource) => resourceType === resource.unit
    );

    const { id, unit, name, consumable } = resourceObj;

    const submission = {
        name: addonName,
        description,
        default_amount: defaultAmount,
        default_paid: defaultPaid,
        resource_type: {
            uuid: id,
        },
        addon_rates: addonRates.map((addonRate) => {
            return {
                uuid,
                effective_date: formatEffectiveDate(addonRate.effectiveDate),
                rate: addonRate.rate,
            };
        }),
    };

    // Include the submission's UUID if an update is requested
    if (update) {
        submission.uuid = uuid;
    } else {
        submission.resource_type = {
            ...submission.resource_type,
            unit,
            name,
            consumable,
        };
    }

    const resourceInBytes = unit.toLowerCase() === "bytes";

    // Default_amount will be in GiB when passed to formatter
    // Format the add-on default amount submission as bytes
    if (resourceInBytes) {
        submission.default_amount = parseFloat(defaultAmount) * bytesInGiB;
    }
    return submission;
}

export { formatAddonSubmission, mapPropsToValues };
