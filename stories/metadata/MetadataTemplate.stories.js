import React, { Component } from "react";

import MetadataTemplateView from "../../src/metadata/MetadataTemplateView";
import EditMetadataTemplate from "../../src/metadata/admin/EditMetadataTemplate";

const presenter = (logger) => ({
    onSaveTemplate: (template, resolve, errorCallback) => {
        setTimeout(() => {
            logger(template);
            resolve(template);
        }, 1500);
    },
    closeMetadataTemplateDialog: () => logger("dialog closed."),
    updateMetadataFromTemplateView: (metadata, resolve, errorCallback) => {
        logger(metadata);
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
});

const nestedAttrMetadataTemplate = {
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

class EditNestedAttrMetadataTemplateTest extends Component {
    render() {
        const logger =
            this.props.logger ||
            ((template) => {
                console.log(template);
            });

        return (
            <EditMetadataTemplate
                open
                presenter={presenter(logger)}
                template={nestedAttrMetadataTemplate}
            />
        );
    }
}

// This can be updated from the template JSON in production, which can be fetched with a command like the following
// (assuming the metadata service is port-forwarded to 31331):
// curl -X GET --header 'Accept: application/json' 'http://localhost:31331/templates/ae75bc42-45ec-11e5-801c-43dab0dfe096?user=ipctest' | jq 'def attrs: . | {id: .id, name: .name, description: .description, required: .required?, type: .type, values: .values?, attributes: [.attributes[]? | attrs]} | if .values then . else del(.values) end | if (.attributes | length) > 0 then . else del(.attributes) end; {id: .id, name: .name, description: .description, deleted: false, attributes: [.attributes[] | attrs]}'
const dataciteMetadataTemplate = {
    id: "ae75bc42-45ec-11e5-801c-43dab0dfe096",
    name: "DOI Request - DataCite 4.1",
    description:
        "New copy of the DataCite metadata template for testing submissions to the DataCite API",
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
                    id: "5e10ea38-7415-11e8-8326-008cfa5ae621",
                    name: "affiliation",
                    description:
                        "The organizational or institutional affiliation of the creator.",
                    required: true,
                    type: "String",
                },
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
                "All CyVerse Curated Data in the Data Commons is open access. You can choose between ODC PDDL for non-copyrightable materials (i.e., data only) or CC0 for copyrightable material (Workflows, White Papers, Project Documents). More information is available at https://wiki.cyverse.org/wiki/display/DC/Permanent+Identifier+FAQs#PermanentIdentifierFAQs-WhichlicensecanIusetopublishmydata? If you need a different license because of prior restrictions on your data, please contact us.",
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

class EditDataCiteMetadataTemplateTest extends Component {
    render() {
        const logger =
            this.props.logger ||
            ((template) => {
                console.log(template);
            });

        return (
            <EditMetadataTemplate
                open
                presenter={presenter(logger)}
                template={dataciteMetadataTemplate}
            />
        );
    }
}

const metadata = {
    "irods-avus": [
        {
            id: "0",
            attr: "attrX",
            value: "valueX",
            unit: "unitX",
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

class MetadataTemplateViewTest extends Component {
    render() {
        const logger =
            this.props.logger ||
            ((template) => {
                console.log(template);
            });

        return (
            <MetadataTemplateView
                open
                writable
                presenter={presenter(logger)}
                template={nestedAttrMetadataTemplate}
                metadata={metadata}
            />
        );
    }
}

class MetadataTemplateReadOnlyViewTest extends Component {
    render() {
        const logger =
            this.props.logger ||
            ((template) => {
                console.log(template);
            });

        const avus = [
            ...metadata.avus,
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
                presenter={presenter(logger)}
                template={nestedAttrMetadataTemplate}
                metadata={{
                    ...metadata,
                    avus,
                }}
            />
        );
    }
}

const dataciteMetadata = {
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
                    value: "0000-0000-1234-5678",
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
            value: "2019",
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
            value: "https://qa.cyverse.org/de/",
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

class DataCiteMetadataTemplateViewTest extends Component {
    render() {
        const logger =
            this.props.logger ||
            ((template) => {
                console.log(template);
            });

        return (
            <MetadataTemplateView
                open
                writable
                presenter={presenter(logger)}
                template={dataciteMetadataTemplate}
                metadata={dataciteMetadata}
            />
        );
    }
}

class DataCiteMetadataTemplateViewNoValuesTest extends Component {
    render() {
        const logger =
            this.props.logger ||
            ((template) => {
                console.log(template);
            });

        return (
            <MetadataTemplateView
                open
                writable
                presenter={presenter(logger)}
                template={dataciteMetadataTemplate}
                metadata={{}}
            />
        );
    }
}

export {
    DataCiteMetadataTemplateViewNoValuesTest,
    DataCiteMetadataTemplateViewTest,
    EditNestedAttrMetadataTemplateTest,
    EditDataCiteMetadataTemplateTest,
    MetadataTemplateReadOnlyViewTest,
    MetadataTemplateViewTest,
};
