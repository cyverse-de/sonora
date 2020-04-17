/**
 * @author psarando
 *
 * Form fields for selecting Reference Genome/Sequence/Annotation parameters.
 * Can also display as field loading skeletons while selection lists are fetched
 * from the backed services.
 */
import React from "react";

import ids from "../../utils/ids";

import messages from "./messages";

import {
    build as buildDebugId,
    FormTextField,
    getMessage,
    getFormError,
    withI18N,
} from "@cyverse-de/ui-lib";

import {
    FormControl,
    InputLabel,
    FormHelperText,
    MenuItem,
    makeStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    skeleton: {
        height: theme.spacing(6),
    },
}));

const FormFieldLoading = ({
    id,
    field: { name },
    label,
    required,
    form: { touched, errors },
    ...props
}) => {
    const classes = useStyles();
    const errorMsg = getFormError(name, touched, errors);
    const loadingFieldID = buildDebugId(id, ids.LOADING_SKELETON);
    const helperTextID = buildDebugId(loadingFieldID, "helper-text");

    return (
        <FormControl fullWidth error={!!errorMsg}>
            <InputLabel htmlFor={loadingFieldID} required={required}>
                {label}
            </InputLabel>
            <Skeleton
                id={loadingFieldID}
                aria-describedby={helperTextID}
                variant="text"
                className={classes.skeleton}
                {...props}
            />
            <FormHelperText id={helperTextID}>{errorMsg}</FormHelperText>
        </FormControl>
    );
};

const ReferenceGenomeSelect = withI18N(
    ({ referenceGenomes, referenceGenomesLoading, ...props }) => {
        const selectProps = { ...props };

        if (referenceGenomesLoading) {
            return <FormFieldLoading {...selectProps} />;
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
