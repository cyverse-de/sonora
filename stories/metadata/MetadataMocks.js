export const MockMetadata = {
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
                    attr: "String Sub-Attr",
                    value: "value4",
                    unit: "unit4",
                    avus: [
                        {
                            id: "6",
                            attr: "Sub-String Sub-Attr",
                            value: "value6",
                            unit: "unit6",
                        },
                    ],
                },
            ],
        },
        {
            id: "7",
            attr: "String Attr",
            value: "",
            unit: "",
        },
        {
            id: "8",
            attr: "Timestamp Attr",
            value: "2016-09-22 18:20",
            unit: "",
        },
        {
            id: "9",
            attr: "UAT Ontology Term Attr",
            value: "Neutron star",
            unit: "",
        },
        {
            id: "10",
            attr: "OLS Ontology Term Attr",
            value: "Computational biology",
            unit: "",
        },
    ],
};

export const DataCiteMetadata = {
    avus: [
        {
            attr: "title",
            value: "My Test Title",
            unit: "",
            avus: [
                {
                    attr: "xml:lang",
                    value: "en-us",
                    unit: "",
                },
            ],
        },
        {
            attr: "title",
            value: "Test Subtitle",
            unit: "",
            avus: [
                {
                    attr: "titleType",
                    value: "Subtitle",
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
            value: "Paul S.",
            unit: "",
            avus: [
                {
                    attr: "affiliation",
                    value: "CyVerse",
                    unit: "",
                },
                {
                    attr: "nameIdentifier",
                    value: "0000-0002-3767-3466",
                    unit: "",
                    avus: [
                        {
                            attr: "nameIdentifierScheme",
                            value: "ORCID",
                            unit: "",
                        },
                        {
                            attr: "schemeURI",
                            value: "https://orcid.org/",
                            unit: "",
                        },
                    ],
                },
            ],
        },
        {
            attr: "contributor",
            value: "Sarah R.",
            unit: "",
            avus: [
                {
                    attr: "affiliation",
                    value: "CyVerse",
                    unit: "",
                },
                {
                    attr: "contributorType",
                    value: "ProjectLeader",
                    unit: "",
                },
                {
                    attr: "nameIdentifier",
                    value: "0000-0003-2305-7926",
                    unit: "",
                    avus: [
                        {
                            attr: "nameIdentifierScheme",
                            value: "ORCID",
                            unit: "",
                        },
                        {
                            attr: "schemeURI",
                            value: "https://orcid.org/",
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
            value: "2025",
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
            value: "https://schema.datacite.org/meta/kernel-4.2/example/datacite-example-full-v4.xml",
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
                    value: "http://creativecommons.org/publicdomain/zero/1.0/",
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
        {
            attr: "fundingReference",
            value: "",
            unit: "",
            avus: [
                {
                    attr: "funderName",
                    value: "NSF",
                    unit: "",
                },
                {
                    attr: "funderIdentifier",
                    value: "#DBI-0735191",
                    unit: "",
                    avus: [
                        {
                            attr: "funderIdentifierType",
                            value: "Other",
                            unit: "",
                        },
                    ],
                },
            ],
        },
        {
            attr: "version",
            value: "1.0.0-beta",
            unit: "",
        },
        {
            attr: "language",
            value: "en-us",
            unit: "",
        },
        {
            attr: "size",
            value: "1.21GB",
            unit: "",
        },
        {
            attr: "format",
            value: "application/json",
            unit: "",
        },
        {
            attr: "analysis_tool",
            value: "https://de.cyverse.org",
            unit: "",
        },
        {
            attr: "reuse_or_citation_conditions",
            value: "Open Source",
            unit: "",
        },
        {
            attr: "compressed_data",
            value: "false",
            unit: "",
        },
        {
            attr: "is_deprecated",
            value: "true",
            unit: "",
        },
    ],
};
