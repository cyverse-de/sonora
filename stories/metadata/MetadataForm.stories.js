import React, { Component } from "react";

import EditMetadata from "../../src/components/metadata/form";

const presenter = (logger) => ({
    setDiskResourceMetadata: (metadata, resolve, errorCallback) => {
        setTimeout(() => {
            logger("save metadata", metadata);
            resolve(metadata);
        }, 1500);
    },
    closeMetadataDialog: () => logger("dialog closed."),
    onSelectTemplateBtnSelected: (metadata) => {
        logger("view in templates", metadata);
    },
    onSaveMetadataToFileBtnSelected: () => logger("save to file selected."),
});

class EditMetadataTest extends Component {
    state = {
        loading: true,
    };

    componentDidMount() {
        setTimeout(() => this.setState({ loading: false }), 1500);
    }

    render() {
        const logger =
            this.props.logger ||
            ((metadata) => {
                console.log(metadata);
            });

        const metadata = {
            "irods-avus": [
                {
                    id: "1",
                    attr: "iRODS Attr 1",
                    value: "value1",
                    unit: "",
                },
                {
                    id: "2",
                    attr: "iRODS Attr 2",
                    value: "value2",
                    unit: "",
                },
                {
                    id: "3",
                    attr: "iRODS Attr 3",
                    value: "value3",
                    unit: "",
                },
            ],
            avus: [
                {
                    id: "1",
                    attr: "Integer Attr",
                    value: "",
                    unit: "unit1",
                    avus: [
                        {
                            id: "3",
                            attr: "attr3",
                            value: "value3",
                            unit: "unit3",
                            avus: [
                                {
                                    id: "5",
                                    attr: "attr5",
                                    value: "value5",
                                    unit: "unit5",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "2",
                    attr: "String Attr",
                    value: "value2",
                    unit: "unit2",
                    avus: [
                        {
                            id: "4",
                            attr: "attr4",
                            value: "value4",
                            unit: "unit4",
                        },
                    ],
                },
                {
                    id: "6",
                    attr: "String Attr",
                    value: "",
                    unit: "",
                },
            ],
        };

        return (
            <EditMetadata
                open
                editable
                loading={this.state.loading}
                presenter={presenter(logger)}
                targetResource={{ label: "Test Resource" }}
                metadata={this.state.loading ? null : metadata}
            />
        );
    }
}

class ViewMetadataTest extends Component {
    render() {
        const logger =
            this.props.logger ||
            ((metadata) => {
                console.log(metadata);
            });

        const metadata = {
            "irods-avus": [
                {
                    id: "1",
                    attr: "iRODS Attr 1",
                    value: "value1",
                    unit: "",
                },
                {
                    id: "2",
                    attr: "iRODS Attr 2",
                    value: "value2",
                    unit: "",
                },
                {
                    id: "3",
                    attr: "iRODS Attr 3",
                    value: "value3",
                    unit: "",
                },
            ],
            avus: [
                {
                    id: "1",
                    attr: "Public Data",
                    value: "",
                    unit: "unit1",
                    avus: [
                        {
                            id: "3",
                            attr: "attr3",
                            value: "value3",
                            unit: "unit3",
                            avus: [
                                {
                                    id: "5",
                                    attr: "attr5",
                                    value: "value5",
                                    unit: "unit5",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "2",
                    attr: "Read Only",
                    value: "value2",
                    unit: "unit2",
                    avus: [
                        {
                            id: "4",
                            attr: "attr4",
                            value: "value4",
                            unit: "unit4",
                        },
                    ],
                },
                {
                    id: "6",
                    attr: "Uneditable",
                    value: "",
                    unit: "",
                },
            ],
        };

        return (
            <EditMetadata
                open
                editable={false}
                targetResource={{ label: "Read-Only Resource" }}
                presenter={presenter(logger)}
                metadata={metadata}
                loading={false}
            />
        );
    }
}

class EditDataCiteMetadataTest extends Component {
    render() {
        const logger =
            this.props.logger ||
            ((metadata) => {
                console.log(metadata);
            });

        const metadata = {
            avus: [
                {
                    attr: "title",
                    value: "My test title",
                    unit: "",
                    avus: [
                        {
                            attr: "titleType",
                            value: "TranslatedTitle",
                            unit: "",
                        },
                        {
                            attr: "xml:lang",
                            value: "en-us",
                            unit: "",
                        },
                    ],
                },
                {
                    attr: "creator",
                    value: "Paul",
                    unit: "",
                    avus: [
                        {
                            attr: "affiliation",
                            value: "CyVerse",
                            unit: "",
                        },
                        {
                            attr: "nameIdentifier",
                            value: "0000000134596520",
                            unit: "",
                            avus: [
                                {
                                    attr: "nameIdentifierScheme",
                                    value: "ISNI",
                                    unit: "",
                                },
                                {
                                    attr: "schemeURI",
                                    value: "http://isni.org/isni/",
                                    unit: "",
                                },
                            ],
                        },
                    ],
                },
                {
                    attr: "contributor",
                    value: "Sriram",
                    unit: "",
                    avus: [
                        {
                            attr: "affiliation",
                            value: "CyVerse",
                            unit: "",
                        },
                        {
                            attr: "contributorType",
                            value: "DataCollector",
                            unit: "",
                        },
                        {
                            attr: "nameIdentifier",
                            value: "0000-0001-5432-1234",
                            unit: "",
                            avus: [
                                {
                                    attr: "nameIdentifierScheme",
                                    value: "ORCID",
                                    unit: "",
                                },
                                {
                                    attr: "schemeURI",
                                    value: "http://orcid.org/",
                                    unit: "",
                                },
                            ],
                        },
                    ],
                },
                {
                    attr: "publisher",
                    value: "CyVerse Data Commons",
                    unit: "",
                },
                {
                    attr: "publicationYear",
                    value: "2017",
                    unit: "",
                },
                {
                    attr: "resourceType",
                    value: "Dataset",
                    unit: "",
                    avus: [
                        {
                            attr: "resourceTypeGeneral",
                            value: "Software",
                            unit: "",
                        },
                    ],
                },
                {
                    attr: "description",
                    value: "My test description",
                    unit: "",
                    avus: [
                        {
                            attr: "descriptionType",
                            value: "Abstract",
                            unit: "",
                        },
                        {
                            attr: "xml:lang",
                            value: "en-us",
                            unit: "",
                        },
                    ],
                },
                {
                    attr: "subject",
                    value: "000 computer science",
                    unit: "",
                    avus: [
                        {
                            attr: "schemeURI",
                            value: "http://dewey.info/",
                            unit: "",
                        },
                        {
                            attr: "subjectScheme",
                            value: "dewey",
                            unit: "",
                        },
                        {
                            attr: "xml:lang",
                            value: "en-us",
                            unit: "",
                        },
                    ],
                },
                {
                    attr: "identifier",
                    value: "10.5072/example-full",
                    unit: "",
                    avus: [
                        {
                            attr: "identifierType",
                            value: "DOI",
                            unit: "",
                        },
                    ],
                },
                {
                    attr: "alternateIdentifier",
                    value:
                        "http://schema.datacite.org/schema/meta/kernel-3.1/example/datacite-example-full-v3.1.xml",
                    unit: "",
                    avus: [
                        {
                            attr: "alternateIdentifierType",
                            value: "URL",
                            unit: "",
                        },
                    ],
                },
                {
                    attr: "relatedIdentifier",
                    value: "arXiv:0706.0001",
                    unit: "",
                    avus: [
                        {
                            attr: "relatedIdentifierType",
                            value: "arXiv",
                            unit: "",
                        },
                        {
                            attr: "relationType",
                            value: "IsReviewedBy",
                            unit: "",
                        },
                    ],
                },
                {
                    attr: "rights",
                    value: "CC0",
                    unit: "",
                    avus: [
                        {
                            attr: "rightsURI",
                            value:
                                "http://creativecommons.org/publicdomain/zero/1.0/",
                            unit: "",
                        },
                    ],
                },
                {
                    attr: "geoLocation",
                    value: "",
                    unit: "",
                    avus: [
                        {
                            attr: "geoLocationPlace",
                            value: "Atlantic Ocean",
                            unit: "",
                        },
                        {
                            attr: "geoLocationPoint",
                            value: "",
                            unit: "",
                            avus: [
                                {
                                    attr: "pointLongitude",
                                    value: "-67.302",
                                    unit: "",
                                },
                                {
                                    attr: "pointLatitude",
                                    value: "31.233",
                                    unit: "",
                                },
                            ],
                        },
                        {
                            attr: "geoLocationBox",
                            value: "",
                            unit: "",
                            avus: [
                                {
                                    attr: "westBoundLongitude",
                                    value: "-71.032",
                                    unit: "",
                                },
                                {
                                    attr: "eastBoundLongitude",
                                    value: "-68.211",
                                    unit: "",
                                },
                                {
                                    attr: "southBoundLatitude",
                                    value: "41.090",
                                    unit: "",
                                },
                                {
                                    attr: "northBoundLatitude",
                                    value: "42.893",
                                    unit: "",
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        return (
            <EditMetadata
                open
                editable
                targetResource={{ label: "DataCite Resource" }}
                presenter={presenter(logger)}
                metadata={metadata}
                loading={false}
            />
        );
    }
}

const EmptyMetadataTest = (props) => {
    const logger =
        props.logger ||
        ((metadata) => {
            console.log(metadata);
        });

    return (
        <EditMetadata
            open
            editable
            targetResource={{ label: "Empty Metadata" }}
            presenter={presenter(logger)}
            metadata={{}}
            loading={false}
        />
    );
};

export {
    EditDataCiteMetadataTest,
    EditMetadataTest,
    EmptyMetadataTest,
    ViewMetadataTest,
};
