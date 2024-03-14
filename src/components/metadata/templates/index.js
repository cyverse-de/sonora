/**
 * @author psarando
 */
import React, { Fragment } from "react";

import { FieldArray, Formik } from "formik";
import PropTypes from "prop-types";
import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import ids from "../ids";
import styles from "../styles";

import AttributeTypes from "components/models/metadata/TemplateAttributeTypes";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import DEDialog from "components/utils/DEDialog";
import markdownToHtml from "components/utils/markdownToHtml";
import TableLoading from "components/table/TableLoading";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import {
    FILESYSTEM_METADATA_TEMPLATE_QUERY_KEY,
    SEARCH_OLS_QUERY_KEY,
    SEARCH_UAT_QUERY_KEY,
    getFilesystemMetadataTemplate,
    searchOntologyLookupService,
    searchUnifiedAstronomyThesaurus,
} from "serviceFacades/metadata";

import getFormError from "components/forms/getFormError";
import buildID from "components/utils/DebugIDUtil";
import { formatCurrentDate } from "components/utils/DateFormatter";

import AstroThesaurusSearchField from "./fields/AstroThesaurusSearchField";
import CheckboxStringValueField from "./fields/CheckboxStringValueField";
import EnumField from "./fields/EnumField";
import GroupingField from "./fields/GroupingField";
import IntegerField from "./fields/IntegerField";
import LocalContextsField from "./fields/LocalContextsField";
import MultilineTextField from "./fields/MultilineTextField";
import NumberField from "./fields/NumberField";
import OntologyLookupServiceSearchField from "./fields/OntologyLookupServiceSearchField";
import TextField from "./fields/TextField";
import TimestampField from "./fields/TimestampField";
import UrlField from "./fields/UrlField";

import SlideUpTransition from "../SlideUpTransition";

