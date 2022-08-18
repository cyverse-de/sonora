import React from "react";

import Listing from "../../src/components/data/listing/Listing";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

import {
    fileTypesResp,
    dataRootsResp,
    listingSuccessResp as successResp,
} from "./DataMocks";

import {
    instantLaunchMapping,
    instantLaunchAppInfo,
    instantLaunchSavedLaunch,
    instantLaunchGlobalSavedLaunches,
    instantLaunchSubmissionResponse,
    usageSummaryResponse,
} from "./DataMocksInstantLaunch";

import { mockAxios } from "../axiosMock";
import constants from "../../src/constants";

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

export const DataListingTest = () => {
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
        .reply(200, instantLaunchAppInfo);

    mockAxios
        .onGet(/\/api\/quicklaunches\/defaults\/global.*/)
        .reply(200, instantLaunchGlobalSavedLaunches);

    mockAxios
        .onGet(/\/api\/quicklaunches\/a4b1f851-80c0-415d-ba3c-6663432e4f7e.*/)
        .reply(200, instantLaunchSavedLaunch);

    mockAxios
        .onPost(/\/api\/analyses.*/)
        .reply(200, instantLaunchSubmissionResponse);

    mockAxios
        .onGet(/\/api\/resource-usage\/summary.*/)
        .reply(200, usageSummaryResponse);

    return <ListingTest />;
};
