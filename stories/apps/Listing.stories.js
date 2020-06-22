import React from "react";
import { AXIOS_DELAY, mockAxios } from "../axiosMock";
import { appDetails, appListing, categories } from "./AppMocks";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";
import Listing from "../../src/components/apps/listing/Listing";
import { ConfigProvider } from "../../src/contexts/config";
import testConfig from "../configMock";

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
            <ConfigProvider config={testConfig}>
                <Listing
                    baseId="tableView"
                    onRouteToApp={(systemId, appId) =>
                        console.log("onRouteToApp", systemId, appId)
                    }
                />
            </ConfigProvider>
        </UploadTrackingProvider>
    );
}

export const AppsListingTest = () => {
    return <ListingTest />;
};

AppsListingTest.story = {
    parameters: {
        chromatic: { delay: AXIOS_DELAY * 2 + 500 },
    },
};
