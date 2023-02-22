/**
 * @author psarando
 *
 * Form fields for displaying app parameters and parameter groups.
 */
import React from "react";

import { FastField, getIn } from "formik";

import GlobalConstants from "../../../constants";
import { Trans, useTranslation } from "i18n";

import { intercomShow } from "common/intercom";

import AppParamTypes from "components/models/AppParamTypes";
import ExternalLink from "components/utils/ExternalLink";

import { getAppParameterLaunchComponent } from "../utils";

import ids from "./ids";
import styles from "./styles";

import { isEmptyParamValue } from "./validate";

import buildID from "components/utils/DebugIDUtil";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Link,
    makeStyles,
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
    const baseParamId = buildID(baseId, paramIndex);

    switch (type) {
        case AppParamTypes.DOUBLE:
            return buildID(baseParamId, ids.APP_LAUNCH_DOUBLE_SPINNER);
        case AppParamTypes.DOUBLE_SELECTION:
            return buildID(baseParamId, ids.APP_LAUNCH_DOUBLE_SELECTION);
        case AppParamTypes.ENV_VAR:
            return buildID(baseParamId, ids.APP_LAUNCH_ENV_VAR);
        case AppParamTypes.FILE_INPUT:
            return buildID(baseParamId, ids.APP_LAUNCH_FILE_SELECTOR);
        case AppParamTypes.FILE_OUTPUT:
            return buildID(baseParamId, ids.APP_LAUNCH_OUTPUT_FILE);
        case AppParamTypes.FILE_FOLDER_INPUT:
            return buildID(baseParamId, ids.APP_LAUNCH_FILE_FOLDER_INPUT);
        case AppParamTypes.FLAG:
            return buildID(baseParamId, ids.APP_LAUNCH_FLAG);
        case AppParamTypes.FOLDER_INPUT:
            return buildID(baseParamId, ids.APP_LAUNCH_INPUT_FOLDER);
        case AppParamTypes.FOLDER_OUTPUT:
            return buildID(baseParamId, ids.APP_LAUNCH_OUTPUT_FOLDER);
        case AppParamTypes.INFO:
            return buildID(baseParamId, ids.APP_LAUNCH_INFO_LABEL);
        case AppParamTypes.INTEGER:
            return buildID(baseParamId, ids.APP_LAUNCH_INTEGER_SPINNER);
        case AppParamTypes.INTEGER_SELECTION:
            return buildID(baseParamId, ids.APP_LAUNCH_INTEGER_SELECTION);
        case AppParamTypes.MULTIFILE_OUTPUT:
            return buildID(baseParamId, ids.APP_LAUNCH_MULTI_FILE_OUTPUT);
        case AppParamTypes.MULTIFILE_SELECTOR:
            return buildID(baseParamId, ids.APP_LAUNCH_MULTI_FILE_INPUT);
        case AppParamTypes.MULTILINE_TEXT:
            return buildID(baseParamId, ids.APP_LAUNCH_MULTI_LINE_TEXT);
        case AppParamTypes.REFERENCE_ANNOTATION:
            return buildID(baseParamId, ids.APP_LAUNCH_REFERENCE_ANNOTATION);
        case AppParamTypes.REFERENCE_GENOME:
            return buildID(baseParamId, ids.APP_LAUNCH_REFERENCE_GENOME);
        case AppParamTypes.REFERENCE_SEQUENCE:
            return buildID(baseParamId, ids.APP_LAUNCH_REFERENCE_SEQUENCE);
        case AppParamTypes.TEXT:
            return buildID(baseParamId, ids.APP_LAUNCH_TEXT_INPUT);
        case AppParamTypes.TEXT_SELECTION:
            return buildID(baseParamId, ids.APP_LAUNCH_TEXT_SELECTION);
        default:
            return baseParamId;
    }
};

/**
 * Form fields and info display for an app parameter group.
 */
function ParamGroupForm(props) {
    const { baseId, fieldName, group, index, noOfGroups } = props;
    const classes = useStyles();
    const { t } = useTranslation("launch");
    return (
        <Accordion id={baseId} defaultExpanded>
            <AccordionSummary
                expandIcon={
                    <ExpandMore
                        id={buildID(baseId, ids.BUTTONS.EXPAND)}
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

                    const FieldComponent = getAppParameterLaunchComponent(
                        param.type
                    );

                    return (
                        <FastField
                            key={param.id}
                            id={paramFormId}
                            name={name}
                            component={FieldComponent}
                            param={param}
                        />
                    );
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
        case AppParamTypes.FLAG:
            return (
                <Typography className={classes.paramsReview}>
                    {value ? "✔︎" : ""}
                </Typography>
            );

        case AppParamTypes.MULTILINE_TEXT:
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
                    value={value}
                />
            );
        case AppParamTypes.MULTIFILE_SELECTOR:
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
                    value={value?.map((resource) => resource.path)?.join("\n")}
                />
            );

        case AppParamTypes.TEXT_SELECTION:
        case AppParamTypes.INTEGER_SELECTION:
        case AppParamTypes.DOUBLE_SELECTION:
            if (value?.display) {
                return (
                    <Typography className={classes.paramsReview}>
                        {value.display}
                    </Typography>
                );
            }
            break;

        case AppParamTypes.REFERENCE_GENOME:
        case AppParamTypes.REFERENCE_SEQUENCE:
        case AppParamTypes.REFERENCE_ANNOTATION:
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
                        id={buildID(baseId, ids.BUTTONS.CONTACT_SUPPORT)}
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
                        href={GlobalConstants.XSEDE_ALLOC_LINK}
                    />
                ),
            }}
        />
    );
};

const ShowAllParameters = ({ baseId, checked, onChange }) => {
    const switchId = buildID(baseId, ids.BUTTONS.SHOW_ALL_PARAMETERS);
    const helperTextID = buildID(switchId, ids.BUTTONS.HELPER_TEXT);
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
                                    param.type !== AppParamTypes.INFO &&
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
