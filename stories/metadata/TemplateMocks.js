import { mockAxios } from "../axiosMock";

const DOI_DATACITE_TEMPLATE_ID = "ae75bc42-45ec-11e5-801c-43dab0dfe096";

export const NestedAttrMetadataTemplate = {
    id: "91334572-5e13-11e8-acc0-f64e9b87c109",
    name: "Test Metadata Template",
    description: "Template Description",
    deleted: false,
    created_on: "2018-05-21T12:00:00Z",
    modified_on: "2018-05-25T19:23:42Z",
    attributes: [
        {
            name: "String Attr",
            description: "String Description",
            type: "String",
            required: true,
            attributes: [
                {
                    name: "String Sub-Attr",
                    description: "String Description",
                    type: "String",
                    required: true,
                    attributes: [
                        {
                            name: "Sub-String Sub-Attr",
                            description: "String Description",
                            type: "String",
                            required: true,
                        },
                    ],
                },
                {
                    name: "URL/URI Sub-Attr",
                    description: "URL/URI Description",
                    type: "URL/URI",
                    required: false,
                },
            ],
        },
        {
            name: "Timestamp Attr",
            description: "Timestamp Description",
            type: "Timestamp",
            required: false,
        },
        {
            name: "Boolean Attr",
            description: "Boolean Description",
            type: "Boolean",
            required: false,
        },
        {
            name: "Number Attr",
            description: "Number Description",
            type: "Number",
            required: false,
        },
        {
            name: "Integer Attr",
            description: "Integer Description",
            type: "Integer",
            required: true,
            attributes: [
                {
                    name: "Int Sub-Attr",
                    description: "Int Description",
                    type: "String",
                    required: false,
                    attributes: [
                        {
                            name: "Int Sub-Sub-Attr",
                            description: "Int Description",
                            type: "Integer",
                            required: false,
                        },
                    ],
                },
            ],
        },
        {
            name: "Multiline Text Attr",
            description: "Multiline Text Description",
            type: "Multiline Text",
            required: false,
        },
        {
            name: "URL/URI Attr",
            description: "URL/URI Description",
            type: "URL/URI",
            required: false,
        },
        {
            name: "Enum Attr",
            description: "Enum Description",
            type: "Enum",
            required: false,
            values: [
                {
                    value: "choice 1",
                    is_default: false,
                },
                {
                    value: "choice 2",
                    is_default: true,
                },
                {
                    value: "choice 3",
                    is_default: false,
                },
            ],
            attributes: [
                {
                    name: "Required Enum",
                    description:
                        "A required enum with only 1 option creates a pre-filled, uneditable value.",
                    type: "Enum",
                    required: true,
                    values: [
                        {
                            value: "Forced Selection",
                            is_default: true,
                        },
                    ],
                },
            ],
        },
        {
            name: "OLS Ontology Term Attr",
            description: "OLS Ontology Term Description",
            type: "OLS Ontology Term",
            required: false,
            settings: {
                allChildrenOf: [],
                childrenOf: [],
                ontology: ["edam"],
                type: "CLASS",
            },
        },
        {
            name: "UAT Ontology Term Attr",
            description: "UAT Ontology",
            type: "UAT Ontology Term",
            required: false,
        },
    ],
};

