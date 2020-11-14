import React from "react";

import MetadataForm from "components/metadata/form";

import { mockAxios } from "../axiosMock";

import { MockMetadata, DataCiteMetadata } from "./MetadataMocks";

const errorResponse = {
    error_code: "ERR_FALSE_ALARM",
    reason: "Nothing to see here... Please try again!",
};

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

mockAxios
    .onPost(/\/api\/filesystem\/.*\/metadata/)
    .replyOnce(500, errorResponse);
mockAxios.onPost(/\/api\/filesystem\/.*\/metadata/).reply((config) => {
    console.log("Set Metadata", config.url, config.data);

    return [200, { path: "/fake/data/path", user: "ipcdev" }];
});

const onSelectTemplateBtnSelected = (metadata) => {
    console.log("view in templates", metadata);
};
const onSaveMetadataToFileBtnSelected = () =>
    console.log("save to file selected.");

export const MetadataView = () => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => setLoading(false), 1500);
    }, [setLoading]);

    return (
        <MetadataForm
            editable
            loading={loading}
            targetResource={
                loading
                    ? null
                    : {
                          id: "disk-resource-id",
                          label: "Test Resource",
                      }
            }
            onSelectTemplateBtnSelected={onSelectTemplateBtnSelected}
            onSaveMetadataToFileBtnSelected={onSaveMetadataToFileBtnSelected}
        />
    );
};

export const ReadOnlyMetadata = () => {
    return (
        <MetadataForm
            editable={false}
            targetResource={{
                id: "disk-resource-id",
                label: "Read-Only Resource",
            }}
            loading={false}
            onSelectTemplateBtnSelected={onSelectTemplateBtnSelected}
            onSaveMetadataToFileBtnSelected={onSaveMetadataToFileBtnSelected}
        />
    );
};

export const DataCiteMetadataView = () => {
    return (
        <MetadataForm
            editable
            targetResource={{
                id: "data-cite-resource",
                label: "DataCite Resource",
            }}
            loading={false}
            onSelectTemplateBtnSelected={onSelectTemplateBtnSelected}
            onSaveMetadataToFileBtnSelected={onSaveMetadataToFileBtnSelected}
        />
    );
};

export const EmptyMetadata = () => {
    return (
        <MetadataForm
            editable
            targetResource={{ id: "no-metadata", label: "Empty Metadata" }}
            loading={false}
            onSelectTemplateBtnSelected={onSelectTemplateBtnSelected}
            onSaveMetadataToFileBtnSelected={onSaveMetadataToFileBtnSelected}
        />
    );
};

export default { title: "Metadata" };
