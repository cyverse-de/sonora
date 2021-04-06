import React from "react";
import { mockAxios } from "../axiosMock";

import Preferences from "../../src/components/preferences/Preferences";

import { UploadTrackingProvider } from "../../src/contexts/uploadTracking";

import mockBootstrap, { webhookTypes, webhookTopics } from "./MockBootstrap";

export const PreferencesTest = () => {
    mockAxios.onGet(`/api/bootstrap/`).reply(200, mockBootstrap);
    mockAxios.onGet(`/api/webhooks/topics`).reply(200, webhookTopics);
    mockAxios.onGet(`/api/webhooks/types`).reply(200, webhookTypes);

    return (
        <UploadTrackingProvider>
            <Preferences baseId="preferences" />
        </UploadTrackingProvider>
    );
};

export default { title: "Preferences" };
