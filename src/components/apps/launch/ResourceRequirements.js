/**
 * @author psarando
 *
 * Form fields for adjusting (or reviewing) a step's resources requirements.
 * The range of each requirement is determined either by
 * the given min and max values provided in the `requirements` prop,
 * or from 0 to the default max prop (from client configs),
 * or from 0 to a reasonable max value set by this component.
 */
import React from "react";

import { FastField } from "formik";
import numeral from "numeral";

import ids from "./ids";
import messages from "./messages";
import styles from "./styles";

import {
    FormSelectField,
    build as buildDebugId,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    makeStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const ONE_GB = 1024 * 1024 * 1024;

const formatGBListItem = (size) => size && numeral(size).format("0 ib");
const formatGBValue = (size) => size && numeral(size).format("0.0 ib");

function buildLimitList(startValue, minValue, maxValue) {
    const limits = [0];

    let value = startValue;
    while (value <= maxValue) {
        if (value >= minValue) {
            limits.push(value);
        }
        value *= 2;
    }

    return limits;
}

/**
 * Form fields for selecting a step's resource requirements.
 *
 * @param {Object} props
 * @param {string} props.baseId
 * @param {number} props.index
 * @param {number} props.defaultMaxCPUCores
 * @param {number} props.defaultMaxMemory
 * @param {number} props.defaultMaxDiskSpace
 *
 * @param {Object} props.requirements - Step resource requirements and limits.
 * @param {number} props.requirements.min_cpu_cores
 * @param {number} props.requirements.max_cpu_cores
 * @param {number} props.requirements.min_memory_limit
 * @param {number} props.requirements.memory_limit
 * @param {number} props.requirements.min_disk_space
 */
const StepResourceRequirementsForm = ({
    baseId,
    requirements,
    index,
    defaultMaxCPUCores,
    defaultMaxMemory,
    defaultMaxDiskSpace,
}) => {
    const {
        min_cpu_cores,
        max_cpu_cores,
        min_memory_limit,
        memory_limit,
        min_disk_space,
    } = requirements;

    const minCPUCoreList = buildLimitList(
        1,
        min_cpu_cores || 0,
        max_cpu_cores || defaultMaxCPUCores || 8
    );
    const minMemoryList = buildLimitList(
        2 * ONE_GB,
        min_memory_limit || 0,
        memory_limit || defaultMaxMemory || 16 * ONE_GB
    );
    const minDiskSpaceList = buildLimitList(
        ONE_GB,
        min_disk_space || 0,
        defaultMaxDiskSpace || 512 * ONE_GB
    );

    return (
        <>
            <FastField
                id={buildDebugId(baseId, ids.RESOURCE_REQUESTS.TOOL_CPU)}
                name={`requirements.${index}.min_cpu_cores`}
                label={getMessage("minCPUCores")}
                component={FormSelectField}
            >
                {minCPUCoreList.map((size, index) => (
                    <MenuItem key={index} value={size}>
                        {size}
                    </MenuItem>
                ))}
            </FastField>
            <FastField
                id={buildDebugId(baseId, ids.RESOURCE_REQUESTS.TOOL_MEM)}
                name={`requirements.${index}.min_memory_limit`}
                label={getMessage("minMemory")}
                component={FormSelectField}
                renderValue={formatGBValue}
            >
                {minMemoryList.map((size, index) => (
                    <MenuItem key={index} value={size}>
                        {formatGBListItem(size)}
                    </MenuItem>
                ))}
            </FastField>
            <FastField
                id={buildDebugId(baseId, ids.RESOURCE_REQUESTS.MIN_DISK_SPACE)}
                name={`requirements.${index}.min_disk_space`}
                label={getMessage("minDiskSpace")}
                component={FormSelectField}
                renderValue={formatGBValue}
            >
                {minDiskSpaceList.map((size, index) => (
                    <MenuItem key={index} value={size}>
                        {formatGBListItem(size)}
                    </MenuItem>
                ))}
            </FastField>
        </>
    );
};

const ResourceRequirementsHeader = ({ headerMessageKey, step }) =>
    getMessage(headerMessageKey, { values: { step } });

const ResourceRequirementsForm = withI18N(
    ({
        baseId,
        defaultMaxCPUCores,
        defaultMaxMemory,
        defaultMaxDiskSpace,
        limits,
    }) => {
        const classes = useStyles();

        return (
            <ExpansionPanel defaultExpanded={false}>
                <ExpansionPanelSummary
                    expandIcon={
                        <ExpandMore
                            id={buildDebugId(baseId, ids.BUTTONS.EXPAND)}
                        />
                    }
                >
                    <Typography variant="subtitle1">
                        <ResourceRequirementsHeader headerMessageKey="resourceRequirements" />
                    </Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails
                    className={classes.expansionPanelDetails}
                >
                    <Typography variant="body1" gutterBottom>
                        {getMessage("helpMsgResourceRequirements")}
                    </Typography>

                    {limits.length === 1 ? (
                        <StepResourceRequirementsForm
                            baseId={buildDebugId(baseId, limits[0].step_number)}
                            requirements={limits[0]}
                            index={0}
                            defaultMaxCPUCores={defaultMaxCPUCores}
                            defaultMaxMemory={defaultMaxMemory}
                            defaultMaxDiskSpace={defaultMaxDiskSpace}
                        />
                    ) : (
                        limits.map((reqs, index) => {
                            return (
                                <ExpansionPanel key={reqs.step_number}>
                                    <ExpansionPanelSummary
                                        expandIcon={
                                            <ExpandMore
                                                id={buildDebugId(
                                                    baseId,
                                                    reqs.step_number,
                                                    ids.BUTTONS.EXPAND
                                                )}
                                            />
                                        }
                                    >
                                        <Typography variant="subtitle1">
                                            <ResourceRequirementsHeader
                                                headerMessageKey="resourceRequirementsForStep"
                                                step={reqs.step_number + 1}
                                            />
                                        </Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails
                                        className={
                                            classes.expansionPanelDetails
                                        }
                                    >
                                        <StepResourceRequirementsForm
                                            baseId={buildDebugId(
                                                baseId,
                                                reqs.step_number
                                            )}
                                            requirements={reqs}
                                            index={index}
                                            defaultMaxCPUCores={
                                                defaultMaxCPUCores
                                            }
                                            defaultMaxMemory={defaultMaxMemory}
                                            defaultMaxDiskSpace={
                                                defaultMaxDiskSpace
                                            }
                                        />
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            );
                        })
                    )}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    },
    messages
);

const StepResourceRequirementsReview = ({
    baseId,
    stepRequirements,
    headerMessageKey,
}) => {
    const {
        step_number,
        min_cpu_cores,
        min_memory_limit,
        min_disk_space,
    } = stepRequirements;

    return (
        !!(min_cpu_cores || min_memory_limit || min_disk_space) && (
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary
                    expandIcon={
                        <ExpandMore
                            id={buildDebugId(
                                baseId,
                                step_number,
                                ids.BUTTONS.EXPAND
                            )}
                        />
                    }
                >
                    <Typography variant="subtitle1">
                        <ResourceRequirementsHeader
                            headerMessageKey={headerMessageKey}
                            step={step_number + 1}
                        />
                    </Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {!!min_cpu_cores && (
                                    <TableRow>
                                        <TableCell>
                                            {getMessage("minCPUCores")}
                                        </TableCell>
                                        <TableCell>{min_cpu_cores}</TableCell>
                                    </TableRow>
                                )}
                                {!!min_memory_limit && (
                                    <TableRow>
                                        <TableCell>
                                            {getMessage("minMemory")}
                                        </TableCell>
                                        <TableCell>
                                            {formatGBValue(min_memory_limit)}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!!min_disk_space && (
                                    <TableRow>
                                        <TableCell>
                                            {getMessage("minDiskSpace")}
                                        </TableCell>
                                        <TableCell>
                                            {formatGBValue(min_disk_space)}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    );
};

/**
 * Displays a table listing each step's resource requirements if its value is
 * greater than 0.
 *
 * @param {Object} props
 * @param {string} props.baseId
 * @param {Object[]} props.requirements - Resource requirements for each step.
 * @param {number} props.requirements[].step_number
 * @param {number} props.requirements[].min_cpu_cores
 * @param {number} props.requirements[].min_memory_limit
 * @param {number} props.requirements[].min_disk_space
 */
const ResourceRequirementsReview = withI18N(({ baseId, requirements }) => {
    const headerMessageKey =
        requirements.length === 1
            ? "resourceRequirements"
            : "resourceRequirementsForStep";

    return requirements.map((stepRequirements) => (
        <StepResourceRequirementsReview
            baseId={baseId}
            key={stepRequirements.step_number}
            stepRequirements={stepRequirements}
            headerMessageKey={headerMessageKey}
        />
    ));
}, messages);

export { ResourceRequirementsForm, ResourceRequirementsReview };
