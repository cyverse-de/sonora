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
    usageSummaryStorageLimitExceededResponse,
    usageSummaryComputeLimitExceededResponse,
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

const DataListingTestTemplate = (args) => {
    const {
        pagedDirectoryResponse,
        dataRootsResponse,
        fileTypesResponse,
        deletionResponse,
        instantLaunchMappingResponse,
        instantLaunchAppInfoResponse,
        instantLaunchGlobalSavedLaunchesResponse,
        instantLaunchSavedLaunchResponse,
        instantLaunchSubmissionResponse,
        usageSummaryResponse,
        usageSummaryError,
    } = args;

    mockAxios
        .onGet(/\/api\/filesystem\/paged-directory.*/)
        .reply(200, pagedDirectoryResponse);
    mockAxios.onGet(/\/api\/filesystem\/root.*/).reply(200, dataRootsResponse);
    mockAxios
        .onGet(/\/api\/filetypes\/type-list/)
        .reply(200, fileTypesResponse);

    mockAxios.onPost(/\/api\/filesystem\/delete/).reply(200, deletionResponse);
    mockAxios
        .onGet(/\/api\/instantlaunches\/mappings\/defaults\/latest.*/)
        .reply(200, instantLaunchMappingResponse);
    mockAxios
        .onGet(
            /\/api\/quicklaunches\/a4b1f851-80c0-415d-ba3c-6663432e4f7e\/app-info.*/
        )
        .reply(200, instantLaunchAppInfoResponse);
    mockAxios
        .onGet(/\/api\/quicklaunches\/defaults\/global.*/)
        .reply(200, instantLaunchGlobalSavedLaunchesResponse);
    mockAxios
        .onGet(/\/api\/quicklaunches\/a4b1f851-80c0-415d-ba3c-6663432e4f7e.*/)
        .reply(200, instantLaunchSavedLaunchResponse);
    mockAxios
        .onPost(/\/api\/analyses.*/)
        .reply(200, instantLaunchSubmissionResponse);
    mockAxios
        .onGet(/\/api\/resource-usage\/summary.*/)
        .reply(usageSummaryError ? 400 : 200, usageSummaryResponse);

    return <ListingTest />;
};

export const NormalListing = DataListingTestTemplate.bind({});
NormalListing.args = {
    pagedDirectoryResponse: successResp,
    dataRootsResponse: dataRootsResp,
    fileTypesResponse: fileTypesResp,
    deletionResponse: {},
    instantLaunchMappingResponse: instantLaunchMapping,
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    instantLaunchGlobalSavedLaunchesResponse: instantLaunchGlobalSavedLaunches,
    instantLaunchSavedLaunchResponse: instantLaunchSavedLaunch,
    instantLaunchSubmissionResponse: instantLaunchSubmissionResponse,
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: false,
};

export const StorageLimitExceeded = DataListingTestTemplate.bind({});
StorageLimitExceeded.args = {
    pagedDirectoryResponse: successResp,
    dataRootsResponse: dataRootsResp,
    fileTypesResponse: fileTypesResp,
    deletionResponse: {},
    instantLaunchMappingResponse: instantLaunchMapping,
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    instantLaunchGlobalSavedLaunchesResponse: instantLaunchGlobalSavedLaunches,
    instantLaunchSavedLaunchResponse: instantLaunchSavedLaunch,
    instantLaunchSubmissionResponse: instantLaunchSubmissionResponse,
    usageSummaryResponse: usageSummaryStorageLimitExceededResponse,
    usageSummaryError: false,
};

export const ComputeLimitExceeded = DataListingTestTemplate.bind({});
ComputeLimitExceeded.args = {
    pagedDirectoryResponse: successResp,
    dataRootsResponse: dataRootsResp,
    fileTypesResponse: fileTypesResp,
    deletionResponse: {},
    instantLaunchMappingResponse: instantLaunchMapping,
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    instantLaunchGlobalSavedLaunchesResponse: instantLaunchGlobalSavedLaunches,
    instantLaunchSavedLaunchResponse: instantLaunchSavedLaunch,
    instantLaunchSubmissionResponse: instantLaunchSubmissionResponse,
    usageSummaryResponse: usageSummaryComputeLimitExceededResponse,
    usageSummaryError: false,
};

export const UsageSummaryError = DataListingTestTemplate.bind({});
UsageSummaryError.args = {
    pagedDirectoryResponse: successResp,
    dataRootsResponse: dataRootsResp,
    fileTypesResponse: fileTypesResp,
    deletionResponse: {},
    instantLaunchMappingResponse: instantLaunchMapping,
    instantLaunchAppInfoResponse: instantLaunchAppInfo,
    instantLaunchGlobalSavedLaunchesResponse: instantLaunchGlobalSavedLaunches,
    instantLaunchSavedLaunchResponse: instantLaunchSavedLaunch,
    instantLaunchSubmissionResponse: instantLaunchSubmissionResponse,
    usageSummaryResponse: usageSummaryResponse,
    usageSummaryError: true,
};
