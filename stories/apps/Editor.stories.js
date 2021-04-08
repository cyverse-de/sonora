import React from "react";

import { mockAxios, mockErrorResponse } from "../axiosMock";

import { AppDescriptionMock } from "./AppDescriptionMocks";

import { initMockAxiosFileFolderSelector } from "../data/DataMocks";
import { initMockAxiosReferenceGenomeListing } from "../apps/launch/data/ReferenceGenomeListing";
import { listing as ToolListing } from "../tools/ToolMocks";

import AppEditor from "components/apps/editor";
import ids from "components/apps/editor/ids";
import NewAppDefaults from "components/apps/editor/NewAppDefaults";

initMockAxiosFileFolderSelector();
initMockAxiosReferenceGenomeListing();

mockAxios.onGet(/\/api\/tools.*/).reply(200, ToolListing);

mockAxios.onPost(/\/api\/apps\/.*/).reply((config) => {
    const app = JSON.parse(config.data);
    console.log("Save New App", config.url, app);

    return [200, { ...app, id: "new-uuid" }];
});

mockAxios.onPut(/\/api\/apps\/.*/).reply((config) => {
    const app = JSON.parse(config.data);
    console.log("Update App", config.url, app);

    return [200, app];
});

export const NewApp = (props) => {
    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={NewAppDefaults}
        />
    );
};

export const KitchenSinkEditor = (props) => {
    const {
        loading,
        "Loading Error": loadingError,
        "Public App View": cosmeticOnly,
    } = props;

    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={!(loading || loadingError) && AppDescriptionMock}
            loading={loading}
            loadingError={loadingError && mockErrorResponse}
            cosmeticOnly={cosmeticOnly}
        />
    );
};

KitchenSinkEditor.argTypes = {
    loading: {
        control: {
            type: "boolean",
        },
    },
    "Loading Error": {
        control: {
            type: "boolean",
        },
    },
    "Public App View": {
        control: {
            type: "boolean",
        },
    },
};

export default { title: "Apps / Editor" };
