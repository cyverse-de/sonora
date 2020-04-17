import React from "react";
import { mockAxios } from "../axiosMock";
import { appDetails, appListing, categories } from "./AppMocks";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";
import Listing from "../../src/components/apps/listing/Listing";

export default {
    title: "Apps",
};

function ListingTest(props) {
    //Note: the params must exactly with original call made by react-query
    mockAxios.onGet("/api/apps/categories?public=false").reply(200, categories);
    mockAxios.onGet(/\/api\/apps\/categories*/).reply(200, appListing);
    mockAxios
        .onGet(
            `/api/apps/${appListing.apps[0].system_id}/${appListing.apps[0].id}/details`
        )
        .reply(200, appDetails);
    //to print all mock handlers
    // console.log(JSON.stringify(mockAxios.handlers, null, 2));

    return (
        <UploadTrackingProvider>
            <Listing baseId="tableView" />
        </UploadTrackingProvider>
    );
}

export const AppsListingTest = () => {
    return <ListingTest />;
};
