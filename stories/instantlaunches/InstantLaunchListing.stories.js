import React from "react";

import { mockAxios } from "../axiosMock";
import { testFullInstantLaunchList } from "./admin/SavedLaunchListData";
import InstantLaunchListing from "../../src/components/instantlaunches/listing/index";
import {
    usageSummaryResponse,
    usageSummaryComputeLimitExceededResponse,
} from "../data/DataMocksInstantLaunch";

export default {
    title: "Instant Launches / Instant Launch Listing",
};

const InstantLaunchListTestTemplate = (args) => {
    const { instantLaunchListing, usageSummaryResponse } = args;
    mockAxios
        .onGet("/api/instantlaunches/metadata/full", {
            params: { attribute: "ui_location", value: "listing", unit: "" },
        })
        .reply(200, instantLaunchListing);
    mockAxios
        .onGet(/\/api\/resource-usage\/summary.*/)
        .reply(200, usageSummaryResponse);

    return <InstantLaunchListing />;
};

export const NormalListing = InstantLaunchListTestTemplate.bind({});
NormalListing.args = {
    instantLaunchListing: testFullInstantLaunchList,
    usageSummaryResponse: usageSummaryResponse,
};

export const ComputeLimitExceeded = InstantLaunchListTestTemplate.bind({});
ComputeLimitExceeded.args = {
    instantLaunchListing: testFullInstantLaunchList,
    usageSummaryResponse: usageSummaryComputeLimitExceededResponse,
};
