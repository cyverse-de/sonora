import React from "react";

import MetadataForm from "components/metadata/form";

import { MockMetadata, DataCiteMetadata } from "./MetadataMocks";

const setDiskResourceMetadata = (metadata, resolve, errorCallback) => {
    setTimeout(() => {
        console.log("save metadata", metadata);
        resolve(metadata);
    }, 1500);
};
const closeMetadataDialog = () => console.log("dialog closed.");
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
            open
            editable
            loading={loading}
            targetResource={{ label: "Test Resource" }}
            metadata={!loading && MockMetadata}
            setDiskResourceMetadata={setDiskResourceMetadata}
            closeMetadataDialog={closeMetadataDialog}
            onSelectTemplateBtnSelected={onSelectTemplateBtnSelected}
            onSaveMetadataToFileBtnSelected={onSaveMetadataToFileBtnSelected}
        />
    );
};

export const ReadOnlyMetadata = () => {
    return (
        <MetadataForm
            open
            editable={false}
            targetResource={{ label: "Read-Only Resource" }}
            metadata={MockMetadata}
            loading={false}
            setDiskResourceMetadata={setDiskResourceMetadata}
            closeMetadataDialog={closeMetadataDialog}
            onSelectTemplateBtnSelected={onSelectTemplateBtnSelected}
            onSaveMetadataToFileBtnSelected={onSaveMetadataToFileBtnSelected}
        />
    );
};

export const DataCiteMetadataView = () => {
    return (
        <MetadataForm
            open
            editable
            targetResource={{ label: "DataCite Resource" }}
            metadata={DataCiteMetadata}
            loading={false}
            setDiskResourceMetadata={setDiskResourceMetadata}
            closeMetadataDialog={closeMetadataDialog}
            onSelectTemplateBtnSelected={onSelectTemplateBtnSelected}
            onSaveMetadataToFileBtnSelected={onSaveMetadataToFileBtnSelected}
        />
    );
};

export const EmptyMetadata = () => {
    return (
        <MetadataForm
            open
            editable
            targetResource={{ label: "Empty Metadata" }}
            metadata={{}}
            loading={false}
            setDiskResourceMetadata={setDiskResourceMetadata}
            closeMetadataDialog={closeMetadataDialog}
            onSelectTemplateBtnSelected={onSelectTemplateBtnSelected}
            onSaveMetadataToFileBtnSelected={onSaveMetadataToFileBtnSelected}
        />
    );
};

export default { title: "Metadata" };
