import React from "react";
import { useTranslation } from "i18n";

import ids from "../ids";
import SimpleExpansionPanel from "../SimpleExpansionPanel";
import globalConstants from "../../../constants";

import buildID from "components/utils/DebugIDUtil";
import FormCheckbox from "components/forms/FormCheckbox";
import FormSelectField from "components/forms/FormSelectField";
import FormNumberField from "components/forms/FormNumberField";

import { MenuItem, Typography } from "@material-ui/core";
import { Field, getIn } from "formik";
import numeral from "numeral";
import PropTypes from "prop-types";

const NETWORK_MODES = ["bridge", "none"];

const formatGBListItem = (size) => size && numeral(size).format("0 ib");
const formatGBValue = (size) => size && numeral(size).format("0.0 ib");

function buildLimitList(startValue, maxValue) {
    const limits = [0];

    let value = startValue;
    while (value <= maxValue) {
        limits.push(value);
        value *= 2;
    }

    if (limits[limits.length - 1] !== maxValue) {
        limits.push(maxValue);
    }

    return limits;
}

function Restrictions(props) {
    const {
        parentId,
        isAdmin,
        maxCPUCore,
        maxMemory,
        maxDiskSpace,
        form: { values },
    } = props;

    const { t } = useTranslation("tools");

    const maxCPUCoreList = buildLimitList(1, maxCPUCore);
    const memoryLimitList = buildLimitList(
        2 * globalConstants.ONE_GiB,
        maxMemory
    );
    const minDiskSpaceList = buildLimitList(
        globalConstants.ONE_GiB,
        maxDiskSpace
    );

    const validateMinCPUs = (value) => {
        if (value && value < 0) {
            return t("validationErrMustBePositive");
        }

        const max_cpu_cores = getIn(values, "container.max_cpu_cores");
        if (max_cpu_cores > 0 && value > max_cpu_cores) {
            return t("validationErrMinCPUsGreaterThanMax");
        }
    };

    const validateMaxCPUs = (value) => {
        if (value && value < 0) {
            return t("validationErrMustBePositive");
        }

        const min_cpu_cores = getIn(values, "container.min_cpu_cores");
        if (0 < value && value < min_cpu_cores) {
            return t("validationErrMaxCPUsLessThanMin");
        }
    };

    const validateMinRAM = (value) => {
        if (value && value < 0) {
            return t("validationErrMustBePositive");
        }

        const memory_limit = getIn(values, "container.memory_limit");
        if (memory_limit > 0 && value > memory_limit) {
            return t("validationErrMinRAMGreaterThanMax");
        }
    };

    const validateMaxRAM = (value) => {
        if (value && value < 0) {
            return t("validationErrMustBePositive");
        }

        const min_memory_limit = getIn(values, "container.min_memory_limit");
        if (0 < value && value < min_memory_limit) {
            return t("validationErrMaxRAMLessThanMin");
        }
    };

    return (
        <SimpleExpansionPanel header={t("restrictions")} parentId={parentId}>
            {isAdmin && (
                <Field
                    name="restricted"
                    label={t("restricted")}
                    id={buildID(parentId, ids.EDIT_TOOL_DLG.RESTRICTED)}
                    component={FormCheckbox}
                />
            )}
            {isAdmin && (
                <Field
                    name="container.min_cpu_cores"
                    label={t("minCPUCores")}
                    id={buildID(parentId, ids.EDIT_TOOL_DLG.MIN_CPU_CORES)}
                    component={FormNumberField}
                    validate={validateMinCPUs}
                />
            )}
            <Field
                name="container.max_cpu_cores"
                label={t("maxCPUCores")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.MAX_CPU_CORES)}
                component={FormSelectField}
                validate={validateMaxCPUs}
            >
                {maxCPUCoreList.map((size, index) => (
                    <MenuItem
                        key={index}
                        value={size}
                        id={buildID(
                            parentId,
                            ids.EDIT_TOOL_DLG.MAX_CPU_CORES,
                            size
                        )}
                    >
                        {size}
                    </MenuItem>
                ))}
            </Field>
            {isAdmin && (
                <Field
                    name="container.min_memory_limit"
                    label={t("minMemoryLimit")}
                    id={buildID(parentId, ids.EDIT_TOOL_DLG.MIN_MEMORY_LIMIT)}
                    component={FormNumberField}
                    validate={validateMinRAM}
                />
            )}
            <Field
                name="container.memory_limit"
                label={t("memoryLimit")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.MEMORY_LIMIT)}
                component={FormSelectField}
                renderValue={formatGBValue}
                validate={validateMaxRAM}
            >
                {memoryLimitList.map((size, index) => (
                    <MenuItem
                        key={index}
                        value={size}
                        id={buildID(
                            parentId,
                            ids.EDIT_TOOL_DLG.MEMORY_LIMIT,
                            size
                        )}
                    >
                        {formatGBListItem(size)}
                    </MenuItem>
                ))}
            </Field>
            {isAdmin && (
                <Field
                    name="container.cpu_shares"
                    label={t("cpuShares")}
                    id={buildID(parentId, ids.EDIT_TOOL_DLG.CPU_SHARES)}
                    component={FormNumberField}
                />
            )}
            <Field
                name="container.min_disk_space"
                label={t("minDiskSpace")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.MIN_DISK_SPACE)}
                component={FormSelectField}
                renderValue={formatGBValue}
            >
                {minDiskSpaceList.map((size, index) => (
                    <MenuItem
                        key={index}
                        value={size}
                        id={buildID(
                            parentId,
                            ids.EDIT_TOOL_DLG.MIN_DISK_SPACE,
                            size
                        )}
                    >
                        {formatGBListItem(size)}
                    </MenuItem>
                ))}
            </Field>
            {!isAdmin && (
                <Typography variant="caption">
                    {t("restrictionsSupport")}
                </Typography>
            )}
            <Field
                name="container.pids_limit"
                label={t("pidsLimit")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.PIDS_LIMIT)}
                disabled={!isAdmin}
                component={FormNumberField}
            />
            <Field
                name="container.network_mode"
                label={t("networkMode")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.NETWORK_MODE)}
                disabled={!isAdmin}
                component={FormSelectField}
            >
                {NETWORK_MODES.map((mode, index) => (
                    <MenuItem
                        key={index}
                        value={mode}
                        id={buildID(
                            parentId,
                            ids.EDIT_TOOL_DLG.NETWORK_MODE,
                            mode
                        )}
                    >
                        {mode}
                    </MenuItem>
                ))}
            </Field>
            <Field
                name="time_limit_seconds"
                label={t("timeLimit")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.TIME_LIMIT)}
                disabled={!isAdmin}
                component={FormNumberField}
            />
        </SimpleExpansionPanel>
    );
}

Restrictions.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    parentId: PropTypes.string.isRequired,
    maxCPUCore: PropTypes.number.isRequired,
    maxDiskSpace: PropTypes.number.isRequired,
    maxMemory: PropTypes.number.isRequired,
};

export default Restrictions;
