/**
 * @author psarando
 *
 * Form fields for displaying app parameters and parameter groups.
 */
import React from "react";
import { useTranslation } from "i18n";
import { Trans } from "react-i18next";
import sanitizeHtml from "sanitize-html";
import { FastField, Field, getIn } from "formik";

import GlobalConstants from "../../../constants";
import { intercomShow } from "common/intercom";

import ResourceTypes from "components/models/ResourceTypes";
import ExternalLink from "components/utils/ExternalLink";

import constants from "./constants";
import ids from "./ids";
import styles from "./styles";

import { isEmptyParamValue } from "./validate";

import InputSelector from "./InputSelector";
import MultiInputSelector from "./MultiInputSelector";
import ReferenceGenomeSelect from "./ReferenceGenomeSelect";

import {
    build as buildDebugId,
    FormCheckbox,
    FormMultilineTextField,
    FormIntegerField,
    FormNumberField,
    FormTextField,
} from "@cyverse-de/ui-lib";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Link,
    makeStyles,
    MenuItem,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles(styles);

/**
 * @param {string} baseId
 * @param {number} paramIndex
 * @param {string} type
 *
 * @returns {string} A debug ID appropriate for the given parameter type, index,
 * and baseId.
 */
const buildParamId = (baseId, paramIndex, type) => {
    const baseParamId = buildDebugId(baseId, paramIndex);

    switch (type) {
        case constants.PARAM_TYPE.DOUBLE:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_DOUBLE_SPINNER);
        case constants.PARAM_TYPE.DOUBLE_SELECTION:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_DOUBLE_SELECTION);
        case constants.PARAM_TYPE.ENV_VAR:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_ENV_VAR);
        case constants.PARAM_TYPE.FILE_INPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_FILE_SELECTOR);
        case constants.PARAM_TYPE.FILE_OUTPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_OUTPUT_FILE);
        case constants.PARAM_TYPE.FILE_FOLDER_INPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_FILE_FOLDER_INPUT);
        case constants.PARAM_TYPE.FLAG:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_FLAG);
        case constants.PARAM_TYPE.FOLDER_INPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_INPUT_FOLDER);
        case constants.PARAM_TYPE.FOLDER_OUTPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_OUTPUT_FOLDER);
        case constants.PARAM_TYPE.INFO:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_INFO_LABEL);
        case constants.PARAM_TYPE.INTEGER:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_INTEGER_SPINNER);
        case constants.PARAM_TYPE.INTEGER_SELECTION:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_INTEGER_SELECTION);
        case constants.PARAM_TYPE.MULTIFILE_OUTPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_MULTI_FILE_OUTPUT);
        case constants.PARAM_TYPE.MULTIFILE_SELECTOR:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_MULTI_FILE_INPUT);
        case constants.PARAM_TYPE.MULTILINE_TEXT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_MULTI_LINE_TEXT);
        case constants.PARAM_TYPE.REFERENCE_ANNOTATION:
            return buildDebugId(
                baseParamId,
                ids.APP_LAUNCH_REFERENCE_ANNOTATION
            );
        case constants.PARAM_TYPE.REFERENCE_GENOME:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_REFERENCE_GENOME);
        case constants.PARAM_TYPE.REFERENCE_SEQUENCE:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_REFERENCE_SEQUENCE);
        case constants.PARAM_TYPE.TEXT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_TEXT_INPUT);
        case constants.PARAM_TYPE.TEXT_SELECTION:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_TEXT_SELECTION);
        default:
            return baseParamId;
    }
};

/**
 * Form fields and info display for an app parameter group.
 */