// This can be updated from the template JSON in production, which can be fetched with a command like the following
// (assuming the metadata service is port-forwarded to 31331):
// curl -X GET --header 'Accept: application/json' 'http://localhost:31331/templates/ae75bc42-45ec-11e5-801c-43dab0dfe096?user=ipctest' | jq 'def attrs: . | {id: .id, name: .name, description: .description, required: .required?, type: .type, values: .values?, attributes: [.attributes[]? | attrs]} | if .values then . else del(.values) end | if (.attributes | length) > 0 then . else del(.attributes) end; {id: .id, name: .name, description: .description, deleted: false, attributes: [.attributes[] | attrs]}'
export const DataciteMetadataTemplate = {
    id: DOI_DATACITE_TEMPLATE_ID,
    name: "DOI Request - DataCite 4.2",
    description:
        "DataCite 4.2 metadata template for submissions to the DataCite API and for Local Contexts Notices and Labels.",
    deleted: false,
    attributes: [
        {
            id: "5e0c923a-7415-11e8-8326-008cfa5ae621",
            name: "title",
            description:
                "A name or title by which the dataset or resource is known.",
            required: true,
            type: "String",
            attributes: [
                {
                    id: "f8043aec-b884-11e8-a32c-f64e9b87c109",
                    name: "titleType",
                    description:
                        "Complete this attribute only if you are adding a second title.",
                    required: false,
                    type: "Enum",
                    values: [
                        {
                            id: "3e8bd7ac-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "AlternativeTitle",
                        },
                        {
                            id: "3e8c8cb0-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Subtitle",
                        },
                        {
                            id: "3e8d3782-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "TranslatedTitle",
                        },
                        {
                            id: "3e8e0bc6-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Other",
                        },
                    ],
                },
                {
                    id: "f808ce18-b884-11e8-a32c-f64e9b87c109",
                    name: "xml:lang",
                    description:
                        "Use default value of US English for primary title. If you add additional titles in other languages, you may change this value for those titles.",
                    required: false,
                    type: "String",
                },
            ],
        },
        {
            id: "5e0f2ed2-7415-11e8-8326-008cfa5ae621",
            name: "creator",
            description:
                "The main researcher involved in producing the data, or the lead author of the publication in priority order. May be a corporate/institutional or personal name. Additional Creator fields may be added. Use the Contributor field to add names of co-contributors.",
            required: true,
            type: "String",
            attributes: [
                {
                    id: "5e129e64-7415-11e8-8326-008cfa5ae621",
                    name: "nameIdentifier",
                    description:
                        "ORCID of Creator, if known. ORCID provides a persistent digital identifier that distinguishes you from every other researcher. See DOI FAQ page.",
                    required: false,
                    type: "String",
                    attributes: [
                        {
                            id: "5e143ada-7415-11e8-8326-008cfa5ae621",
                            name: "nameIdentifierScheme",
                            description: "Set to ORCID by default.",
                            required: true,
                            type: "Enum",
                            values: [
                                {
                                    id: "5e1595a6-7415-11e8-8326-008cfa5ae621",
                                    is_default: true,
                                    value: "ORCID",
                                },
                            ],
                        },
                        {
                            id: "f82ee9a4-b884-11e8-a32c-f64e9b87c109",
                            name: "schemeURI",
                            description: "",
                            required: false,
                            type: "URL/URI",
                        },
                    ],
                },
                {
                    id: "5e10ea38-7415-11e8-8326-008cfa5ae621",
                    name: "affiliation",
                    description:
                        "The organizational or institutional affiliation of the creator.",
                    required: true,
                    type: "String",
                },
            ],
        },
        {
            id: "5e165c7a-7415-11e8-8326-008cfa5ae621",
            name: "publisher",
            description: "Publisher of the dataset or resource.",
            required: true,
            type: "Enum",
            values: [
                {
                    id: "5e1785c8-7415-11e8-8326-008cfa5ae621",
                    is_default: true,
                    value: "CyVerse Data Commons",
                },
            ],
        },
        {
            id: "5e183252-7415-11e8-8326-008cfa5ae621",
            name: "publicationYear",
            description:
                "Year the DOI is issued. Leave blank. Will be filled in when DOI is issued.",
            required: false,
            type: "String",
        },
        {
            id: "d7817198-7416-11e8-a7d5-008cfa5ae621",
            name: "resourceType",
            description:
                "A very brief, preferably one to three word, description of the type of resource for which you are requesting a DOI. This should be more specific than resourceTypeGeneral.",
            required: true,
            type: "String",
            attributes: [
                {
                    id: "f83f1bc6-b884-11e8-a32c-f64e9b87c109",
                    name: "resourceTypeGeneral",
                    description: "Select from list. ",
                    required: true,
                    type: "Enum",
                    values: [
                        {
                            id: "3ecc804a-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Audiovisual",
                        },
                        {
                            id: "3ecd3486-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Collection",
                        },
                        {
                            id: "3ecde9a8-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "DataPaper",
                        },
                        {
                            id: "3ece915a-c8fe-11e8-add7-5a03816fc427",
                            is_default: true,
                            value: "Dataset",
                        },
                        {
                            id: "3ecf36fa-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Event",
                        },
                        {
                            id: "3ecfdb96-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Image",
                        },
                        {
                            id: "3ed08654-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "InteractiveResource",
                        },
                        {
                            id: "3ed24d0e-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Model",
                        },
                        {
                            id: "3ed2fb82-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "PhysicalObject",
                        },
                        {
                            id: "3ed422be-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Service",
                        },
                        {
                            id: "3ed4bfa8-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Software",
                        },
                        {
                            id: "3ed5637c-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Sound",
                        },
                        {
                            id: "3ed603fe-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Text",
                        },
                        {
                            id: "3ed6b970-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Workflow",
                        },
                        {
                            id: "3ed768c0-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Other",
                        },
                    ],
                },
            ],
        },
        {
            id: "d782bbe8-7416-11e8-a7d5-008cfa5ae621",
            name: "contributor",
            description:
                "An institution or person responsible for collecting, managing, distributing, or otherwise contributing to the development of the resource. If more than one, add rows for contributorName and contributorType under User Metadata.",
            required: false,
            type: "String",
            attributes: [
                {
                    id: "d783f6b6-7416-11e8-a7d5-008cfa5ae621",
                    name: "contributorType",
                    description: "Select a role for the contributor.",
                    required: true,
                    type: "Enum",
                    values: [
                        {
                            id: "d785092a-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "ContactPerson",
                        },
                        {
                            id: "d7855d26-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "DataCollector",
                        },
                        {
                            id: "d785b032-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "DataCurator",
                        },
                        {
                            id: "d7860190-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "DataManager",
                        },
                        {
                            id: "d78652b2-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "Distributor",
                        },
                        {
                            id: "d786a334-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "Editor",
                        },
                        {
                            id: "d786ef06-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "Funder",
                        },
                        {
                            id: "d7873b46-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "HostingInstitution",
                        },
                        {
                            id: "d7879532-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "Producer",
                        },
                        {
                            id: "d787eed8-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "ProjectLeader",
                        },
                        {
                            id: "d7883eba-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "ProjectManager",
                        },
                        {
                            id: "d78888a2-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "ProjectMember",
                        },
                        {
                            id: "d788d3d4-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "RegistrationAgency",
                        },
                        {
                            id: "d7892140-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "RegistrationAuthority",
                        },
                        {
                            id: "d7896eca-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "RelatedPerson",
                        },
                        {
                            id: "d789c370-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "Researcher",
                        },
                        {
                            id: "d78a17f8-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "ResearchGroup",
                        },
                        {
                            id: "d78a671c-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "RightsHolder",
                        },
                        {
                            id: "d78ab32a-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "Sponsor",
                        },
                        {
                            id: "d78b0460-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: " Supervisor",
                        },
                        {
                            id: "d78b547e-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "WorkPackageLeader",
                        },
                        {
                            id: "d78ba208-7416-11e8-a7d5-008cfa5ae621",
                            is_default: false,
                            value: "Other",
                        },
                    ],
                },
                {
                    id: "f8584e48-b884-11e8-a32c-f64e9b87c109",
                    name: "nameIdentifier",
                    description:
                        "ORCID of Contributor, if known. ORCID provides a persistent digital identifier that distinguishes the contributor from every other researcher. See DOI FAQ page.",
                    required: false,
                    type: "String",
                    attributes: [
                        {
                            id: "f85afc10-b884-11e8-a32c-f64e9b87c109",
                            name: "nameIdentifierScheme",
                            description: "",
                            required: true,
                            type: "Enum",
                            values: [
                                {
                                    id: "f85ca632-b884-11e8-a32c-f64e9b87c109",
                                    is_default: true,
                                    value: "ORCID",
                                },
                            ],
                        },
                        {
                            id: "f85e5608-b884-11e8-a32c-f64e9b87c109",
                            name: "schemeURI",
                            description: "",
                            required: false,
                            type: "Enum",
                            values: [
                                {
                                    id: "916e880a-edbd-11e8-9bca-008cfa5ae621",
                                    is_default: true,
                                    value: "https://orcid.org/",
                                },
                            ],
                        },
                    ],
                },
                {
                    id: "f84604ae-b884-11e8-a32c-f64e9b87c109",
                    name: "affiliation",
                    description:
                        "The organizational or institutional affiliation of the contributor.",
                    required: false,
                    type: "String",
                },
            ],
        },
        {
            id: "b2aa45a4-7419-11e8-ad87-008cfa5ae621",
            name: "description",
            description:
                "A description of the dataset or resource and how to use it. Generally not the same as the abstract of the project or corresponding publication.",
            required: true,
            type: "String",
            attributes: [
                {
                    id: "b2abb1dc-7419-11e8-ad87-008cfa5ae621",
                    name: "descriptionType",
                    description:
                        "You must provide an Abstract. If you want to include any of the other description types, please add another Description element to your metadata.",
                    required: true,
                    type: "Enum",
                    values: [
                        {
                            id: "b2accf72-7419-11e8-ad87-008cfa5ae621",
                            is_default: true,
                            value: "Abstract",
                        },
                        {
                            id: "4864272a-cb38-11e8-b1fb-5a03816fc427",
                            is_default: false,
                            value: "Methods",
                        },
                        {
                            id: "4864fc2c-cb38-11e8-b1fb-5a03816fc427",
                            is_default: false,
                            value: "SeriesInformation",
                        },
                        {
                            id: "4865bb76-cb38-11e8-b1fb-5a03816fc427",
                            is_default: false,
                            value: "TableOfContents",
                        },
                        {
                            id: "48666d6e-cb38-11e8-b1fb-5a03816fc427",
                            is_default: false,
                            value: "TechnicalInfo",
                        },
                        {
                            id: "48675300-cb38-11e8-b1fb-5a03816fc427",
                            is_default: false,
                            value: "Other",
                        },
                    ],
                },
                {
                    id: "f8694464-b884-11e8-a32c-f64e9b87c109",
                    name: "xml:lang",
                    description:
                        "Set to US English by default. If you add an additional description in another language, you may change this value.",
                    required: false,
                    type: "Enum",
                    values: [
                        {
                            id: "f86adaae-b884-11e8-a32c-f64e9b87c109",
                            is_default: true,
                            value: "en-us",
                        },
                    ],
                },
            ],
        },
        {
            id: "d78c4456-7416-11e8-a7d5-008cfa5ae621",
            name: "subject",
            description:
                "Subject, keyword, classification code, or key phrase describing the resource. Use a separate field for each subject. Recommend adding at least 3 subjects/keywords.",
            required: true,
            type: "String",
            attributes: [
                {
                    id: "f874d46e-b884-11e8-a32c-f64e9b87c109",
                    name: "subjectScheme",
                    description: "",
                    required: false,
                    type: "String",
                },
                {
                    id: "f8712bc0-b884-11e8-a32c-f64e9b87c109",
                    name: "schemeURI",
                    description: "",
                    required: false,
                    type: "URL/URI",
                },
                {
                    id: "f878b318-b884-11e8-a32c-f64e9b87c109",
                    name: "xml:lang",
                    description: "",
                    required: false,
                    type: "Enum",
                    values: [
                        {
                            id: "f87af984-b884-11e8-a32c-f64e9b87c109",
                            is_default: true,
                            value: "en-us",
                        },
                    ],
                },
            ],
        },
        {
            id: "732f12fc-7418-11e8-ad87-008cfa5ae621",
            name: "identifier",
            description: "Leave blank. Will be filled in after DOI is issued",
            required: false,
            type: "String",
            attributes: [
                {
                    id: "73308b14-7418-11e8-ad87-008cfa5ae621",
                    name: "identifierType",
                    description: "DOI is the only option",
                    required: true,
                    type: "Enum",
                    values: [
                        {
                            id: "7331cdf8-7418-11e8-ad87-008cfa5ae621",
                            is_default: true,
                            value: "DOI",
                        },
                    ],
                },
            ],
        },
        {
            id: "2a253512-741a-11e8-ad87-008cfa5ae621",
            name: "analysis_tool",
            description:
                "Add a link (URL) to a tool that can be used with this datasets, such as a DE app or Atmosphere image.",
            required: false,
            type: "URL/URI",
        },
        {
            id: "b2b4adfa-7419-11e8-ad87-008cfa5ae621",
            name: "rights",
            description:
                "All CyVerse Curated Data in the Data Commons is open access. You can choose between ODC PDDL for non-copyrightable materials (i.e., data only) or CC0 for copyrightable material (Workflows, White Papers, Project Documents).\nMore information is available at https://cyverse.atlassian.net/wiki/spaces/DC/pages/241867502/Permanent+Identifier+FAQs#PermanentIdentifierFAQs-WhichlicensecanIusetopublishmydata%3F\nIf you need a different license because of prior restrictions on your data, please contact us.",
            required: true,
            type: "Enum",
            values: [
                {
                    id: "907ea31e-741c-11e8-ad87-008cfa5ae621",
                    is_default: false,
                    value: "CC0",
                },
                {
                    id: "b2b5f624-7419-11e8-ad87-008cfa5ae621",
                    is_default: true,
                    value: "ODC PDDL",
                },
            ],
            attributes: [
                {
                    id: "f894afb4-b884-11e8-a32c-f64e9b87c109",
                    name: "rightsURI",
                    description: "",
                    required: false,
                    type: "URL/URI",
                },
            ],
        },
        {
            id: "ad9e41bc-94ae-11ee-b224-62d47aced14b",
            name: "LocalContexts",
            description:
                "From https://localcontexts.org:\nLocal Contexts is a global initiative that supports Indigenous communities with tools that can reassert cultural authority in heritage collections and data. By focusing on Indigenous Cultural and Intellectual Property and Indigenous Data Sovereignty, Local Contexts helps Indigenous communities repatriate knowledge and gain control over how data is collected, managed, displayed, accessed, and used in the future.\n\nUse this field for the Local Contexts Rights label or notice text.\nSee the DataCite guide on these metadata fields for some examples: https://support.datacite.org/docs/local-contexts-notices-and-labels\nNote that notices should use the exact text from its landing page. For more information on Notices see https://localcontexts.org/notices/aboutnotices/",
            required: false,
            type: "String",
            attributes: [
                {
                    id: "ada034a4-94ae-11ee-b224-62d47aced14b",
                    name: "rightsURI",
                    description:
                        "The URL of the project in the Local Contexts hub.",
                    required: true,
                    type: "URL/URI",
                },
                {
                    id: "ada1e006-94ae-11ee-b224-62d47aced14b",
                    name: "rightsIdentifier",
                    description:
                        "The identifier of the specific Notice or Label being applied.\nIf referring to the entire project, leave blank.\nFor more information on Notices, see https://localcontexts.org/notices/aboutnotices/\nFor more information on TK Lables, see https://localcontexts.org/labels/traditional-knowledge-labels/\nFor more information on BC Lables, see https://localcontexts.org/labels/biocultural-labels/",
                    required: false,
                    type: "Enum",
                    values: [
                        {
                            id: "ada2f25c-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-Notice",
                        },
                        {
                            id: "ada36be2-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-Notice",
                        },
                        {
                            id: "ada3d6a4-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "Attribution-Incomplete",
                        },
                        {
                            id: "ada43dec-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "Open-To-Collaborate",
                        },
                        {
                            id: "ada4aa5c-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-A",
                        },
                        {
                            id: "ada5025e-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-CL",
                        },
                        {
                            id: "ada5aede-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-F",
                        },
                        {
                            id: "ada60a96-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-MC",
                        },
                        {
                            id: "ada66f36-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-CV",
                        },
                        {
                            id: "ada6c454-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-CR",
                        },
                        {
                            id: "ada72bba-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-V",
                        },
                        {
                            id: "ada794c4-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-NV",
                        },
                        {
                            id: "ada80148-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-S",
                        },
                        {
                            id: "ada86872-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-WG",
                        },
                        {
                            id: "ada8d5be-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-MG",
                        },
                        {
                            id: "ada96e84-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-MR",
                        },
                        {
                            id: "ada9de8c-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-WR",
                        },
                        {
                            id: "adaa3ecc-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-CS",
                        },
                        {
                            id: "adaaa0b0-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-SS",
                        },
                        {
                            id: "adab0276-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-OC",
                        },
                        {
                            id: "adab60f4-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-NC",
                        },
                        {
                            id: "adabc080-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-CO",
                        },
                        {
                            id: "adac2232-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-O",
                        },
                        {
                            id: "adac7f2a-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "TK-CB",
                        },
                        {
                            id: "adace49c-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-P",
                        },
                        {
                            id: "adad3f46-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-MC",
                        },
                        {
                            id: "adadb43a-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-CL",
                        },
                        {
                            id: "adae1af6-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-CV",
                        },
                        {
                            id: "adae7780-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-CNV",
                        },
                        {
                            id: "adaef4e4-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-R",
                        },
                        {
                            id: "adaf534e-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-CB",
                        },
                        {
                            id: "adafb276-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-OC",
                        },
                        {
                            id: "adb01676-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-O",
                        },
                        {
                            id: "adb07b7a-94ae-11ee-b224-62d47aced14b",
                            is_default: false,
                            value: "BC-NC",
                        },
                    ],
                },
                {
                    id: "adb1a9a0-94ae-11ee-b224-62d47aced14b",
                    name: "rightsIdentifierScheme",
                    description: "",
                    required: true,
                    type: "Enum",
                    values: [
                        {
                            id: "adb3011a-94ae-11ee-b224-62d47aced14b",
                            is_default: true,
                            value: "Local Contexts",
                        },
                    ],
                },
                {
                    id: "adb43a62-94ae-11ee-b224-62d47aced14b",
                    name: "schemeURI",
                    description: "",
                    required: true,
                    type: "Enum",
                    values: [
                        {
                            id: "adb56162-94ae-11ee-b224-62d47aced14b",
                            is_default: true,
                            value: "https://localcontexts.org",
                        },
                    ],
                },
            ],
        },
        {
            id: "52b91254-74b1-11e8-b2bf-008cfa5ae621",
            name: "version",
            description:
                "The version number of the resource. Suggested practice: track major_version.minor_version. Register a new identifier for a major version change. Contact doi@cyverse.org if you need help determining which are major vs. minor versions. ",
            required: false,
            type: "String",
        },
        {
            id: "730d04be-7418-11e8-ad87-008cfa5ae621",
            name: "alternateIdentifier",
            description:
                "An identifier or identifiers other than the primary Identifier applied to the resource being registered. This may be any alphanumeric string which is unique within its domain of issue. May be used for local identifiers. AlternateIdentifier should be used for another identifier of the same instance (same location, same file). For multiple identifiers, add more fields.",
            required: false,
            type: "String",
            attributes: [
                {
                    id: "730b7996-7418-11e8-ad87-008cfa5ae621",
                    name: "alternateIdentifierType",
                    description:
                        "The type of the AlternateIdentifier as free text",
                    required: true,
                    type: "String",
                },
            ],
        },
        {
            id: "7309ed60-7418-11e8-ad87-008cfa5ae621",
            name: "relatedIdentifier",
            description:
                "Identifiers of related resources. These must be globally unique identifiers.For each related identifier, include the relationType. For multiple identifiers, add more fields.",
            required: false,
            type: "String",
            attributes: [
                {
                    id: "730810f8-7418-11e8-ad87-008cfa5ae621",
                    name: "relatedIdentifierType",
                    description:
                        "The type of the related identifier. Select from list.",
                    required: true,
                    type: "Enum",
                    values: [
                        {
                            id: "3f6e7012-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "ARK",
                        },
                        {
                            id: "9085f33a-741c-11e8-ad87-008cfa5ae621",
                            is_default: false,
                            value: "arXiv",
                        },
                        {
                            id: "3f6fbcc4-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "bibcode",
                        },
                        {
                            id: "3f7064ee-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "DOI",
                        },
                        {
                            id: "3f71184e-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "EAN13",
                        },
                        {
                            id: "3f71c384-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "EISSN",
                        },
                        {
                            id: "3f727798-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Handle",
                        },
                        {
                            id: "3f732efe-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IGSN",
                        },
                        {
                            id: "3f74271e-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "ISBN",
                        },
                        {
                            id: "3f74f4be-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "ISSN",
                        },
                        {
                            id: "3f75c470-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "ISTC",
                        },
                        {
                            id: "3f7670e6-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "LISSN",
                        },
                        {
                            id: "3f77408e-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "LSID",
                        },
                        {
                            id: "3f77fd62-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "PMID",
                        },
                        {
                            id: "3f78ac3a-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "PURL",
                        },
                        {
                            id: "3f7957f2-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "UPC",
                        },
                        {
                            id: "3f7a0710-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "URL",
                        },
                        {
                            id: "3f7ab08e-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "URN",
                        },
                    ],
                },
                {
                    id: "b2bf8edc-7419-11e8-ad87-008cfa5ae621",
                    name: "relationType",
                    description:
                        "Description of the relationship of the resource being registered (for which you are requesting a DOI) and the related resource. Select from list.",
                    required: true,
                    type: "Enum",
                    values: [
                        {
                            id: "3f80bd76-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsCitedBy",
                        },
                        {
                            id: "3f816d48-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Cites",
                        },
                        {
                            id: "3f820c6c-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsSupplementTo",
                        },
                        {
                            id: "3f82b9dc-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsSupplementedBy",
                        },
                        {
                            id: "3f836990-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsContinuedBy",
                        },
                        {
                            id: "3f841610-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Continues",
                        },
                        {
                            id: "3f84c48e-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsNewVersionOf",
                        },
                        {
                            id: "3f856a74-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsPreviousVersionOf",
                        },
                        {
                            id: "3f8613de-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsPartOf",
                        },
                        {
                            id: "3f86bfbe-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "HasPart",
                        },
                        {
                            id: "3f876bd0-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsReferencedBy",
                        },
                        {
                            id: "3f881f08-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "References",
                        },
                        {
                            id: "3f88d1fa-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsDocumentedBy",
                        },
                        {
                            id: "3f89817c-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Documents",
                        },
                        {
                            id: "3f8a2f0a-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsCompiledBy",
                        },
                        {
                            id: "3f8ade96-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Compiles",
                        },
                        {
                            id: "3f8b8ad0-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsVariantFormOf",
                        },
                        {
                            id: "3f8c3bd8-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsOriginalFormOf",
                        },
                        {
                            id: "3f8cee84-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsIdenticalTo",
                        },
                        {
                            id: "3f8d99a6-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "HasMetadata",
                        },
                        {
                            id: "3f8e40a4-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsMetadataFor",
                        },
                        {
                            id: "3f8ef102-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Reviews",
                        },
                        {
                            id: "9087c098-741c-11e8-ad87-008cfa5ae621",
                            is_default: false,
                            value: "IsReviewedBy",
                        },
                        {
                            id: "3f90572c-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsDerivedFrom",
                        },
                        {
                            id: "3f91019a-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsSourceOf",
                        },
                        {
                            id: "3f91a4c4-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Describes",
                        },
                        {
                            id: "3f924c12-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsDescribedBy",
                        },
                        {
                            id: "3f92f6f8-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "HasVersion",
                        },
                        {
                            id: "3f939f68-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsVersionOf",
                        },
                        {
                            id: "3f944e86-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "Requires",
                        },
                        {
                            id: "3f94ee18-c8fe-11e8-add7-5a03816fc427",
                            is_default: false,
                            value: "IsRequiredBy",
                        },
                    ],
                },
            ],
        },
        {
            id: "f8bc36c4-b884-11e8-a32c-f64e9b87c109",
            name: "geoLocation",
            description:
                "The spatial limits or description of a geographic location. Choose from place name, point, or bounding box.",
            required: false,
            type: "Grouping",
            attributes: [
                {
                    id: "9089c956-741c-11e8-ad87-008cfa5ae621",
                    name: "geoLocationPlace",
                    description:
                        "Description of a geographic location in free text, such as a place name.",
                    required: false,
                    type: "String",
                },
                {
                    id: "f8c5ed18-b884-11e8-a32c-f64e9b87c109",
                    name: "geoLocationPoint",
                    description:
                        "A point location in space. A point contains a single latitude-longitude pair.",
                    required: false,
                    type: "Grouping",
                    attributes: [
                        {
                            id: "2a26dcd2-741a-11e8-ad87-008cfa5ae621",
                            name: "pointLongitude",
                            description: "A longitude point location in space.",
                            required: false,
                            type: "Number",
                        },
                        {
                            id: "f8ceb560-b884-11e8-a32c-f64e9b87c109",
                            name: "pointLatitude",
                            description: "A latitude point location in space.",
                            required: false,
                            type: "Number",
                        },
                    ],
                },
                {
                    id: "f8d26d2c-b884-11e8-a32c-f64e9b87c109",
                    name: "geoLocationBox",
                    description:
                        "The spatial limits of a place. A box contains two latitude-longitude pairs (opposite corners of the box).",
                    required: false,
                    type: "Grouping",
                    attributes: [
                        {
                            id: "b289d436-7419-11e8-ad87-008cfa5ae621",
                            name: "northBoundLatitude",
                            description:
                                "The north bound of a spatial limit of a place.",
                            required: false,
                            type: "Number",
                        },
                        {
                            id: "f8db195e-b884-11e8-a32c-f64e9b87c109",
                            name: "southBoundLatitude",
                            description:
                                "The south bound of a spatial limit of a place.",
                            required: false,
                            type: "Number",
                        },
                        {
                            id: "f8de20b8-b884-11e8-a32c-f64e9b87c109",
                            name: "eastBoundLongitude",
                            description:
                                "The east bound of a spatial limit of a place.",
                            required: false,
                            type: "Number",
                        },
                        {
                            id: "f8e0eb90-b884-11e8-a32c-f64e9b87c109",
                            name: "westBoundLongitude",
                            description:
                                "The west bound of a spatial limit of a place.",
                            required: false,
                            type: "Number",
                        },
                    ],
                },
                {
                    id: "b99524e4-867c-11e9-8a26-008cfa5ae621",
                    name: "geoLocationPolygon",
                    description:
                        "A drawn polygon area, defined by a set of points and lines connecting the points in a closed chain. If geoLocationPolygon27 is used, polygonPoint must be used as well. There must be at least 4 non-aligned points to make a closed curve, with the last point described the same as the first point.",
                    required: false,
                    type: "Grouping",
                    attributes: [
                        {
                            id: "1e719256-867f-11e9-8a26-008cfa5ae621",
                            name: "polygonPoint",
                            description:
                                "A point location in a polygon. If geoLocationPolygon27 is used, polygonPoint must be used as well. There must be at least 4 non-aligned points to make a closed curve, with the last point described the same as the first point. CyVerse recommends using decimal degrees.",
                            required: false,
                            type: "Grouping",
                            attributes: [
                                {
                                    id: "024edfee-8683-11e9-91b5-008cfa5ae621",
                                    name: "inPolygonPoint",
                                    description:
                                        'For any bound area that is larger than half the earth, define a (random) point inside. inPolygonPoint is only necessary to indicate the "inside" of the polygon if the polygon is larger than half the earth. Otherwise the smallest of the two areas bounded by the polygon will be used.',
                                    required: false,
                                    type: "Grouping",
                                    attributes: [
                                        {
                                            id: "024f6892-8683-11e9-91b5-008cfa5ae621",
                                            name: "pointLongitude",
                                            description:
                                                "Longitudinal dimension of point. If inPolygonPoint28 is used pointLongitude is mandatory. Longitude of the geographic point expressed in decimal degrees (positive east).",
                                            required: false,
                                            type: "Number",
                                        },
                                        {
                                            id: "024ff406-8683-11e9-91b5-008cfa5ae621",
                                            name: "pointLatitude",
                                            description:
                                                "Latitudinal dimension of point. If inPolygonPoint is used, pointLatitude is mandatory. Latitude of the geographic point expressed in decimal degrees (positive north).",
                                            required: false,
                                            type: "String",
                                        },
                                    ],
                                },
                                {
                                    id: "0250758e-8683-11e9-91b5-008cfa5ae621",
                                    name: "pointLongitude",
                                    description:
                                        "Longitudinal dimension of point. If polygonPoint is used pointLongitude is mandatory. Longitude of the geographic point expressed in decimal degrees (positive east). Domain: -180 <= pointLongitude <= 180",
                                    required: false,
                                    type: "Number",
                                },
                                {
                                    id: "0251017a-8683-11e9-91b5-008cfa5ae621",
                                    name: "pointLatitude",
                                    description:
                                        "Latitudinal dimension of point. If polygonPoint is used pointLatitude is mandatory. Latitude of the geographic point expressed in decimal degrees (positive north). Domain: -90<= pointLatitude <= 90",
                                    required: false,
                                    type: "Number",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "5ff7c60a-c8f2-11e8-b418-5a03816fc427",
            name: "fundingReference",
            description:
                "Information about financial support (funding) for the resource being registered.",
            required: false,
            type: "Grouping",
            attributes: [
                {
                    id: "52c9e192-74b1-11e8-b2bf-008cfa5ae621",
                    name: "funderName",
                    description: "Name of the funding provider.",
                    required: true,
                    type: "String",
                },
                {
                    id: "52caf1f4-74b1-11e8-b2bf-008cfa5ae621",
                    name: "funderIdentifier",
                    description:
                        "Uniquely identifies a funding entity, according to various types.",
                    required: false,
                    type: "String",
                    attributes: [
                        {
                            id: "3fe86fd4-c8fe-11e8-add7-5a03816fc427",
                            name: "funderIdentifierType",
                            description: "The type of the funderIdentifier.",
                            required: true,
                            type: "Enum",
                            values: [
                                {
                                    id: "3feaa8bc-c8fe-11e8-add7-5a03816fc427",
                                    is_default: false,
                                    value: "ISNI",
                                },
                                {
                                    id: "3feb5c6c-c8fe-11e8-add7-5a03816fc427",
                                    is_default: false,
                                    value: "GRID",
                                },
                                {
                                    id: "3fec284a-c8fe-11e8-add7-5a03816fc427",
                                    is_default: false,
                                    value: "Crossref Funder ID",
                                },
                                {
                                    id: "3fecd79a-c8fe-11e8-add7-5a03816fc427",
                                    is_default: false,
                                    value: "Other",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "b2c24b22-7419-11e8-ad87-008cfa5ae621",
            name: "reuse_or_citation_conditions",
            description:
                "A standard citation for your dataset will be generated from required metadata, but here you may include specific instructions on how to reuse or cite your dataset. ",
            required: false,
            type: "String",
        },
        {
            id: "52cdad72-74b1-11e8-b2bf-008cfa5ae621",
            name: "language",
            description:
                "Primary language of the resource. Contact doi@cyverse.org if you need to change the language.",
            required: false,
            type: "Enum",
            values: [
                {
                    id: "f8f81838-b884-11e8-a32c-f64e9b87c109",
                    is_default: true,
                    value: "en-us",
                },
            ],
        },
        {
            id: "b2c0eff2-7419-11e8-ad87-008cfa5ae621",
            name: "compressed_data",
            description:
                "Does this dataset contain compressed (e.g., zip) files?",
            required: false,
            type: "Boolean",
        },
        {
            id: "52cec45a-74b1-11e8-b2bf-008cfa5ae621",
            name: "size",
            description:
                "This will eventually autofill. You may complete the value if you know it.",
            required: false,
            type: "String",
        },
        {
            id: "52cfd6c4-74b1-11e8-b2bf-008cfa5ae621",
            name: "format",
            description:
                "Technical format of the resource. Use file extension or MIME type where possible. If your dataset contains multiple file types, add additional format fields.",
            required: false,
            type: "String",
        },
        {
            id: "b2c39842-7419-11e8-ad87-008cfa5ae621",
            name: "is_deprecated",
            description:
                "Has this published dataset been deprecated? If true, there should be a link to the replacement dataset. For use by curators only.",
            required: false,
            type: "Boolean",
        },
    ],
};

export const MockTemplateListing = {
    metadata_templates: [
        {
            created_by: "rwalls",
            created_on: "2017-12-05T20:03:42Z",
            deleted: false,
            description:
                "This template contains fields required for compliance with the IVOA standard (http://www.ivoa.net/Documents/ObsCore/20170509/REC-ObsCore-v1.1-20170509.pdf) plus a few additional fields so that data can be viewed in World Wide Telescope.",
            id: "649364fc-d9f7-11e7-914b-008cfa5ae621",
            modified_by: "rwalls",
            modified_on: "2017-12-06T22:34:02Z",
            name: "Astrolabe Metadata",
        },
        {
            created_by: "rwalls",
            created_on: "2015-08-18T21:04:14Z",
            deleted: false,
            description:
                "New copy of the DataCite metadata template for testing submissions to the DataCite API",
            id: DOI_DATACITE_TEMPLATE_ID,
            modified_by: "rwalls",
            modified_on: "2019-06-04T04:41:24Z",
            name: "DOI Request - DataCite 4.1",
        },
        {
            created_by: "rwalls",
            created_on: "2016-09-28T19:06:35Z",
            deleted: false,
            description:
                "This template contains the Dublin Core metadata elements. For more information on Dublin Core, see http://dublincore.org/. For more information on the elements, see http://dublincore.org/documents/usageguide/elements.shtml. ",
            id: "ad3ddf50-85ae-11e6-98c6-008cfa5ae621",
            modified_by: "rwalls",
            modified_on: "2019-04-16T02:33:52Z",
            name: "Dublin Core",
        },
        {
            created_by: "rwalls",
            created_on: "2018-11-28T21:59:05Z",
            deleted: false,
            description: "",
            id: "d300f3c0-f358-11e8-8928-008cfa5ae621",
            modified_by: "rwalls",
            modified_on: "2018-11-28T22:20:37Z",
            name: "Environment Ontology Terms",
        },
        {
            created_by: "rwalls",
            created_on: "2019-08-12T21:24:58Z",
            deleted: false,
            description:
                "Metadata to attach to each dataset to be ingested into FuTRES",
            id: "a2a6f418-bd47-11e9-a082-008cfa5ae621",
            modified_by: "rwalls",
            modified_on: "2019-08-12T21:42:16Z",
            name: "FuTRES_datasets",
        },
        {
            created_by: "jdebarry",
            created_on: "2016-03-14T18:43:39Z",
            deleted: false,
            id: "ab322b3e-ea14-11e5-bb73-7b3e29a70432",
            modified_by: "jdebarry",
            modified_on: "2016-03-14T19:04:55Z",
            name: "IN PROGRESS - Legume Federation - Dataset Metadata",
        },
        {
            created_by: "jdebarry",
            created_on: "2016-03-14T18:38:48Z",
            deleted: false,
            id: "fdb603ea-ea13-11e5-b2c0-1b6904d0cbbd",
            modified_by: "jdebarry",
            modified_on: "2016-03-14T19:04:45Z",
            name: "IN PROGRESS - Legume Federation - File Metadata",
        },
        {
            created_by: "<public>",
            created_on: "2015-05-05T15:49:28Z",
            deleted: false,
            id: "40ac191f-bb36-4f4e-85fb-8b50abec8e10",
            modified_by: "rwalls",
            modified_on: "2016-09-28T18:33:09Z",
            name: "Minimum Information for a Eukaryotic Genome Sequence (MIGS)",
        },
        {
            created_by: "<public>",
            created_on: "2015-05-05T15:49:28Z",
            deleted: false,
            id: "f52a4d57-00af-43ec-97d5-1c7e7779f6c3",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:21:55Z",
            name: "Minimum Information for a Metagenomic Sequence (MIMS)",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-05-19T20:40:54Z",
            deleted: false,
            id: "e7e19316-dc88-11e4-a49a-77c52ae8901a",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:00Z",
            name: "NCBI BioProject Creation",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-05-22T00:09:39Z",
            deleted: false,
            id: "d6d9d874-0016-11e5-b333-8ba8fa0e333b",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:06Z",
            name: "NCBI BioProject Update",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-09-23T00:29:24Z",
            deleted: false,
            id: "2416dda6-618a-11e5-b23b-cfc0d563a471",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:12Z",
            name: "NCBI BioSample - Beta-lactamase",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-09-22T21:43:53Z",
            deleted: false,
            id: "04f9a0f0-6173-11e5-87cf-f7b813370b04",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:18Z",
            name: "NCBI BioSample - Human",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-09-22T23:58:02Z",
            deleted: false,
            id: "c28426a6-6185-11e5-88e2-0b5edba8492e",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:23Z",
            name: "NCBI BioSample - Invertebrate",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-09-23T00:09:16Z",
            deleted: false,
            id: "545b8cee-6187-11e5-b570-0faad7f10494",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:29Z",
            name: "NCBI BioSample - Metagenome or Environmental",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-09-22T22:44:49Z",
            deleted: false,
            id: "88136fd6-617b-11e5-9119-d7f85ee56de9",
            modified_by: "rwalls",
            modified_on: "2019-06-14T03:44:27Z",
            name: "NCBI BioSample - Microbe",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-05-19T20:41:59Z",
            deleted: false,
            id: "3ff802b2-e547-11e4-bc26-ebd238247489",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:39Z",
            name: "NCBI BioSample - Model Organism / Animal",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-09-22T23:09:16Z",
            deleted: false,
            id: "f26a1bac-617e-11e5-a3b7-e32e49a39112",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:45Z",
            name: "NCBI BioSample - Pathogen Clinical / Host-Associated",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-09-22T23:30:52Z",
            deleted: false,
            id: "f6ff8fdc-6181-11e5-8231-ffffa3efac65",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:50Z",
            name: "NCBI BioSample - Pathogen Env / Food / Other",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-05-19T20:41:38Z",
            deleted: false,
            id: "0e794fa6-def4-11e4-b932-933729242a76",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:22:55Z",
            name: "NCBI BioSample - Plant",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-09-22T23:36:26Z",
            deleted: false,
            id: "be064562-6182-11e5-a281-a310b45880d2",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:23:01Z",
            name: "NCBI BioSample - Virus",
        },
        {
            created_by: "jdebarry",
            created_on: "2015-05-19T20:42:07Z",
            deleted: false,
            id: "69e3071e-defa-11e4-a5e2-bbb1eed77be6",
            modified_by: "jdebarry",
            modified_on: "2016-03-03T23:23:07Z",
            name: "NCBI SRA Library",
        },
        {
            created_by: "upendra_35",
            created_on: "2016-07-11T22:57:12Z",
            deleted: false,
            id: "cdf61a0a-47ba-11e6-bd78-008cfa5ae621",
            modified_by: "upendra_35",
            modified_on: "2016-09-23T21:20:34Z",
            name: "NCBI WGS submission",
        },
        {
            created_by: "rwalls",
            created_on: "2018-11-28T21:53:53Z",
            deleted: false,
            description: "",
            id: "18a4e9b4-f358-11e8-8786-008cfa5ae621",
            modified_by: "rwalls",
            modified_on: "2018-11-28T21:53:53Z",
            name: "Plant Ontology Terms",
        },
        {
            created_by: "<public>",
            created_on: "2015-05-05T15:49:28Z",
            deleted: false,
            id: "c52b1a0c-0fbd-4120-b107-92154dfbe2dc",
            modified_by: "rwalls",
            modified_on: "2016-09-28T18:27:45Z",
            name: "RNA",
        },
        {
            created_by: "sarahr",
            created_on: "2020-02-04T17:21:49Z",
            deleted: false,
            id: "d3e57eae-4772-11ea-9746-008cfa5ae621",
            modified_by: "sarahr",
            modified_on: "2020-02-06T17:19:17Z",
            name: "TEST - NCBI BioProject Creation WGS",
        },
        {
            created_by: "sarahr",
            created_on: "2020-02-04T17:22:08Z",
            deleted: false,
            id: "df6b3b92-4772-11ea-9306-008cfa5ae621",
            modified_by: "sarahr",
            modified_on: "2020-02-04T17:22:08Z",
            name: "TEST - NCBI BioSample - Plant WGS",
        },
        {
            created_by: "sarahr",
            created_on: "2020-02-04T17:22:15Z",
            deleted: false,
            id: "e34a973a-4772-11ea-9746-008cfa5ae621",
            modified_by: "sarahr",
            modified_on: "2020-02-06T17:24:41Z",
            name: "TEST - NCBI WGS Library",
        },
    ],
};

export const initMockAxiosTemplateEndpoints = () => {
    mockAxios
        .onGet("/api/filesystem/metadata/templates")
        .reply(200, MockTemplateListing);

    mockAxios
        .onGet(`/api/filesystem/metadata/template/${DOI_DATACITE_TEMPLATE_ID}`)
        .reply(200, DataciteMetadataTemplate);

    mockAxios
        .onGet(/\/api\/filesystem\/metadata\/template\/.*/)
        .reply(200, NestedAttrMetadataTemplate);

    mockAxios.onGet("/api/ontology-lookup-service").reply((config) => {
        console.log("searchOLSTerms", config.url, config.params);

        return [
            200,
            {
                responseHeader: {
                    status: 0,
                    QTime: 7,
                    params: {
                        hl: "true",
                        fl: "id,iri,label,ontology_prefix",
                        fq: "is_obsolete:false",
                        start: "0",
                        rows: "3",
                    },
                },
                response: {
                    numFound: 9566,
                    start: 0,
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
                highlighting: {},
            },
        ];
    });

    mockAxios.onGet("/api/unified-astronomy-thesaurus").reply((config) => {
        console.log("searchAstroThesaurusTerms", config.url, config.params);

        return [
            200,
            {
                format: "linked-data-api",
                version: "0.2",
                result: {
                    _about: "https://vocabs.ands.org.au/repository/api/lda/aas/the-unified-astronomy-thesaurus/4-0-0/concept.json",
                    definition:
                        "https://vocabs.ands.org.au/repository/api/lda/meta/aas/the-unified-astronomy-thesaurus/4-0-0/concept.json",
                    extendedMetadataVersion:
                        "https://vocabs.ands.org.au/repository/api/lda/aas/the-unified-astronomy-thesaurus/4-0-0/concept.json?_metadata=all",
                    first: "https://vocabs.ands.org.au/repository/api/lda/aas/the-unified-astronomy-thesaurus/4-0-0/concept.json?_page=0",
                    hasPart:
                        "https://vocabs.ands.org.au/repository/api/lda/aas/the-unified-astronomy-thesaurus/4-0-0/concept.json",
                    isPartOf:
                        "https://vocabs.ands.org.au/repository/api/lda/aas/the-unified-astronomy-thesaurus/4-0-0/concept.json",
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
                    itemsPerPage: 10,
                    next: "https://vocabs.ands.org.au/repository/api/lda/aas/the-unified-astronomy-thesaurus/4-0-0/concept.json?_page=1",
                    page: 0,
                    startIndex: 1,
                    type: [
                        "http://purl.org/linked-data/api/vocab#ListEndpoint",
                        "http://purl.org/linked-data/api/vocab#Page",
                    ],
                },
            },
        ];
    });
};
