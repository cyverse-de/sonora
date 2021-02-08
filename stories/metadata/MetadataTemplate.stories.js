import React from "react";

import MetadataTemplateView from "components/metadata/templates";
import MetadataTemplateListing from "components/metadata/templates/Listing";

import { DataCiteMetadata, MockMetadata } from "./MetadataMocks";
import {
    DataciteMetadataTemplate,
    NestedAttrMetadataTemplate,
    initMockAxiosTemplateEndpoints,
} from "./TemplateMocks";

initMockAxiosTemplateEndpoints();

const onClose = () => console.log("dialog closed.");
const updateMetadataFromTemplateView = (metadata, resolve, errorCallback) => {
    console.log(metadata);
    resolve(metadata);
};

export const TemplateListing = () => {
    return (
        <MetadataTemplateListing
            open
            baseId={"MockMetadata"}
            onClose={onClose}
            onSelectTemplate={(templateId) =>
                console.log("Selected Template", templateId)
            }
        />
    );
};

export const NestedTemplateView = () => {
    return (
        <MetadataTemplateView
            open
            writable
            updateMetadataFromTemplateView={updateMetadataFromTemplateView}
            onClose={onClose}
            templateId={NestedAttrMetadataTemplate.id}
            metadata={MockMetadata}
        />
    );
};

export const NestedTemplateReadOnlyView = () => {
    const avus = [
        ...MockMetadata.avus,
        {
            id: "11",
            attr: "Enum Attr",
            value: "choice 3",
            unit: "",
        },
        {
            id: "12",
            attr: "Boolean Attr",
            value: "true",
            unit: "",
        },
    ];

    return (
        <MetadataTemplateView
            open
            updateMetadataFromTemplateView={updateMetadataFromTemplateView}
            onClose={onClose}
            templateId={NestedAttrMetadataTemplate.id}
            metadata={{
                ...MockMetadata,
                avus,
            }}
        />
    );
};

export const DataCiteMetadataTemplate = () => {
    return (
        <MetadataTemplateView
            open
            writable
            updateMetadataFromTemplateView={updateMetadataFromTemplateView}
            onClose={onClose}
            templateId={DataciteMetadataTemplate.id}
            metadata={DataCiteMetadata}
        />
    );
};

export const DataCiteMetadataTemplateNoValues = () => {
    return (
        <MetadataTemplateView
            open
            writable
            updateMetadataFromTemplateView={updateMetadataFromTemplateView}
            onClose={onClose}
            templateId={DataciteMetadataTemplate.id}
            metadata={{}}
        />
    );
};

export default { title: "Metadata / Templates" };
