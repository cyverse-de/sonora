import React from "react";
import { mockAxios } from "../axiosMock";
import Drawer from "../../src/components/subscriptions/details/Drawer";
import { listing, subscription } from "./SubscriptionMocks";

export default {
    title: "Subscriptions / Details",
};
export function DetailsDrawer() {
    mockAxios.onGet(/\/api\/admin\/qms\/subscriptions.*/).reply(200, listing);

    const onClose = () => {
        console.log("Details drawer closed.");
    };
    const baseId = "subscriptionsDetailsDrawer";
    return (
        <Drawer
            anchor="right"
            baseId={baseId}
            onClose={onClose}
            open={true}
            selectedSubscription={subscription}
        />
    );
}
