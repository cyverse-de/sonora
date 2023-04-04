import { bytesInGiB, bytesToGiB } from "../../utils";

function mapPropsToValues(addon) {
    let values = {
        addonName: "",
        description: "",
        defaultAmount: 0,
        defaultPaid: true,
        resourceType: "",
    };

    if (addon) {
        const {
            uuid,
            name,
            description,
            default_amount,
            default_paid,
            resource_type,
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
    } = values;

    const resourceObj = resourceTypes.find(
        (resource) => resourceType === resource.unit
    );

    const { id, unit, name } = resourceObj;

    const submission = {
        name: addonName,
        description,
        default_amount: defaultAmount,
        default_paid: defaultPaid,
        resource_type: {
            uuid: id,
        },
    };

    // Include the submission's UUID if an update is requested
    if (update) {
        submission.uuid = uuid;
    } else {
        submission.resource_type = {
            ...submission.resource_type,
            unit,
            name,
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
