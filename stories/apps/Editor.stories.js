import React from "react";

import { mockAxios, mockErrorResponse, errorResponseJSON } from "../axiosMock";

import {
    AppDescriptionMock,
    FileInfoTypesMock,
    fileStatResp,
} from "./AppDescriptionMocks";

import { initMockAxiosFileFolderSelector } from "../data/DataMocks";
import { initMockAxiosReferenceGenomeListing } from "../apps/launch/data/ReferenceGenomeListing";
import { listing as ToolListing } from "../tools/ToolMocks";

import AppEditor from "components/apps/editor";
import ids from "components/apps/editor/ids";
import NewAppDefaults from "components/apps/editor/NewAppDefaults";

const initMockAxiosForAppEditor = () => {
    mockAxios.reset();

    initMockAxiosFileFolderSelector();
    initMockAxiosReferenceGenomeListing();

    mockAxios
        .onGet("/api/apps/elements/info-types")
        .reply(200, FileInfoTypesMock);

    mockAxios.onPost("/api/filesystem/stat").replyOnce(404, {
        error_code: "ERR_DOES_NOT_EXIST",
        reason: "Not Found!",
    });
    mockAxios.onPost("/api/filesystem/stat").replyOnce(500, errorResponseJSON);
    mockAxios.onPost("/api/filesystem/stat").reply((config) => {
        const req = JSON.parse(config.data);
        const { paths } = fileStatResp;

        return [
            200,
            {
                ...fileStatResp,
                paths: { ...paths, [req.paths[0]]: Object.values(paths)[0] },
            },
        ];
    });

    mockAxios.onGet(/\/api\/tools.*/).reply(200, ToolListing);

    mockAxios.onPost(/\/api\/apps\/.*/).reply((config) => {
        const app = JSON.parse(config.data);
        console.log("Save New App", config.url, app);

        const resp = { ...app, id: app.id || "new-uuid" };

        // This will allow the view to switch to the app update view after a
        // successful save.
        if (AppDescriptionMock.versions) {
            // This trick will allow the new version label to be selected in the
            // version selector in the app update view.
            resp.versions = [...AppDescriptionMock.versions];
            resp.version_id = AppDescriptionMock.versions[0].version_id;
            resp.versions[0] = {
                ...AppDescriptionMock.versions[0],
                version: app.version,
            };
        } else {
            resp.version_id = "new-version-uuid";
        }

        return [200, resp];
    });

    mockAxios.onPut(/\/api\/apps\/.*/).reply((config) => {
        const app = JSON.parse(config.data);
        console.log("Update App", config.url, app);

        if (AppDescriptionMock.versions) {
            // This trick will allow the new version label to be selected in the
            // version selector in the app update view.
            app.versions = [...AppDescriptionMock.versions];
            app.version_id = AppDescriptionMock.versions[0].version_id;
            app.versions[0] = {
                ...AppDescriptionMock.versions[0],
                version: app.version,
            };
        }

        return [200, app];
    });

    mockAxios.onPatch(/\/api\/apps\/.*/).reply((config) => {
        const app = JSON.parse(config.data);
        console.log("Update App Labels", config.url, app);

        return [200, app];
    });
};

export const NewApp = (props) => {
    initMockAxiosForAppEditor();

    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={NewAppDefaults}
        />
    );
};

export const KitchenSinkEditor = (props) => {
    const { loading, loadingError, cosmeticOnly } = props;

    initMockAxiosForAppEditor();

    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={!(loading || loadingError) && AppDescriptionMock}
            loading={loading}
            loadingError={loadingError && mockErrorResponse}
            cosmeticOnly={!!cosmeticOnly}
        />
    );
};

KitchenSinkEditor.args = {
    loading: false,
    loadingError: false,
    cosmeticOnly: false,
};

KitchenSinkEditor.argTypes = {
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
    cosmeticOnly: {
        name: "Public App View",
        control: {
            type: "boolean",
        },
    },
};

export const KitchenSinkNewVersionEditor = () => {
    initMockAxiosForAppEditor();

    const { version_id, ...appDescription } = AppDescriptionMock;

    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={appDescription}
        />
    );
};

export default { title: "Apps / Editor" };
