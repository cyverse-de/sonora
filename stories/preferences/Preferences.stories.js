import React from "react";
import { mockAxios } from "../axiosMock";

import Preferences from "../../src/components/preferences/Preferences";

import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

import mockBootstrap from "./MockBootstrap";

export const PreferencesTest = () => {
    mockAxios.onGet(/\/api\/bootstrap*/).reply(200, mockBootstrap);

    return (
        <UploadTrackingProvider>
            <Preferences baseId="preferences" />
        </UploadTrackingProvider>
    );
};

export default { title: "Preferences" };
