import React from "react";

import messages from "./messages";

import { FormTextField, getMessage, withI18N } from "@cyverse-de/ui-lib";

import { CircularProgress, MenuItem } from "@material-ui/core";

const ReferenceGenomeSelect = withI18N(
    ({ referenceGenomes, referenceGenomesLoading, ...props }) => {
        const selectProps = { ...props };

        if (referenceGenomesLoading) {
            selectProps.SelectProps = { IconComponent: CircularProgress };
        } else if (!referenceGenomes?.length) {
            selectProps.error = true;
            selectProps.helperText = getMessage("errorLoadingReferenceGenomes");
        }

        return (
            <FormTextField select variant="outlined" {...selectProps}>
                {referenceGenomes.map((refGenome) => (
                    <MenuItem key={refGenome.id} value={refGenome}>
                        {refGenome.name}
                    </MenuItem>
                ))}
            </FormTextField>
        );
    },
    messages
);

export default ReferenceGenomeSelect;