function ParamGroupForm(props) {
    const {
        baseId,
        fieldName,
        group,
        referenceGenomes,
        referenceGenomesLoading,
        index,
        noOfGroups,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation("launch");
    return (
        <Accordion id={baseId} defaultExpanded>
            <AccordionSummary
                expandIcon={
                    <ExpandMore
                        id={buildDebugId(baseId, ids.BUTTONS.EXPAND)}
                        className={classes.paramsViewsExpandIcon}
                    />
                }
                className={classes.paramsViewSummary}
            >
                <div>
                    <Typography variant="subtitle2">{group.label}</Typography>
                    <Typography variant="caption">
                        {t("section", {
                            groupNumber: index,
                            totalGroups: noOfGroups,
                        })}
                    </Typography>
                </div>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionDetails}>
                {group.parameters?.map((param, paramIndex) => {
                    if (!param.isVisible) {
                        return null;
                    }

                    const name = `${fieldName}.parameters.${paramIndex}.value`;
                    const paramFormId = buildParamId(
                        baseId,
                        paramIndex,
                        param.type
                    );

                    let fieldProps = {
                        id: paramFormId,
                        name,
                        label: param.label,
                        helperText: param.description,
                        required: param.required,
                        margin: "normal",
                    };

                    switch (param.type) {
                        case constants.PARAM_TYPE.INFO:
                            fieldProps = {
                                id: paramFormId,
                                name,
                                component: Typography,
                                variant: "body1",
                                gutterBottom: true,
                                dangerouslySetInnerHTML: {
                                    __html: sanitizeHtml(param.label),
                                },
                            };

                            break;

                        case constants.PARAM_TYPE.TEXT:
                            fieldProps.component = FormTextField;
                            fieldProps.size = "small";
                            if (param.validators?.length > 0) {
                                const charLimitValidator = param.validators.find(
                                    (validator) =>
                                        validator.type ===
                                        constants.VALIDATOR_TYPE.CHARACTER_LIMIT
                                );
                                if (charLimitValidator) {
                                    fieldProps.inputProps = {
                                        maxLength: charLimitValidator.params[0],
                                    };
                                }
                            }
                            break;

                        case constants.PARAM_TYPE.INTEGER:
                            fieldProps.component = FormIntegerField;
                            fieldProps.size = "small";
                            break;

                        case constants.PARAM_TYPE.DOUBLE:
                            fieldProps.component = FormNumberField;
                            fieldProps.size = "small";
                            break;

                        case constants.PARAM_TYPE.MULTILINE_TEXT:
                            fieldProps.component = FormMultilineTextField;
                            fieldProps.size = "small";
                            break;

                        case constants.PARAM_TYPE.FLAG:
                            fieldProps.component = FormCheckbox;
                            break;

                        case constants.PARAM_TYPE.TEXT_SELECTION:
                        case constants.PARAM_TYPE.INTEGER_SELECTION:
                        case constants.PARAM_TYPE.DOUBLE_SELECTION:
                            fieldProps.component = FormTextField;
                            fieldProps.select = true;
                            fieldProps.variant = "outlined";
                            fieldProps.size = "small";
                            fieldProps.children = param.arguments?.map(
                                (arg) => (
                                    <MenuItem key={arg.value} value={arg}>
                                        {arg.display}
                                    </MenuItem>
                                )
                            );
                            break;

                        case constants.PARAM_TYPE.FILE_INPUT:
                            fieldProps.component = InputSelector;
                            fieldProps.acceptedType = ResourceTypes.FILE;
                            break;

                        case constants.PARAM_TYPE.FOLDER_INPUT:
                            fieldProps.component = InputSelector;
                            fieldProps.acceptedType = ResourceTypes.FOLDER;
                            break;

                        case constants.PARAM_TYPE.FILE_FOLDER_INPUT:
                            fieldProps.component = InputSelector;
                            fieldProps.acceptedType = ResourceTypes.ANY;
                            break;

                        case constants.PARAM_TYPE.MULTIFILE_SELECTOR:
                            fieldProps.component = MultiInputSelector;
                            fieldProps.acceptedType = ResourceTypes.FILE;
                            break;

                        case constants.PARAM_TYPE.REFERENCE_GENOME:
                        case constants.PARAM_TYPE.REFERENCE_SEQUENCE:
                        case constants.PARAM_TYPE.REFERENCE_ANNOTATION:
                            fieldProps.component = ReferenceGenomeSelect;

                            // Can't be a FastField since it renders with custom props.
                            return (
                                <Field
                                    key={param.id}
                                    {...fieldProps}
                                    referenceGenomes={referenceGenomes}
                                    referenceGenomesLoading={
                                        referenceGenomesLoading
                                    }
                                />
                            );

                        default:
                            fieldProps.component = FormTextField;
                            break;
                    }

                    return <FastField key={param.id} {...fieldProps} />;
                })}
            </AccordionDetails>
        </Accordion>
    );
}

const ParamsReviewLabel = ({ error, label }) => {
    const classes = useStyles();
    return (
        <Typography
            className={classes.paramsReview}
            color={error ? "error" : "initial"}
        >
            {label}
        </Typography>
    );
};