import {
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
    IconButton,
    Table,
    Typography,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import {
    Add as ContentAdd,
    Delete as ContentRemove,
    ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import { Skeleton } from "@mui/material";
import { LocalContextsAttrs } from "components/models/metadata/LocalContexts";

const useStyles = makeStyles(styles);

const newAVU = (attrTemplate) => {
    const attr = attrTemplate.name,
        unit = "";

    let value;
    switch (attrTemplate.type) {
        case AttributeTypes.TIMESTAMP:
            value = formatCurrentDate();
            break;

        case AttributeTypes.ENUM:
            value =
                attrTemplate.values &&
                attrTemplate.values.find((enumVal) => enumVal.is_default);
            value = value ? value.value : "";
            break;

        default:
            value = "";
            break;
    }

    return {
        attr,
        value,
        unit,
    };
};

const AttributeDescription = ({ attribute }) => {
    const [infoHtml, setInfoHtml] = React.useState("");

    React.useEffect(() => {
        if (attribute?.description) {
            markdownToHtml(attribute.description).then((html) =>
                setInfoHtml(html)
            );
        } else {
            setInfoHtml("");
        }
    }, [attribute]);

    return (
        <Typography
            variant="subtitle1"
            dangerouslySetInnerHTML={{ __html: infoHtml }}
        />
    );
};

const MetadataTemplateAttributeForm = (props) => {
    const {
        field,
        touched,
        errors,
        attributes,
        avus,
        writable,
        searchAstroThesaurusTerms,
        searchOLSTerms,
    } = props;

    const [expanded, setExpanded] = React.useState({});

    React.useEffect(() => {
        const expandedAttrs = {};
        // Set all attrs as expanded in the state,
        // even if there is no matching attribute name in the template
        // and no expansion panel will be rendered for that attr.
        avus && avus.forEach((avu) => (expandedAttrs[avu.attr] = true));
        setExpanded(expandedAttrs);
    }, [avus]);

    const { t } = useTranslation("metadata");
    const classes = useStyles();

    const onAttrExpandedChange = (attr, attrExpanded) => {
        setExpanded({ ...expanded, [attr]: attrExpanded });
    };

    const onAddAVU = (arrayHelpers, attribute) => {
        const avu = newAVU(attribute);
        addSubAVUs(attribute, avu);

        arrayHelpers.push(avu);

        onAttrExpandedChange(attribute.name, true);
    };

    const addSubAVUs = (attribute, avu) => {
        const requiredAttrs =
            attribute.attributes &&
            attribute.attributes.filter((subAttr) => subAttr.required);

        if (requiredAttrs && requiredAttrs.length > 0) {
            avu.avus = requiredAttrs.map((subAttr) => {
                const subAVU = newAVU(subAttr);

                addSubAVUs(subAttr, subAVU);

                return subAVU;
            });
        }
    };

    return (
        <FieldArray
            name={`${field}.avus`}
            render={(arrayHelpers) => {
                return attributes.map((attribute) => {
                    const attrFieldId = buildID(
                        ids.METADATA_TEMPLATE_VIEW,
                        field,
                        attribute.name
                    );

                    let attrErrors = false;
                    let canRemove = !attribute.required;
                    let FieldComponent;
                    let customFieldProps = {};

                    switch (attribute.type) {
                        case AttributeTypes.BOOLEAN:
                            FieldComponent = CheckboxStringValueField;
                            break;
                        case AttributeTypes.NUMBER:
                            FieldComponent = NumberField;
                            break;
                        case AttributeTypes.INTEGER:
                            FieldComponent = IntegerField;
                            break;
                        case AttributeTypes.MULTILINE_TEXT:
                            FieldComponent = MultilineTextField;
                            break;
                        case AttributeTypes.TIMESTAMP:
                            FieldComponent = TimestampField;
                            break;

                        case AttributeTypes.ENUM:
                            FieldComponent = EnumField;
                            break;

                        case AttributeTypes.ONTOLOGY_TERM_UAT:
                            FieldComponent = AstroThesaurusSearchField;
                            customFieldProps = { searchAstroThesaurusTerms };
                            break;

                        case AttributeTypes.ONTOLOGY_TERM_OLS:
                            FieldComponent = OntologyLookupServiceSearchField;
                            customFieldProps = { searchOLSTerms };
                            break;

                        case AttributeTypes.GROUPING:
                            FieldComponent = GroupingField;
                            break;

                        case AttributeTypes.URL:
                            FieldComponent = UrlField;
                            break;

                        default:
                            FieldComponent = TextField;
                            break;
                    }

                    const avuFields =
                        avus &&
                        avus.map((avu, index) => {
                            if (avu.attr !== attribute.name) {
                                return null;
                            }

                            const isLocalContextsAttr =
                                attribute.name ===
                                LocalContextsAttrs.LOCAL_CONTEXTS;
                            if (isLocalContextsAttr) {
                                FieldComponent = LocalContextsField;
                            }

                            const avuFieldName = `${field}.avus[${index}]`;
                            const avuError = getFormError(
                                avuFieldName,
                                touched,
                                errors
                            );
                            attrErrors = attrErrors || avuError;

                            const rowID = buildID(
                                ids.METADATA_TEMPLATE_VIEW,
                                avuFieldName
                            );

                            const isGroupingAttr =
                                attribute.type === AttributeTypes.GROUPING;

                            const deleteBtn = canRemove && writable && (
                                <IconButton
                                    id={buildID(rowID, ids.BUTTONS.DELETE)}
                                    aria-label={t("delete")}
                                    classes={{ root: classes.deleteIcon }}
                                    onClick={() => arrayHelpers.remove(index)}
                                    size="large"
                                >
                                    <ContentRemove />
                                </IconButton>
                            );

                            const childAVUs = !isLocalContextsAttr &&
                                attribute.attributes &&
                                attribute.attributes.length > 0 && (
                                    <MetadataTemplateAttributeForm
                                        field={avuFieldName}
                                        errors={errors}
                                        touched={touched}
                                        searchAstroThesaurusTerms={
                                            searchAstroThesaurusTerms
                                        }
                                        searchOLSTerms={searchOLSTerms}
                                        attributes={attribute.attributes}
                                        avus={avu.avus}
                                        writable={writable}
                                    />
                                );

                            const avuField = (
                                <Fragment key={avuFieldName}>
                                    <Grid
                                        item
                                        container
                                        spacing={2}
                                        justifyContent="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item xs>
                                            <FieldComponent
                                                id={rowID}
                                                avuFieldName={avuFieldName}
                                                attribute={attribute}
                                                avu={avu}
                                                writable={writable}
                                                {...customFieldProps}
                                            />
                                        </Grid>
                                        {!isGroupingAttr && (
                                            <Grid item xs={1}>
                                                {deleteBtn}
                                            </Grid>
                                        )}
                                    </Grid>
                                    {childAVUs && (
                                        <Grid item>
                                            {isGroupingAttr ? (
                                                <fieldset>
                                                    <legend
                                                        style={{
                                                            margin: "0 0 0 auto",
                                                        }}
                                                    >
                                                        {deleteBtn}
                                                    </legend>
                                                    {childAVUs}
                                                </fieldset>
                                            ) : (
                                                childAVUs
                                            )}
                                        </Grid>
                                    )}
                                </Fragment>
                            );

                            canRemove = true;

                            return avuField;
                        });

                    const hasAVUs =
                        avuFields &&
                        avuFields.filter((avuField) => avuField).length > 0;

                    return (
                        (writable || hasAVUs) && (
                            <Accordion
                                key={attribute.name}
                                expanded={!!expanded[attribute.name]}
                                onChange={(event, attrExpanded) =>
                                    onAttrExpandedChange(
                                        attribute.name,
                                        attrExpanded
                                    )
                                }
                            >
                                <AccordionSummary
                                    expandIcon={
                                        <ExpandMoreIcon
                                            id={buildID(
                                                attrFieldId,
                                                ids.BUTTONS.EXPAND
                                            )}
                                        />
                                    }
                                >
                                    {writable && (
                                        <IconButton
                                            id={buildID(
                                                attrFieldId,
                                                ids.BUTTONS.ADD
                                            )}
                                            color="primary"
                                            aria-label={t("addRow")}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onAddAVU(
                                                    arrayHelpers,
                                                    attribute
                                                );
                                            }}
                                            size="large"
                                        >
                                            <ContentAdd />
                                        </IconButton>
                                    )}
                                    <div className={classes.title}>
                                        <Typography
                                            variant="h6"
                                            color="inherit"
                                        >
                                            {attribute.name}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            className={classes.errorSubTitle}
                                        >
                                            {attrErrors &&
                                                attrErrors.error &&
                                                t("errAttrHasErrors")}
                                        </Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="stretch"
                                    >
                                        <Grid item xs>
                                            <AttributeDescription
                                                attribute={attribute}
                                            />
                                        </Grid>
                                        {avuFields}
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )
                    );
                });
            }}
        />
    );
};

