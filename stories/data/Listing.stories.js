import React from "react";

import Listing from "components/data/listing/Listing";
import { UploadTrackingProvider } from "contexts/uploadTracking";

import {
    fileTypesResp,
    dataRootsResp,
    listingSuccessResp as successResp,
} from "./DataMocks";

import {
    instantLaunchMapping,
    instantLaunchAppInfo,
    instantLaunchSavedLaunch,
    instantLaunchSubmissionResponse,
} from "./DataMocksInstantLaunch";
import {
    usageSummaryResponse,
    usageSummaryStorageLimitExceededResponse,
    usageSummaryComputeLimitExceededResponse,
} from "../usageSummaryMock";
import { MockMetadata } from "../metadata/MetadataMocks";

import { mockAxios } from "../axiosMock";
import constants from "constants";

export default {
    title: "Data / Listing",
};

function ListingTest(props) {
    const logger = (message) => {
        console.log(message);
    };

    return (
        <UploadTrackingProvider>
            <Listing
                baseId="tableView"
                path="/iplant/home/ipcdev"
                handlePathChange={(path) => logger("Change to path " + path)}
                page={0}
                rowsPerPage={100}
                order={constants.SORT_DESCENDING}
                orderBy="name"
            />
        </UploadTrackingProvider>
    );
}

const DataListingTestTemplate = (args) => {
    const {
        instantLaunchAppInfoResponse,
        usageSummaryResponse,
        usageSummaryError,
    } = args;

    mockAxios
        .onGet(/\/api\/filesystem\/paged-directory.*/)
        .reply(200, successResp);
    mockAxios.onGet(/\/api\/filesystem\/root.*/).reply(200, dataRootsResp);
    mockAxios.onGet(/\/api\/filetypes\/type-list/).reply(200, fileTypesResp);

    mockAxios.onPost(/\/api\/filesystem\/delete/).reply(200, {});
    mockAxios
        .onGet(/\/api\/instantlaunches\/mappings\/defaults\/latest.*/)
        .reply(200, instantLaunchMapping);
    mockAxios
        .onGet(
            /\/api\/quicklaunches\/a4b1f851-80c0-415d-ba3c-6663432e4f7e\/app-info.*/
        )
        .reply(200, instantLaunchAppInfoResponse);
    mockAxios
        .onGet(/\/api\/quicklaunches\/a4b1f851-80c0-415d-ba3c-6663432e4f7e.*/)
        .reply(200, instantLaunchSavedLaunch);
    mockAxios
        .onPost(/\/api\/analyses.*/)
        .reply(200, instantLaunchSubmissionResponse);
    mockAxios
        .onGet(/\/api\/resource-usage\/summary.*/)
        .reply(usageSummaryError ? 400 : 200, usageSummaryResponse);

    mockAxios.onPost("/api/filesystem/metadata/search").reply((config) => {
        console.log("Search Metadata", config.url, config.data);

        return [200, MockMetadata];
    });

    return <ListingTest />;
};

export const NormalListing = DataListingTestTemplate.bind({});
NormalListing.args = {
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: false,
};

export const StorageLimitExceeded = DataListingTestTemplate.bind({});
StorageLimitExceeded.args = {
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    usageSummaryResponse: usageSummaryStorageLimitExceededResponse,
    usageSummaryError: false,
};

export const ComputeLimitExceeded = DataListingTestTemplate.bind({});
ComputeLimitExceeded.args = {
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    usageSummaryResponse: usageSummaryComputeLimitExceededResponse,
    usageSummaryError: false,
};

export const UsageSummaryError = DataListingTestTemplate.bind({});
UsageSummaryError.args = {
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: true,
};

export const InstantLaunchLimitReached = DataListingTestTemplate.bind({});
InstantLaunchLimitReached.args = {
    instantLaunchAppInfoResponse: {
        ...instantLaunchAppInfo,
        limitChecks: {
            canRun: false,
            results: [
                {
                    limitCheckID: "CONCURRENT_VICE_ANALYSES",
                    reasonCodes: ["ERR_LIMIT_REACHED"],
                    additionalInfo: {
                        runningJobs: 2,
                        maxJobs: 2,
                        usingDefaultSetting: false,
                        pendingRequest: false,
                    },
                },
            ],
        },
    },
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: false,
};

export const InstantLaunchVICEForbidden = DataListingTestTemplate.bind({});
InstantLaunchVICEForbidden.args = {
    instantLaunchAppInfoResponse: {
        ...instantLaunchAppInfo,
        limitChecks: {
            canRun: false,
            results: [
                {
                    limitCheckID: "CONCURRENT_VICE_ANALYSES",
                    reasonCodes: ["ERR_FORBIDDEN"],
                    additionalInfo: {
                        runningJobs: 0,
                        maxJobs: 0,
                        usingDefaultSetting: false,
                        pendingRequest: false,
                    },
                },
            ],
        },
    },
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: false,
};

export const InstantLaunchPermissionNeeded = DataListingTestTemplate.bind({});
InstantLaunchPermissionNeeded.args = {
    instantLaunchAppInfoResponse: {
        ...instantLaunchAppInfo,
        limitChecks: {
            canRun: false,
            results: [
                {
                    limitCheckID: "CONCURRENT_VICE_ANALYSES",
                    reasonCodes: ["ERR_PERMISSION_NEEDED"],
                    additionalInfo: {
                        runningJobs: 0,
                        maxJobs: 0,
                        usingDefaultSetting: false,
                        pendingRequest: false,
                    },
                },
            ],
        },
    },
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: false,
};

export const InstantLaunchPermissionPending = DataListingTestTemplate.bind({});
InstantLaunchPermissionPending.args = {
    instantLaunchAppInfoResponse: {
        ...instantLaunchAppInfo,
        limitChecks: {
            canRun: false,
            results: [
                {
                    limitCheckID: "CONCURRENT_VICE_ANALYSES",
                    reasonCodes: ["ERR_PERMISSION_NEEDED"],
                    additionalInfo: {
                        runningJobs: 0,
                        maxJobs: 0,
                        usingDefaultSetting: false,
                        pendingRequest: true,
                    },
                },
            ],
        },
    },
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: false,
};
