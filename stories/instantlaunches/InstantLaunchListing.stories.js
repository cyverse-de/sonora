import React from "react";

import { mockAxios } from "../axiosMock";
import {
    qlAppInfoVICELimitReached,
    qlAppInfoVICEForbidden,
    qlAppInfoPermissionNeeded,
    qlAppInfoPermissionPending,
    testFullInstantLaunchList,
} from "./admin/SavedLaunchListData";
import InstantLaunchListing from "components/instantlaunches/listing";
import {
    usageSummaryResponse,
    usageSummaryComputeLimitExceededResponse,
} from "../usageSummaryMock";

export default {
    title: "Instant Launches / Instant Launch Listing",
};

const InstantLaunchListTestTemplate = (args) => {
    const { usageSummaryResponse, usageSummaryError } = args;
    mockAxios
        .onGet("/api/instantlaunches/metadata/full", {
            params: { attribute: "ui_location", value: "listing", unit: "" },
        })
        .reply(200, testFullInstantLaunchList);
    mockAxios
        .onGet(/\/api\/resource-usage\/summary.*/)
        .reply(usageSummaryError ? 400 : 200, usageSummaryResponse);
    mockAxios
        .onGet(
            "/api/quicklaunches/2421c19e-ad85-4217-a21f-e0832f824171/app-info"
        )
        .reply(200, qlAppInfoVICELimitReached);
    mockAxios
        .onGet(
            "/api/quicklaunches/f0d5c20a-d960-44e3-b9ee-dd1c85e75b69/app-info"
        )
        .reply(200, qlAppInfoVICEForbidden);
    mockAxios
        .onGet(
            "/api/quicklaunches/d5f53129-f0af-490a-8221-e76440203cdc/app-info"
        )
        .reply(200, qlAppInfoPermissionNeeded);
    mockAxios
        .onGet(
            "/api/quicklaunches/8ebc6c80-2058-4953-b4c9-ecf893deae03/app-info"
        )
        .reply(200, qlAppInfoPermissionPending);

    return <InstantLaunchListing />;
};

export const NormalListing = InstantLaunchListTestTemplate.bind({});
NormalListing.args = {
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: false,
};

export const ComputeLimitExceeded = InstantLaunchListTestTemplate.bind({});
ComputeLimitExceeded.args = {
    usageSummaryResponse: usageSummaryComputeLimitExceededResponse,
    usageSummaryError: false,
};

export const UsageSummaryError = InstantLaunchListTestTemplate.bind({});
UsageSummaryError.args = {
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: true,
};
