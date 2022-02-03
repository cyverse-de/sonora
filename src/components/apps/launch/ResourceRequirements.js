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
import { useTranslation } from "i18n";
import { FastField } from "formik";
import numeral from "numeral";

import constants from "../../../constants";

import ids from "./ids";

import styles from "./styles";

import buildID from "components/utils/DebugIDUtil";
import FormSelectField from "components/forms/FormSelectField";

import {
    makeStyles,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
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

    // Finally check the case where either maxValue is not a power of 2,
    // or minValue is greater than maxValue.
    const actualMaxValue = Math.max(minValue, maxValue);
    if (limits[limits.length - 1] < actualMaxValue) {
        limits.push(actualMaxValue);
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
    const { t } = useTranslation("launch");

    const {
        min_cpu_cores,
        max_cpu_cores,
        min_memory_limit,
        memory_limit,
        min_disk_space,
    } = requirements;
    const cpuCoreList = buildLimitList(
        1,
        min_cpu_cores || 0,
        max_cpu_cores || defaultMaxCPUCores || 8
    );
    const minMemoryList = buildLimitList(
        2 * constants.ONE_GiB,
        min_memory_limit || 0,
        memory_limit || defaultMaxMemory || 16 * constants.ONE_GiB
    );
    const minDiskSpaceList = buildLimitList(
        constants.ONE_GiB,
        min_disk_space || 0,
        defaultMaxDiskSpace || 512 * constants.ONE_GiB
    );

    return (
        <div style={{ margin: 8 }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        {t("selectMins")}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FastField
                        id={buildID(baseId, ids.RESOURCE_REQUESTS.TOOL_CPU)}
                        name={`requirements.${index}.min_cpu_cores`}
                        label={t("minCPUCores")}
                        component={FormSelectField}
                    >
                        {cpuCoreList.map((size, index) => (
                            <MenuItem key={index} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </FastField>
                </Grid>
                <Grid item xs={12}>
                    <FastField
                        id={buildID(baseId, ids.RESOURCE_REQUESTS.TOOL_MEM)}
                        name={`requirements.${index}.min_memory_limit`}
                        label={t("minMemory")}
                        component={FormSelectField}
                        renderValue={formatGBValue}
                    >
                        {minMemoryList.map((size, index) => (
                            <MenuItem key={index} value={size}>
                                {formatGBListItem(size)}
                            </MenuItem>
                        ))}
                    </FastField>
                </Grid>
                <Grid item xs={12}>
                    <FastField
                        id={buildID(
                            baseId,
                            ids.RESOURCE_REQUESTS.MIN_DISK_SPACE
                        )}
                        name={`requirements.${index}.min_disk_space`}
                        label={t("minDiskSpace")}
                        component={FormSelectField}
                        renderValue={formatGBValue}
                    >
                        {minDiskSpaceList.map((size, index) => (
                            <MenuItem key={index} value={size}>
                                {formatGBListItem(size)}
                            </MenuItem>
                        ))}
                    </FastField>
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="subtitle2">
                        {t("selectMaxes")}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FastField
                        id={buildID(baseId, "MAX_CPU")}
                        name={`requirements.${index}.max_cpu_cores`}
                        label={t("maxCPUCores")}
                        component={FormSelectField}
                    >
                        {cpuCoreList.map((size, index) => (
                            <MenuItem key={index} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </FastField>
                </Grid>
            </Grid>
        </div>
    );
};

const ResourceRequirementsHeader = ({ headerMessageKey, step, t }) =>
    t(headerMessageKey, { step });

const ResourceRequirementsForm = ({
    baseId,
    defaultMaxCPUCores,
    defaultMaxMemory,
    defaultMaxDiskSpace,
    limits,
}) => {
    const classes = useStyles();
    const { t } = useTranslation("launch");
    return (
        <>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={
                        <ExpandMore id={buildID(baseId, ids.BUTTONS.EXPAND)} />
                    }
                >
                    <Typography variant="subtitle1">
                        <ResourceRequirementsHeader
                            headerMessageKey="resourceRequirements"
                            t={t}
                        />
                    </Typography>
                </AccordionSummary>

                <AccordionDetails className={classes.accordionDetails}>
                    <Typography component="span" variant="body1">
                        {t("helpMsgResourceRequirements")}
                    </Typography>
                    {limits.length === 1 ? (
                        <StepResourceRequirementsForm
                            baseId={buildID(baseId, limits[0].step_number)}
                            requirements={limits[0]}
                            index={0}
                            defaultMaxCPUCores={defaultMaxCPUCores}
                            defaultMaxMemory={defaultMaxMemory}
                            defaultMaxDiskSpace={defaultMaxDiskSpace}
                        />
                    ) : (
                        // For apps with more than 1 step,
                        // each step's resource requirements will be nested
                        // under its own expansion panel.
                        limits.map((reqs, index) => {
                            return (
                                <Accordion key={reqs.step_number}>
                                    <AccordionSummary
                                        expandIcon={
                                            <ExpandMore
                                                id={buildID(
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
                                                t={t}
                                            />
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        className={classes.accordionDetails}
                                    >
                                        <StepResourceRequirementsForm
                                            baseId={buildID(
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
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })
                    )}
                </AccordionDetails>
            </Accordion>
        </>
    );
};

const StepResourceRequirementsReview = ({
    baseId,
    stepRequirements,
    headerMessageKey,
    showAll,
}) => {
    const { t } = useTranslation("launch");
    const {
        step_number,
        min_cpu_cores,
        min_memory_limit,
        min_disk_space,
        max_cpu_cores,
    } = stepRequirements;

    const hasRequest = !!(min_cpu_cores || min_memory_limit || min_disk_space);

    return (
        (showAll || hasRequest) && (
            <Accordion defaultExpanded={false}>
                <AccordionSummary
                    expandIcon={
                        <ExpandMore
                            id={buildID(
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
                            t={t}
                        />
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {(showAll || !!min_cpu_cores) && (
                                    <TableRow>
                                        <TableCell>
                                            {t("minCPUCores")}
                                        </TableCell>
                                        <TableCell>
                                            {min_cpu_cores || ""}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {(showAll || !!min_memory_limit) && (
                                    <TableRow>
                                        <TableCell>{t("minMemory")}</TableCell>
                                        <TableCell>
                                            {formatGBValue(min_memory_limit) ||
                                                ""}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {(showAll || !!min_disk_space) && (
                                    <TableRow>
                                        <TableCell>
                                            {t("minDiskSpace")}
                                        </TableCell>
                                        <TableCell>
                                            {formatGBValue(min_disk_space) ||
                                                ""}
                                        </TableCell>
                                    </TableRow>
                                )}
                                {(showAll || !!max_cpu_cores) && (
                                    <TableRow>
                                        <TableCell>
                                            {t("maxCPUCores")}
                                        </TableCell>
                                        <TableCell>
                                            {max_cpu_cores || ""}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>
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
const ResourceRequirementsReview = ({ baseId, requirements, showAll }) => {
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
            showAll={showAll}
        />
    ));
};
export { ResourceRequirementsForm, ResourceRequirementsReview };
