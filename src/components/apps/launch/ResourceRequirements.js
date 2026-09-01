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
import { FastField, Field, getIn, useFormikContext } from "formik";
import numeral from "numeral";

import constants from "../../../constants";

import { isPresetCompatible } from "./formatters";
import InitialDurationField from "./InitialDurationField";

import ids from "./ids";

import styles from "./styles";

import buildID from "components/utils/DebugIDUtil";
import FormCheckbox from "components/forms/FormCheckbox";
import FormSelectField from "components/forms/FormSelectField";
import TOOL_TYPES from "components/models/ToolTypes";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControl,
    FormControlLabel,
    Grid,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import { ExpandMore } from "@mui/icons-material";

const useStyles = makeStyles()(styles);

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

function buildGpuLimitList(minValue, maxValue) {
    const limits = buildLimitList(1, minValue, maxValue);

    return minValue > 0 ? limits.filter((value) => value !== 0) : limits;
}

/**
 * Picker for selecting a resource preset or "Custom" manual configuration.
 * Filters presets that don't meet the step's tool requirements.
 *
 * Self-contained: reads/writes all affected Formik fields directly
 * (resource_preset_id, max_cpu_cores, min_memory_limit, max_gpus,
 * and time_limit_seconds for VICE apps). Can be rendered on any wizard step.
 */
const ResourcePresetPicker = ({
    resourcePresets,
    requirements,
    index,
    defaultMaxCPUCores,
    defaultMaxMemory,
    maxTimeLimitSeconds,
    isVICE,
}) => {
    const { t } = useTranslation("launch");
    const { values, setFieldValue } = useFormikContext();

    const selectedPresetId = getIn(
        values,
        `requirements.${index}.resource_preset_id`
    );

    const filteredPresets = resourcePresets.filter((preset) =>
        isPresetCompatible(preset, requirements)
    );

    if (filteredPresets.length === 0) {
        return null;
    }

    const { max_cpu_cores, memory_limit } = requirements;

    const applyPresetValues = (preset) => {
        setFieldValue(
            `requirements.${index}.max_cpu_cores`,
            Math.min(
                preset.max_cpu_cores,
                max_cpu_cores || defaultMaxCPUCores || 8
            )
        );
        setFieldValue(
            `requirements.${index}.min_memory_limit`,
            Math.min(
                preset.min_memory_limit,
                memory_limit || defaultMaxMemory || 16 * constants.ONE_GiB
            )
        );
        setFieldValue(`requirements.${index}.max_gpus`, preset.max_gpus || 0);
        if (isVICE && preset.time_limit_seconds) {
            setFieldValue(
                "time_limit_seconds",
                maxTimeLimitSeconds
                    ? Math.min(preset.time_limit_seconds, maxTimeLimitSeconds)
                    : preset.time_limit_seconds
            );
        }
    };

    const getClampedTooltip = (preset) => {
        const messages = [];
        if (
            requirements.max_cpu_cores &&
            preset.max_cpu_cores > requirements.max_cpu_cores
        ) {
            messages.push(
                t("presetClamped", {
                    field: t("cpuCores"),
                    original: preset.max_cpu_cores,
                    effective: requirements.max_cpu_cores,
                })
            );
        }
        if (
            requirements.memory_limit &&
            preset.min_memory_limit > requirements.memory_limit
        ) {
            messages.push(
                t("presetClamped", {
                    field: t("minMemory"),
                    original: numeral(preset.min_memory_limit).format("0 ib"),
                    effective: numeral(requirements.memory_limit).format(
                        "0 ib"
                    ),
                })
            );
        }
        return messages.join("; ");
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (value === "custom") {
            setFieldValue(`requirements.${index}.resource_preset_id`, null);
        } else {
            const preset = filteredPresets.find((p) => p.id === value);
            setFieldValue(
                `requirements.${index}.resource_preset_id`,
                preset.id
            );
            applyPresetValues(preset);
        }
    };

    return (
        <FormControl sx={{ mb: 2, width: "100%" }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t("resourcePreset")}
            </Typography>
            <RadioGroup
                value={selectedPresetId || "custom"}
                onChange={handleChange}
            >
                {filteredPresets.map((preset) => {
                    const tooltip = getClampedTooltip(preset);
                    let label = `${preset.label} (${preset.max_cpu_cores} CPU, ${numeral(preset.min_memory_limit).format("0 ib")}`;
                    if (preset.max_gpus > 0) {
                        label += `, ${preset.max_gpus} GPU`;
                    }
                    if (preset.time_limit_seconds) {
                        const hours = preset.time_limit_seconds / 3600;
                        label +=
                            hours >= 1
                                ? `, ${hours}h`
                                : `, ${preset.time_limit_seconds / 60}m`;
                    }
                    label += ")";
                    return (
                        <Tooltip
                            key={preset.id}
                            title={tooltip}
                            placement="right"
                            disableHoverListener={!tooltip}
                        >
                            <FormControlLabel
                                value={preset.id}
                                control={<Radio size="small" />}
                                label={label}
                            />
                        </Tooltip>
                    );
                })}
                <FormControlLabel
                    value="custom"
                    control={<Radio size="small" />}
                    label={t("customResources")}
                />
            </RadioGroup>
        </FormControl>
    );
};

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
 * @param {number} props.requirements.min_gpus
 * @param {number} props.requirements.max_gpus
 *
 * @param {Object[]} [props.resourcePresets] - Available resource presets.
 */
