import React from "react";

import { FormSelectField } from "@cyverse-de/ui-lib";

import { CircularProgress, MenuItem } from "@material-ui/core";

const ReferenceGenomeSelect = ({
    referenceGenomes,
    referenceGenomesLoading,
    ...props
}) => {
    const selectProps = referenceGenomesLoading
        ? {
              ...props,
              IconComponent: CircularProgress,
          }
        : props;

    return (
        <FormSelectField variant="outlined" {...selectProps}>
            {referenceGenomes.map((refGenome) => (
                <MenuItem key={refGenome.id} value={refGenome}>
                    {refGenome.name}
                </MenuItem>
            ))}
        </FormSelectField>
    );
};

export default ReferenceGenomeSelect;
