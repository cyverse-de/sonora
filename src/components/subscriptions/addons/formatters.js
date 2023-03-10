import { bytesInGiB } from "../utils";

function mapPropsToValues() {
    let values = {
        name: "",
        description: "",
        defaultAmount: 0,
        defaultPaid: true,
        resourceType: "",
    };

    return values;
}

function formatAddonSubmission(values) {
    const { name, description, defaultAmount, defaultPaid, resourceType } =
        values;

    const { id, unit, ...rest } = resourceType;

    const resourceInBytes = unit.toLowerCase() === "bytes";
    const submission = {
        name,
        description,
        default_amount: defaultAmount,
        default_paid: defaultPaid,
        resource_type: {
            uuid: id,
            unit,
            ...rest,
        },
    };

    // Format the add-on default amount from GiB to B
    if (resourceInBytes) {
        submission.default_amount = parseInt(defaultAmount) * bytesInGiB;
    }
    return submission;
}

export { formatAddonSubmission, mapPropsToValues };