const StepResourceRequirementsForm = ({
    baseId,
    requirements,
    index,
    defaultMaxCPUCores,
    defaultMaxMemory,
    defaultMaxDiskSpace,
    resourcePresets,
    maxTimeLimitSeconds,
    isVICE,
}) => {
    const { t } = useTranslation("launch");
    const { values } = useFormikContext();

    const {
        min_cpu_cores,
        max_cpu_cores,
        min_memory_limit,
        memory_limit,
        min_disk_space,
        min_gpus,
        max_gpus,
        gpu_models: availableGpuModels,
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
    const gpuMinValue = min_gpus ?? 0;
    const gpuList = buildGpuLimitList(gpuMinValue, max_gpus || 8);

    const currentMaxGpus =
        getIn(values, `requirements.${index}.max_gpus`) ?? max_gpus;
    const showGpuModelsSelector =
        availableGpuModels?.length > 1 && currentMaxGpus > 0;

    const selectedPresetId = getIn(
        values,
        `requirements.${index}.resource_preset_id`
    );
    const isPresetSelected = !!selectedPresetId;

    return (
        <div style={{ margin: 8 }}>
            {resourcePresets?.length > 0 && (
                <ResourcePresetPicker
                    resourcePresets={resourcePresets}
                    requirements={requirements}
                    index={index}
                    defaultMaxCPUCores={defaultMaxCPUCores}
                    defaultMaxMemory={defaultMaxMemory}
                    maxTimeLimitSeconds={maxTimeLimitSeconds}
                    isVICE={isVICE}
                />
            )}
            <Grid container spacing={1}>
                <Grid size={12}>
                    <Field
                        id={buildID(baseId, ids.RESOURCE_REQUESTS.TOOL_CPU)}
                        name={`requirements.${index}.max_cpu_cores`}
                        label={t("cpuCores")}
                        component={FormSelectField}
                        disabled={isPresetSelected}
                    >
                        {cpuCoreList.map((size, index) => (
                            <MenuItem key={index} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Field>
                </Grid>
                <Grid size={12}>
                    <Field
                        id={buildID(baseId, ids.RESOURCE_REQUESTS.TOOL_MEM)}
                        name={`requirements.${index}.min_memory_limit`}
                        label={t("minMemory")}
                        component={FormSelectField}
                        renderValue={formatGBValue}
                        disabled={isPresetSelected}
                    >
                        {minMemoryList.map((size, index) => (
                            <MenuItem key={index} value={size}>
                                {formatGBListItem(size)}
                            </MenuItem>
                        ))}
                    </Field>
                </Grid>
                <Grid size={12}>
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
                {max_gpus > 0 && min_gpus !== max_gpus && (
                    <Grid size={12}>
                        <Field
                            id={buildID(baseId, ids.RESOURCE_REQUESTS.TOOL_GPU)}
                            name={`requirements.${index}.max_gpus`}
                            label={t("gpus")}
                            component={FormSelectField}
                            disabled={isPresetSelected}
                        >
                            {gpuList.map((size, index) => (
                                <MenuItem key={index} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Field>
                    </Grid>
                )}
                {showGpuModelsSelector && (
                    <Grid size={12}>
                        <FastField
                            id={buildID(
                                baseId,
                                ids.RESOURCE_REQUESTS.TOOL_GPU_MODELS
                            )}
                            name={`requirements.${index}.gpu_models`}
                            label={t("gpuModels")}
                            component={FormSelectField}
                            multiple
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {availableGpuModels.map((model) => (
                                <MenuItem key={model} value={model}>
                                    {model}
                                </MenuItem>
                            ))}
                        </FastField>
                    </Grid>
                )}
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
    overallJobType,
    limits,
    resourcePresets,
    maxTimeLimitSeconds,
}) => {
    const { classes } = useStyles();
    const { t } = useTranslation("launch");
    const { values } = useFormikContext();
    const isVICE = overallJobType === TOOL_TYPES.INTERACTIVE;

    // Compute locked time limit from the selected preset (if any step has one).
    const lockedTimeLimitSeconds = isVICE
        ? values.requirements?.reduce((locked, req) => {
              if (locked) return locked;
              const p = resourcePresets?.find(
                  (pr) => pr.id === req?.resource_preset_id
              );
              return p?.time_limit_seconds || null;
          }, null)
        : null;

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
                            resourcePresets={resourcePresets}
                            maxTimeLimitSeconds={maxTimeLimitSeconds}
                            isVICE={isVICE}
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
                                            resourcePresets={resourcePresets}
                                            maxTimeLimitSeconds={
                                                maxTimeLimitSeconds
                                            }
                                            isVICE={isVICE}
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })
                    )}
                </AccordionDetails>
            </Accordion>
            {isVICE && maxTimeLimitSeconds && (
                <InitialDurationField
                    baseId={buildID(baseId, ids.RESOURCE_REQUESTS)}
                    maxTimeLimitSeconds={maxTimeLimitSeconds}
                    lockedValue={lockedTimeLimitSeconds}
                />
            )}
            {isVICE && (
                <FastField
                    id={buildID(baseId, ids.RESOURCE_REQUESTS.MOUNT_DATA_STORE)}
                    name="mount_data_store"
                    label={t("mountDataStore")}
                    helperText={t("mountDataStoreHelp")}
                    component={FormCheckbox}
                />
            )}
        </>
    );
};

const ResourceRequirementsReviewRow = ({
    label,
    value,
    valueFormatter,
    showAll,
    error,
}) =>
    (showAll || error || !!value) && (
        <TableRow>
            <TableCell>
                <Typography color={error ? "error" : "initial"}>
                    {label}
                </Typography>
            </TableCell>
            <TableCell>{valueFormatter(value) || ""}</TableCell>
        </TableRow>
    );

const StepResourceRequirementsReview = ({
    baseId,
    stepRequirements,
    stepRequirementErrors,
    headerMessageKey,
    showAll,
}) => {
    const { t } = useTranslation("launch");
    const {
        step_number,
        min_memory_limit,
        min_disk_space,
        max_cpu_cores,
        max_gpus,
        gpu_models,
    } = stepRequirements;

    const hasRequest = !!(
        min_memory_limit ||
        min_disk_space ||
        max_cpu_cores ||
        max_gpus
    );

    return (
        (showAll || hasRequest) && (
            <Accordion
                defaultExpanded={
                    !!(
                        stepRequirementErrors?.min_memory_limit ||
                        stepRequirementErrors?.min_disk_space ||
                        stepRequirementErrors?.max_cpu_cores ||
                        stepRequirementErrors?.max_gpus
                    )
                }
            >
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
                                <ResourceRequirementsReviewRow
                                    label={t("cpuCores")}
                                    value={max_cpu_cores}
                                    valueFormatter={(value) => value}
                                    showAll={showAll}
                                    error={stepRequirementErrors?.max_cpu_cores}
                                />
                                <ResourceRequirementsReviewRow
                                    label={t("minMemory")}
                                    value={min_memory_limit}
                                    valueFormatter={formatGBValue}
                                    showAll={showAll}
                                    error={
                                        stepRequirementErrors?.min_memory_limit
                                    }
                                />
                                <ResourceRequirementsReviewRow
                                    label={t("minDiskSpace")}
                                    value={min_disk_space}
                                    valueFormatter={formatGBValue}
                                    showAll={showAll}
                                    error={
                                        stepRequirementErrors?.min_disk_space
                                    }
                                />
                                <ResourceRequirementsReviewRow
                                    label={t("gpus")}
                                    value={max_gpus}
                                    valueFormatter={(value) => value}
                                    showAll={showAll}
                                    error={stepRequirementErrors?.max_gpus}
                                />
                                {gpu_models?.length > 0 && (
                                    <ResourceRequirementsReviewRow
                                        label={t("gpuModels")}
                                        value={gpu_models}
                                        valueFormatter={(value) =>
                                            value.join(", ")
                                        }
                                        showAll={showAll}
                                    />
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
 * @param {number} props.requirements[].max_gpus
 */
const ResourceRequirementsReview = ({
    baseId,
    requirements,
    errors,
    showAll,
}) => {
    const headerMessageKey =
        requirements.length === 1
            ? "resourceRequirements"
            : "resourceRequirementsForStep";

    return requirements.map((stepRequirements, index) => (
        <StepResourceRequirementsReview
            baseId={baseId}
            key={stepRequirements.step_number}
            stepRequirements={stepRequirements}
            stepRequirementErrors={getIn(errors, `requirements.${index}`)}
            headerMessageKey={headerMessageKey}
            showAll={showAll}
        />
    ));
};
export {
    ResourcePresetPicker,
    ResourceRequirementsForm,
    ResourceRequirementsReview,
    buildGpuLimitList,
};
