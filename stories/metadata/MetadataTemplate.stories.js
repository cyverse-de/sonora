import React from "react";

import MetadataTemplateView from "components/metadata/templates";
import MetadataTemplateListing from "components/metadata/templates/Listing";

import { mockAxios } from "../axiosMock";
import { DataCiteMetadata, MockMetadata } from "./MetadataMocks";
import {
    DataciteMetadataTemplate,
    NestedAttrMetadataTemplate,
    MockTemplateListing,
} from "./TemplateMocks";

const onClose = () => console.log("dialog closed.");
const updateMetadataFromTemplateView = (metadata, resolve, errorCallback) => {
    console.log(metadata);
    resolve(metadata);
};

mockAxios
    .onGet("/api/filesystem/metadata/templates")
    .reply(200, MockTemplateListing);

mockAxios.onGet("/api/ontology-lookup-service").reply((config) => {
    console.log("searchOLSTerms", config.url, config.params);

    return [
        200,
        {
            docs: [
                {
                    iri: "http://edamontology.org/data_0006",
                    label: "Data",
                    ontology_prefix: "EDAM",
                },
                {
                    iri: "http://edamontology.org/operation_2422",
                    label: "Data retrieval",
                    ontology_prefix: "EDAM",
                },
                {
                    iri: "http://edamontology.org/topic_3077",
                    label: "Data acquisition",
                    ontology_prefix: "EDAM",
                },
            ],
        },
    ];
});

mockAxios.onGet("/api/unified-astronomy-thesaurus").reply((config) => {
    console.log("searchAstroThesaurusTerms", config.url);

    return [
        200,
        {
            items: [
                {
                    iri: "http://astrothesaurus.org/uat/1512",
                    label: "Solar neutrons",
                },
                {
                    iri: "http://astrothesaurus.org/uat/1107",
                    label: "Neutron star cores",
                },
                {
                    iri: "http://astrothesaurus.org/uat/1108",
                    label: "Neutron stars",
                },
            ],
        },
    ];
});

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
            template={NestedAttrMetadataTemplate}
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
            template={NestedAttrMetadataTemplate}
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
            template={DataciteMetadataTemplate}
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
            template={DataciteMetadataTemplate}
            metadata={{}}
        />
    );
};

export default { title: "Metadata / Templates" };
