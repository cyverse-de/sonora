import React, { useEffect, useState } from "react";

import { getReferenceGenomes } from "../../endpoints/ReferenceGenomes";

import { FormSelectField, stableSort } from "@cyverse-de/ui-lib";

import { CircularProgress, MenuItem } from "@material-ui/core";

const ReferenceGenomeSelect = (props) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getReferenceGenomes().then((resp) => {
            const genomes = resp?.genomes || [];
            setOptions(
                stableSort(genomes, (a, b) => a.name.localeCompare(b.name))
            );
            setLoading(false);
        });
    }, []);

    const selectProps = loading
        ? {
              ...props,
              IconComponent: CircularProgress,
          }
        : props;

    return (
        <FormSelectField variant="outlined" {...selectProps}>
            {options.map((refGenome) => (
                <MenuItem key={refGenome.id} value={refGenome}>
                    {refGenome.name}
                </MenuItem>
            ))}
        </FormSelectField>
    );
};

export default ReferenceGenomeSelect;