const ParamsReviewValue = ({ param }) => {
    const { value, type } = param;
    const classes = useStyles();
    switch (type) {
        case constants.PARAM_TYPE.FLAG:
            return (
                <Typography className={classes.paramsReview}>
                    {value ? "✔︎" : ""}
                </Typography>
            );

        case constants.PARAM_TYPE.MULTILINE_TEXT:
        case constants.PARAM_TYPE.MULTIFILE_SELECTOR:
            return (
                <TextField
                    className={classes.paramsReview}
                    multiline
                    rows={3}
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    InputProps={{
                        readOnly: true,
                    }}
                    value={Array.isArray(value) ? value.join("\n") : value}
                />
            );

        case constants.PARAM_TYPE.TEXT_SELECTION:
        case constants.PARAM_TYPE.INTEGER_SELECTION:
        case constants.PARAM_TYPE.DOUBLE_SELECTION:
            if (value?.display) {
                return (
                    <Typography className={classes.paramsReview}>
                        {value.display}
                    </Typography>
                );
            }
            break;

        case constants.PARAM_TYPE.REFERENCE_GENOME:
        case constants.PARAM_TYPE.REFERENCE_SEQUENCE:
        case constants.PARAM_TYPE.REFERENCE_ANNOTATION:
            if (value?.name) {
                return (
                    <Typography className={classes.paramsReview}>
                        {value.name}
                    </Typography>
                );
            }
            break;

        default:
            break;
    }

    return value;
};

const HPCWaitTimesMessage = ({ baseId }) => {
    const { t } = useTranslation("launch");
    return (
        <Trans
            t={t}
            i18nKey="hpcAppWaitTimes"
            components={{
                p: <p />,
                support: (
                    <Link
                        id={buildDebugId(baseId, ids.BUTTONS.CONTACT_SUPPORT)}
                        component="button"
                        onClick={(event) => {
                            // prevent form submission
                            event.preventDefault();
                            intercomShow();
                        }}
                    />
                ),
                hpcLink: (
                    <ExternalLink
                        key="hpc"
                        href={GlobalConstants.HELP_DOCS.HPC_APPS}
                    />
                ),
                xsede: (
                    <ExternalLink
                        key="xsede"
                        href={constants.XSEDE_ALLOC_LINK}
                    />
                ),
            }}
        />
    );
};

const ShowAllParameters = ({ baseId, checked, onChange }) => {
    const switchId = buildDebugId(baseId, ids.BUTTONS.SHOW_ALL_PARAMETERS);
    const helperTextID = buildDebugId(switchId, ids.BUTTONS.HELPER_TEXT);
    const { t } = useTranslation("launch");
    return (
        <Toolbar component={Paper}>
            <FormControl fullWidth margin="normal">
                <FormControlLabel
                    control={
                        <Switch
                            id={switchId}
                            aria-describedby={helperTextID}
                            size="small"
                            checked={checked}
                            onChange={onChange}
                        />
                    }
                    label={t("showAllParameters")}
                />
                <FormHelperText id={helperTextID}>
                    {t("showAllParametersHelpText")}
                </FormHelperText>
            </FormControl>
        </Toolbar>
    );
};

/**
 * A table summarizing the app parameter values and step resource requirements
 * that will be included in the final analysis submission.
 */
const ParamsReview = ({
    appType,
    baseId,
    errors,
    groups,
    showAll,
    setShowAll,
}) => {
    return (
        <>
            {appType === GlobalConstants.APP_TYPE_EXTERNAL && (
                <HPCWaitTimesMessage baseId={baseId} />
            )}

            <ShowAllParameters
                baseId={baseId}
                checked={showAll}
                onChange={(event) => setShowAll(event.target.checked)}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {groups?.map((group, groupIndex) =>
                            group.parameters.map((param, paramIndex) => {
                                const fieldName = `groups.${groupIndex}.parameters.${paramIndex}`;
                                const paramError = getIn(errors, fieldName);
                                const hasValue = !isEmptyParamValue(
                                    param.value
                                );

                                return (
                                    param.isVisible &&
                                    param.type !== constants.PARAM_TYPE.INFO &&
                                    (showAll || paramError || hasValue) && (
                                        <TableRow key={param.id}>
                                            <TableCell>
                                                <ParamsReviewLabel
                                                    error={!!paramError}
                                                    label={param.label}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {hasValue && (
                                                    <ParamsReviewValue
                                                        param={param}
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export { ParamGroupForm, ParamsReview };
