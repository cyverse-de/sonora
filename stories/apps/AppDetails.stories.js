import React from "react";
import Drawer from "../../src/components/apps/details/Drawer";
import { selectedApp, appDetails } from "./AppMocks";
import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

export default {
    title: "Apps",
};

export function DetailsDrawerTest(props) {
    return (
        <UploadTrackingProvider>
            <Drawer
                baseId="drawer"
                selectedApp={selectedApp}
                details={appDetails}
                open={true}
            />
        </UploadTrackingProvider>
    );
}
