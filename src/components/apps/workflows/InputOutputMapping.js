/**
 * A form component for configuring Workflow Input to Output mappings.
 *
 * @author psarando
 */
import React from "react";

import { FastField } from "formik";

import { useTranslation } from "i18n";

import AppStepDisplay from "../AppStepDisplay";

import { build as buildID, FormTextField } from "@cyverse-de/ui-lib";
import { MenuItem, TextField } from "@material-ui/core";

function StepMapping(props) {
    const { baseId, availableOutputs, step, index } = props;

    const { t } = useTranslation("workflows");

    return (
        <AppStepDisplay label={step.name} step={index + 1}>
            {step?.task?.inputs?.map((input, inputIndex) => {
                const fieldName = `steps.${index}.task.inputs.${inputIndex}.output`;

                return (
                    index > 0 && (
                        <FastField
                            key={input.id}
                            id={buildID(baseId, fieldName)}
                            name={fieldName}
                            component={FormTextField}
                            select
                            variant="outlined"
                            label={input.label}
                            helperText={input.description}
                        >
                            <MenuItem value="">&nbsp;</MenuItem>
                            {availableOutputs?.map((output) => (
                                <MenuItem key={output.id} value={output}>
                                    {t("outputMappingLabel", {
                                        step: output.step + 1,
                                        label: output.label,
                                    })}
                                </MenuItem>
                            ))}
                        </FastField>
                    )
                );
            })}
            <TextField
                label={t("outputsLabel")}
                fullWidth
                variant="outlined"
                multiline
                InputProps={{
                    readOnly: true,
                }}
                value={step.task?.outputs
                    ?.map(({ label }) => label)
                    ?.join("\n")}
            />
        </AppStepDisplay>
    );
}

function InputOutputMapping(props) {
    const { baseId, steps } = props;

    let availableOutputs = [];

    return steps?.map((step, index) => {
        const outputs = [...availableOutputs];

        // Prep availableOutputs for next step
        availableOutputs = [...availableOutputs, ...(step.task?.outputs || [])];

        return (
            <StepMapping
                key={buildID(index, step.task_id)}
                baseId={baseId}
                step={step}
                index={index}
                availableOutputs={outputs}
            />
        );
    });
}

export default InputOutputMapping;
