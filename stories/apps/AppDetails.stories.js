import React from "react";
import Drawer from "../../src/components/apps/details/Drawer";
import { mockAxios } from "../axiosMock";
import { listingById, appDetails } from "./AppMocks";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

export default {
    title: "Apps",
};

export function DetailsDrawerTest(props) {
    mockAxios
        .onGet(`/api/apps/de/676846d4-854a-11e4-980d-7f0fcca75dbb/listing`)
        .reply(200, listingById);
    mockAxios
        .onGet(`/api/apps/de/676846d4-854a-11e4-980d-7f0fcca75dbb/details`)
        .reply(200, appDetails);
    return (
        <UploadTrackingProvider>
            <Drawer
                baseId="drawer"
                open={true}
                appId="676846d4-854a-11e4-980d-7f0fcca75dbb"
                systemId="de"
            />
        </UploadTrackingProvider>
    );
}
