import React from "react";
import Listing from "../../src/components/analyses/listing/Listing";
import { mockAxios } from "../axiosMock";
import { listing } from "./AnalysesMocks";
import { NotificationsProvider } from "../../src/contexts/pushNotifications";

export default {
    title: "Analyses",
};

function ListingTest(props) {
    return (
        <>
            <NotificationsProvider>
                <Listing baseId="tableView" />;
            </NotificationsProvider>
        </>
    );
}

export const AnalysesListingTest = () => {
    mockAxios.onGet(/\/api\/analyses*/).reply(200, listing);
    return <ListingTest />;
};