const MetadataTemplateForm = (props) => {
    const {
        open,
        loading,
        writable,
        onClose,
        searchAstroThesaurusTerms,
        searchOLSTerms,
        // from formik
        dirty,
        handleSubmit,
        isSubmitting,
        errors,
        touched,
        values,
    } = props;

    const [showConfirmationDialog, setShowConfirmationDialog] =
        React.useState(false);
    const [showErrorsDialog, setShowErrorsDialog] = React.useState(false);

    const handleSubmitWrapper = () => {
        if (errors?.metadata) {
            setShowErrorsDialog(true);
        } else {
            handleSubmit();
        }
    };

    const closeMetadataTemplateDialog = () => {
        dirty && writable ? setShowConfirmationDialog(true) : onClose();
    };

    const confirmCloseMetadataTemplateDialog = () => {
        closeConfirmationDialog();
        onClose();
    };

    const closeConfirmationDialog = () => {
        setShowConfirmationDialog(false);
    };

    const { t } = useTranslation(["metadata", "common"]);

    return (
        <DEDialog
            baseId={ids.METADATA_TEMPLATE_VIEW}
            open={open}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                    closeMetadataTemplateDialog(event);
                }
            }}
            title={
                loading ? (
                    <Skeleton variant="text" width={240} />
                ) : (
                    values.template.name
                )
            }
            maxWidth="md"
            disableEscapeKeyDown
            TransitionComponent={SlideUpTransition}
            actions={[
                <Button
                    key={ids.BUTTONS.DONE}
                    id={buildID(ids.METADATA_TEMPLATE_VIEW, ids.BUTTONS.DONE)}
                    onClick={closeMetadataTemplateDialog}
                >
                    {t("common:cancel")}
                </Button>,
                writable && (
                    <Button
                        key={ids.BUTTONS.SAVE}
                        id={buildID(
                            ids.METADATA_TEMPLATE_VIEW,
                            ids.BUTTONS.SAVE
                        )}
                        disabled={loading || isSubmitting}
                        onClick={handleSubmitWrapper}
                        variant="contained"
                    >
                        {t("save")}
                    </Button>
                ),
            ]}
        >
            {loading ? (
                <Table>
                    <TableLoading
                        baseId={ids.METADATA_TEMPLATE_VIEW}
                        numColumns={1}
                        numRows={5}
                    />
                </Table>
            ) : (
                <MetadataTemplateAttributeForm
                    field="metadata"
                    errors={errors}
                    touched={touched}
                    searchAstroThesaurusTerms={searchAstroThesaurusTerms}
                    searchOLSTerms={searchOLSTerms}
                    attributes={values.template.attributes || []}
                    avus={values.metadata.avus}
                    writable={writable}
                />
            )}

            <DEDialog
                baseId={ids.METADATA_TEMPLATE_VIEW}
                open={showErrorsDialog}
                title={t("errMetadataTemplateAlertHeading")}
                onClose={() => setShowErrorsDialog(false)}
            >
                {t("errMetadataTemplateAlertMsg")}
            </DEDialog>

            <ConfirmationDialog
                open={showConfirmationDialog}
                baseId={ids.METADATA_TEMPLATE_VIEW}
                title={t("common:confirmDiscardChangesDialogHeader")}
                contentText={t("common:confirmDiscardChangesDialogMsg")}
                confirmButtonText={t("common:discard")}
                onConfirm={confirmCloseMetadataTemplateDialog}
                onClose={closeConfirmationDialog}
            />
        </DEDialog>
    );
};

