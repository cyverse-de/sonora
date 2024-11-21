import React from "react";

import { mockAxios, errorResponseJSON, mockErrorResponse } from "../axiosMock";

import ids from "components/apps/editor/ids";
import VersionsOrderingForm from "components/apps/editor/VersionsOrderingForm";
import { appDetails } from "./AppMocks";

export default { title: "Apps / Editor" };

export const VersionsOrdering = ({ loading, loadingError }) => {
    mockAxios.reset();
    mockAxios
        .onPut(new RegExp("/api/apps/de/.*/versions"))
        .replyOnce(500, errorResponseJSON);
    mockAxios.onPut(new RegExp("/api/apps/de/.*/versions")).reply((config) => {
        const versions = JSON.parse(config.data);
        console.log("Update App Versions", config.url, versions);

        return [200, { ...appDetails, ...versions }];
    });

    return (
        <VersionsOrderingForm
            baseId={ids.APP_VERSION}
            app={
                !(loading || loadingError) && {
                    ...appDetails,
                    versions: [
                        { version_id: 2, version: "v2" },
                        { version_id: 1, version: "v1" },
                        { version_id: 0, version: "latest" },
                    ],
                }
            }
            isLoading={loading}
            error={loadingError && mockErrorResponse}
        />
    );
};

VersionsOrdering.args = {
    loading: false,
    loadingError: false,
};

VersionsOrdering.argTypes = {
    loading: {
        name: "Loading Mask",
        control: {
            type: "boolean",
        },
    },
    loadingError: {
        name: "Loading Error",
        control: {
            type: "boolean",
        },
    },
};
