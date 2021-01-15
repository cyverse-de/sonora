import React from "react";

import MetadataTemplateView from "components/metadata/templates";

import { DataCiteMetadata, MockMetadata } from "./MetadataMocks";
import {
    DataciteMetadataTemplate,
    NestedAttrMetadataTemplate,
} from "./TemplateMocks";

const presenter = {
    onSaveTemplate: (template, resolve, errorCallback) => {
        setTimeout(() => {
            console.log(template);
            resolve(template);
        }, 1500);
    },
    closeMetadataTemplateDialog: () => console.log("dialog closed."),
    updateMetadataFromTemplateView: (metadata, resolve, errorCallback) => {
        console.log(metadata);
        resolve(metadata);
    },
    searchOLSTerms: (inputValue, loaderSettings, callback) => {
        setTimeout(() => {
            callback({
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
            });
        }, 1000);
    },
    searchAstroThesaurusTerms: (inputValue, callback) => {
        setTimeout(() => {
            callback({
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
            });
        }, 1000);
    },
};

export const NestedTemplateView = () => {
    return (
        <MetadataTemplateView
            open
            writable
            presenter={presenter}
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
            presenter={presenter}
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
            presenter={presenter}
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
            presenter={presenter}
            template={DataciteMetadataTemplate}
            metadata={{}}
        />
    );
};

export default { title: "Metadata / Templates" };
