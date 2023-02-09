import React from "react";
import { mockAxios } from "../axiosMock";
import EditQuotas from "../../src/components/subscriptions/edit/EditQuotas";
import { listing, subscription } from "./SubscriptionMocks";

export default {
    title: "Subscriptions / Edit",
};

export function EditQuotasTest() {
    mockAxios.onGet(/\/api\/admin\/qms\/subscriptions.*/).reply(200, listing);
    mockAxios
        .onPost(/\/api\/admin\/qms\/users\/.*\/plan\/.*\/quota/)
        .reply((config) => {
            const submission = JSON.parse(config.data);
            console.log("Resource quota updated", config.url, submission);
            return [200, submission];
        });

    const parentId = "editQuotasDlg";
    const onClose = () => console.log("Dialog closed.");

    return (
        <EditQuotas
            open={true}
            onClose={onClose}
            parentId={parentId}
            subscription={subscription}
        />
    );
}
