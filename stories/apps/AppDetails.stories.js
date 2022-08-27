import React from "react";

import { mockAxios } from "../axiosMock";
import userProfileMock from "../userProfileMock";
import { appDetails, appDocumentation, savedLaunches } from "./AppMocks";

import { UploadTrackingProvider } from "contexts/uploadTracking";
import Drawer from "components/apps/details/Drawer";

export default {
    title: "Apps / Details",
};

export function DetailsDrawer({ docsEditable }) {
    const appId = appDetails.id;

    mockAxios
        .onGet(new RegExp(`/api/apps/de/${appId}/.*details`))
        .reply((config) => {
            const url = config.url.split("/");
            const version_id = url[6] || appDetails.version_id;

            const details = {
                ...appDetails,
                version_id,
                integrator_email: docsEditable
                    ? userProfileMock.attributes.email
                    : appDetails.integrator_email,
            };

            return [200, details];
        });

    mockAxios
        .onGet(new RegExp(`/api/apps/de/${appId}/.*documentation`))
        .reply((config) => {
            const url = config.url.split("/");
            const version_id = url[6] || appDetails.version_id;

            return [
                200,
                {
                    ...appDocumentation,
                    version_id,
                    documentation: `${version_id} documentation`,
                },
            ];
        });

    mockAxios
        .onPatch(new RegExp(`/api/apps/de/${appId}/.*documentation`))
        .reply((config) => {
            const url = config.url.split("/");
            const version_id = url[6] || appDetails.version_id;
            const appDoc = JSON.parse(config.data);

            return [200, { ...appDocumentation, ...appDoc, version_id }];
        });

    mockAxios
        .onGet(`/api/quicklaunches/apps/${appId}`)
        .reply(200, savedLaunches);

    return (
        <UploadTrackingProvider>
            <Drawer
                baseId="drawer"
                open={true}
                appId={appId}
                versionId={appDetails.version_id}
                systemId="de"
                onClose={() => console.log("Drawer closed.")}
            />
        </UploadTrackingProvider>
    );
}

DetailsDrawer.args = { docsEditable: false };

DetailsDrawer.argTypes = {
    docsEditable: {
        name: "Documentation Editable",
        control: {
            type: "boolean",
        },
    },
};
