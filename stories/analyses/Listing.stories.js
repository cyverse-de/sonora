import React from "react";
import Listing from "../../src/components/analyses/listing/Listing";
import { mockAxios } from "../axiosMock";
import { listing } from "./AnalysesMocks";
import { UserProfileProvider } from "../../src/contexts/userProfile";
export default {
    title: "Analyses",
};

function ListingTest(props) {
    return (
        <UserProfileProvider>
            <Listing baseId="tableView" />
        </UserProfileProvider>
    );
}

export const AnalysesListingTest = () => {
    mockAxios.onGet(/\/api\/analyses*/).reply(200, listing);
    return <ListingTest />;
};
