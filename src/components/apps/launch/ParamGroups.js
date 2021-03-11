/**
 * @author psarando
 *
 * Form fields for displaying app parameters and parameter groups.
 */
import React from "react";

import { Trans } from "react-i18next";
import { FastField, Field, getIn } from "formik";

import GlobalConstants from "../../../constants";
import { useTranslation } from "i18n";

import { intercomShow } from "common/intercom";

import AppParamTypes from "components/models/AppParamTypes";
import ExternalLink from "components/utils/ExternalLink";

import ids from "./ids";
import styles from "./styles";

import { isEmptyParamValue } from "./validate";

import ReferenceGenomeSelect from "./ReferenceGenomeSelect";

import Checkbox from "./params/Checkbox";
import Double from "./params/Double";
import FileFolderInput from "./params/FileFolderInput";
import FileInput from "./params/FileInput";
import FolderInput from "./params/FolderInput";
import Info from "./params/Info";
import Integer from "./params/Integer";
import MultiFileSelector from "./params/MultiFileSelector";
import MultilineText from "./params/MultilineText";
import Selection from "./params/Selection";
import Text from "./params/Text";

import { build as buildDebugId } from "@cyverse-de/ui-lib";

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
    const baseParamId = buildDebugId(baseId, paramIndex);

    switch (type) {
        case AppParamTypes.DOUBLE:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_DOUBLE_SPINNER);
        case AppParamTypes.DOUBLE_SELECTION:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_DOUBLE_SELECTION);
        case AppParamTypes.ENV_VAR:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_ENV_VAR);
        case AppParamTypes.FILE_INPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_FILE_SELECTOR);
        case AppParamTypes.FILE_OUTPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_OUTPUT_FILE);
        case AppParamTypes.FILE_FOLDER_INPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_FILE_FOLDER_INPUT);
        case AppParamTypes.FLAG:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_FLAG);
        case AppParamTypes.FOLDER_INPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_INPUT_FOLDER);
        case AppParamTypes.FOLDER_OUTPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_OUTPUT_FOLDER);
        case AppParamTypes.INFO:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_INFO_LABEL);
        case AppParamTypes.INTEGER:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_INTEGER_SPINNER);
        case AppParamTypes.INTEGER_SELECTION:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_INTEGER_SELECTION);
        case AppParamTypes.MULTIFILE_OUTPUT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_MULTI_FILE_OUTPUT);
        case AppParamTypes.MULTIFILE_SELECTOR:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_MULTI_FILE_INPUT);
        case AppParamTypes.MULTILINE_TEXT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_MULTI_LINE_TEXT);
        case AppParamTypes.REFERENCE_ANNOTATION:
            return buildDebugId(
                baseParamId,
                ids.APP_LAUNCH_REFERENCE_ANNOTATION
            );
        case AppParamTypes.REFERENCE_GENOME:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_REFERENCE_GENOME);
        case AppParamTypes.REFERENCE_SEQUENCE:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_REFERENCE_SEQUENCE);
        case AppParamTypes.TEXT:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_TEXT_INPUT);
        case AppParamTypes.TEXT_SELECTION:
            return buildDebugId(baseParamId, ids.APP_LAUNCH_TEXT_SELECTION);
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

                    let fieldComponent;

                    switch (param.type) {
                        case AppParamTypes.INFO:
                            fieldComponent = Info;
                            break;

                        case AppParamTypes.TEXT:
                            fieldComponent = Text;
                            break;

                        case AppParamTypes.INTEGER:
                            fieldComponent = Integer;
                            break;

                        case AppParamTypes.DOUBLE:
                            fieldComponent = Double;
                            break;

                        case AppParamTypes.MULTILINE_TEXT:
                            fieldComponent = MultilineText;
                            break;

                        case AppParamTypes.FLAG:
                            fieldComponent = Checkbox;
                            break;

                        case AppParamTypes.TEXT_SELECTION:
                        case AppParamTypes.INTEGER_SELECTION:
                        case AppParamTypes.DOUBLE_SELECTION:
                            fieldComponent = Selection;
                            break;

                        case AppParamTypes.FILE_INPUT:
                            fieldComponent = FileInput;
                            break;

                        case AppParamTypes.FOLDER_INPUT:
                            fieldComponent = FolderInput;
                            break;

                        case AppParamTypes.FILE_FOLDER_INPUT:
                            fieldComponent = FileFolderInput;
                            break;

                        case AppParamTypes.MULTIFILE_SELECTOR:
                            fieldComponent = MultiFileSelector;
                            break;

                        case AppParamTypes.REFERENCE_GENOME:
                        case AppParamTypes.REFERENCE_SEQUENCE:
                        case AppParamTypes.REFERENCE_ANNOTATION:
                            // Can't be a FastField since it renders with custom props.
                            return (
                                <Field
                                    key={param.id}
                                    id={paramFormId}
                                    name={name}
                                    component={ReferenceGenomeSelect}
                                    param={param}
                                />
                            );

                        default:
                            fieldComponent = Text;
                            break;
                    }

                    return (
                        <FastField
                            key={param.id}
                            id={paramFormId}
                            name={name}
                            component={fieldComponent}
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
                    value={Array.isArray(value) ? value.join("\n") : value}
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
                        href={GlobalConstants.XSEDE_ALLOC_LINK}
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
