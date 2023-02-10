import React from "react";
import { mockAxios } from "../axiosMock";
import EditSubscriptionDialog from "../../src/components/subscriptions/edit/EditSubscription";
import { planTypes, subscription } from "./SubscriptionMocks";
export default {
    title: "Subscriptions / Edit",
};

export function EditSubscriptionTest({ newSubscription }) {
    // Reset the Axiosmock to initial values to help map subscription props to values when newSubscription control is toggled
    mockAxios.reset();
    mockAxios.onGet("api/qms/plans").reply(200, planTypes);
    mockAxios.onPost(/api\/admin\/qms\/subscriptions\/*/).reply((config) => {
        const submission = JSON.parse(config.data);
        console.log("Bulk Subscription Created", config.url, submission);
        return [200, submission];
    });

    const parentId = "editSubscriptionDlg";
    const onClose = () => console.log("Dialog closed.");

    return (
        <EditSubscriptionDialog
            open={true}
            onClose={onClose}
            parentId={parentId}
            subscription={!newSubscription && subscription}
        />
    );
}

EditSubscriptionTest.argTypes = {
    newSubscription: {
        name: "New Subscription",
        control: {
            type: "boolean",
        },
    },
};

EditSubscriptionTest.args = {
    newSubscription: true,
};
