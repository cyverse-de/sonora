/**
 * @author psarando
 *
 * Form fields for displaying app parameters and parameter groups.
 */
import React from "react";

import sanitizeHtml from "sanitize-html";
import { FastField } from "formik";

import constants from "./constants";
import ids from "./ids";
import messages from "./messages";
import styles from "./styles";

import {
    build as buildDebugId,
    FormMultilineTextField,
    FormIntegerField,
    FormNumberField,
    FormTextField,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    makeStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles(styles);

/**
 * Form fields and info display for an app parameter group.
 */
const ParamGroupForm = withI18N((props) => {
    const classes = useStyles();

    const { baseId, fieldName, group } = props;

    return (
        <ExpansionPanel id={baseId} defaultExpanded>
            <ExpansionPanelSummary
                expandIcon={
                    <ExpandMore id={buildDebugId(baseId, ids.BUTTONS.EXPAND)} />
                }
            >
                <Typography variant="subtitle1">{group.label}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                {group.parameters.map((param, paramIndex) => {
                    if (!param.isVisible) {
                        return null;
                    }

                    const name = `${fieldName}.parameters.${paramIndex}.value`;
                    const paramFormId = buildDebugId(baseId, paramIndex);

                    let fieldProps = {
                        id: paramFormId,
                        name,
                        label: param.label,
                        required: param.required,
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

                        case constants.PARAM_TYPE.INTEGER:
                            fieldProps.component = FormIntegerField;
                            break;

                        case constants.PARAM_TYPE.DOUBLE:
                            fieldProps.component = FormNumberField;
                            break;

                        case constants.PARAM_TYPE.MULTILINE_TEXT:
                            fieldProps.component = FormMultilineTextField;
                            break;

                        default:
                            fieldProps.component = FormTextField;
                            break;
                    }

                    return <FastField key={param.id} {...fieldProps} />;
                })}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}, messages);

const ParamsReviewValue = ({ param }) => {
    if (param.type === constants.PARAM_TYPE.MULTILINE_TEXT) {
        return (
            <TextField
                multiline
                rows={3}
                variant="outlined"
                margin="dense"
                fullWidth
                InputProps={{
                    readOnly: true,
                }}
                value={param.value}
            />
        );
    }

    return param.value;
};

/**
 * A table summarizing the app parameter values and step resource requirements
 * that will be included in the final analysis submission.
 */
const ParamsReview = ({ groups }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableBody>
                {groups &&
                    groups.map((group) =>
                        group.parameters.map(
                            (param) =>
                                param.isVisible &&
                                (!!param.value || param.value === 0) && (
                                    <TableRow key={param.id}>
                                        <TableCell>{param.label}</TableCell>
                                        <TableCell>
                                            <ParamsReviewValue param={param} />
                                        </TableCell>
                                    </TableRow>
                                )
                        )
                    )}
            </TableBody>
        </Table>
    </TableContainer>
);

export { ParamGroupForm, ParamsReview };
