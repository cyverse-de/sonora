import React from "react";

import Listing from "../../../src/components/data/listing/Listing";
import { UploadTrackingProvider } from "../../../src/contexts/uploadTracking";
import {
    fileTypesResp,
    dataRootsResp,
    listingSuccessResp as successResp,
    instantLaunchMapping,
} from "../DataMocks";
import { mockAxios } from "../../axiosMock";
import constants from "../../../src/constants";

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
        .onGet(/\/api\/instantlaunches\/defaults\/mappings\/latest.*/)
        .reply(200, instantLaunchMapping);

    return <ListingTest />;
};
