import React from "react";

import MetadataForm from "components/metadata/form";

import { mockAxios } from "../axiosMock";
import { initMockAxiosFileFolderSelector } from "../data/DataMocks";

import { MockMetadata, DataCiteMetadata } from "./MetadataMocks";

const testResourcePath = "/iplant/home/ipcdev/test/metadataResource";
const errorResponse = {
    error_code: "ERR_FALSE_ALARM",
    reason: "Nothing to see here... Please try again!",
};

initMockAxiosFileFolderSelector();

mockAxios
    .onGet("/api/filesystem/data-cite-resource/metadata")
    .reply((config) => {
        console.log("getMetadata", config.url);

        return [200, DataCiteMetadata];
    });

mockAxios.onGet("/api/filesystem/no-metadata/metadata").reply((config) => {
    console.log("getMetadata", config.url);

    return [200, {}];
});

mockAxios.onGet(/\/api\/filesystem\/.*\/metadata/).reply((config) => {
    console.log("getMetadata", config.url);

    return [200, MockMetadata];
});

mockAxios.onPost(/\/api\/filesystem\/.*\/metadata\/save/).replyOnce(400, {
    error_code: "ERR_EXISTS",
    reason: "That file already exists!",
});
mockAxios.onPost(/\/api\/filesystem\/.*\/metadata\/save/).reply((config) => {
    console.log("Save Metadata", config.url, config.data);
    const req = JSON.parse(config.data);

    return [200, { id: "fake-id", path: req?.dest || testResourcePath }];
});

mockAxios
    .onPost(/\/api\/filesystem\/.*\/metadata/)
    .replyOnce(500, errorResponse);
mockAxios.onPost(/\/api\/filesystem\/.*\/metadata/).reply((config) => {
    console.log("Set Metadata", config.url, config.data);

    return [200, { path: testResourcePath, user: "ipcdev" }];
});

export const MetadataView = () => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, [setLoading]);

    return (
        <MetadataForm
            loading={loading}
            targetResource={
                loading
                    ? null
                    : {
                          id: "disk-resource-id",
                          path: testResourcePath,
                          label: "Test Resource",
                          permission: "own",
                      }
            }
        />
    );
};

export const ReadOnlyMetadata = () => {
    return (
        <MetadataForm
            targetResource={{
                id: "disk-resource-id",
                path: testResourcePath,
                label: "Read-Only Resource",
                permission: "read",
            }}
            loading={false}
        />
    );
};

export const DataCiteMetadataView = () => {
    return (
        <MetadataForm
            targetResource={{
                id: "data-cite-resource",
                path: testResourcePath,
                label: "DataCite Resource",
                permission: "write",
            }}
            loading={false}
        />
    );
};

export const EmptyMetadata = () => {
    return (
        <MetadataForm
            targetResource={{
                id: "no-metadata",
                path: testResourcePath,
                label: "Empty Metadata",
                permission: "own",
            }}
            loading={false}
        />
    );
};

export default { title: "Metadata" };