const MetadataTemplateView = (props) => {
    const { templateId, showErrorAnnouncer, updateMetadataFromTemplateView } =
        props;

    const [template, setTemplate] = React.useState({});
    const [olsSearch, searchOLSTerms] = React.useState(null);
    const [uatSearch, searchAstroThesaurusTerms] = React.useState(null);

    const { t } = useTranslation("metadata");

    const { isFetching } = useQuery({
        queryKey: [FILESYSTEM_METADATA_TEMPLATE_QUERY_KEY, templateId],
        queryFn: () => getFilesystemMetadataTemplate(templateId),

        enabled: !!templateId,
        onSuccess: setTemplate,
        onError: (error) =>
            showErrorAnnouncer(t("errMetadataTemplateLoad"), error),
    });

    useQuery({
        queryKey: [
            SEARCH_UAT_QUERY_KEY,
            uatSearch && {
                searchTerm: uatSearch.inputValue,
            },
        ],
        queryFn: () =>
            searchUnifiedAstronomyThesaurus({
                searchTerm: uatSearch.inputValue,
            }),
        enabled: !!uatSearch?.inputValue,
        onSuccess: uatSearch?.callback,
        onError: (error) => {
            showErrorAnnouncer(t("uatSearchError"), error);
        },
    });

    useQuery({
        queryKey: [
            SEARCH_OLS_QUERY_KEY,
            olsSearch && {
                ...olsSearch.loaderSettings,
                searchTerm: olsSearch.inputValue,
            },
        ],
        queryFn: () =>
            searchOntologyLookupService({
                ...olsSearch.loaderSettings,
                searchTerm: olsSearch.inputValue,
            }),
        enabled: !!olsSearch?.inputValue,
        onSuccess: olsSearch?.callback,
        onError: (error) => {
            showErrorAnnouncer(t("olsSearchError"), error);
        },
    });

    const initValues = () => {
        const metadata = { ...props.metadata };

        const attributeMap = {};
        const mapAttributesToAttrMap = (attrMap, attributes) =>
            attributes?.forEach((attribute) => {
                const attrCopy = { ...attribute };
                attrMap[attribute.name] = attrCopy;

                if (attrCopy.attributes?.length > 0) {
                    const subAttrMap = {};
                    mapAttributesToAttrMap(subAttrMap, attrCopy.attributes);
                    attrCopy.attributes = subAttrMap;
                }
            });

        mapAttributesToAttrMap(attributeMap, template.attributes);

        const mapAttributesToAVUs = (attributes, propsAVUs) => {
            let avus = propsAVUs ? [...propsAVUs] : [];

            attributes &&
                attributes
                    .filter((attribute) => attribute.required)
                    .forEach((attribute) => {
                        if (!avus.find((avu) => avu.attr === attribute.name)) {
                            avus.push(newAVU(attribute));
                        }

                        const { attributes } = attribute;
                        if (attributes && attributes.length > 0) {
                            avus = avus.map((propsAVU) => {
                                const avu = { ...propsAVU };

                                if (avu.attr === attribute.name) {
                                    avu.avus = mapAttributesToAVUs(
                                        attributes,
                                        avu.avus
                                    );
                                }

                                return avu;
                            });
                        }
                    });

            return avus;
        };

        metadata.avus = mapAttributesToAVUs(template.attributes, metadata.avus);

        return { template, attributeMap, metadata };
    };

    /**
     * Users do not fill in the values of Grouping attributes,
     * but duplicated attributes need unique values in order for the service to save them as separate AVUs.
     * This function will update AVUs that have attributes matching any Grouping types found in the template,
     * setting their values to a comma-separated list of their child AVUs' values.
     */
    const postProcessAVUs = (avus, attributeMap) => {
        return avus.map((avu) => {
            const attrTemplate = attributeMap[avu.attr];

            const isNumberAttr =
                attrTemplate?.type === AttributeTypes.NUMBER ||
                attrTemplate?.type === AttributeTypes.INTEGER;

            const isGroupingAttr =
                attrTemplate?.type === AttributeTypes.GROUPING;

            const hasChildAVUs = avu.avus && avu.avus.length > 0;

            if (isNumberAttr && (avu.value || avu.value === 0)) {
                // The API will only accept AVU values as strings.
                avu.value = avu.value.toString();
            }

            if (attrTemplate && hasChildAVUs) {
                avu = {
                    ...avu,
                    avus: postProcessAVUs(avu.avus, attrTemplate.attributes),
                };

                if (isGroupingAttr) {
                    avu.value = avu.avus.map((avu) => avu.value).join(", ");
                }
            }

            return avu;
        });
    };

    const handleSubmit = (values, actions) => {
        const { attributeMap, metadata } = values;
        const { setSubmitting, setStatus } = actions;

        const resolve = () => {
            setSubmitting(false);
            setStatus("submitted");
        };
        const errorCallback = () => {
            setSubmitting(false);
            setStatus("error");
        };

        updateMetadataFromTemplateView(
            { ...metadata, avus: postProcessAVUs(metadata.avus, attributeMap) },
            resolve,
            errorCallback
        );
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initValues()}
            onSubmit={handleSubmit}
        >
            {(formikProps) => {
                return (
                    <MetadataTemplateForm
                        {...props}
                        {...formikProps}
                        loading={isFetching}
                        searchOLSTerms={searchOLSTerms}
                        searchAstroThesaurusTerms={searchAstroThesaurusTerms}
                    />
                );
            }}
        </Formik>
    );
};

MetadataTemplateView.propTypes = {
    updateMetadataFromTemplateView: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default withErrorAnnouncer(MetadataTemplateView);
