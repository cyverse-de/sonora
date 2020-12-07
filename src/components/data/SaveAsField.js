/**
 * @author sriram
 *
 * A field to collect path (with filename) from a user to save a newly created file.
 */

import React from "react";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { useTranslation } from "i18n";
import ids from "./ids";
import styles from "./styles";

import { build as buildDebugId, FormTextField } from "@cyverse-de/ui-lib";

import { CircularProgress, IconButton, makeStyles } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles(styles);

const SaveAsField = ({ startingPath, showErrorAnnouncer, ...props }) => {
    // These props need to be spread down into the FormTextField
    const {
        id,
        field: { name, value },
        form: { setFieldValue },
        required,
        loading,
    } = props;

    const classes = useStyles();
    const { t } = useTranslation("data");
    const baseId = "saveAsFld";

    const inputProps = {
        readOnly: loading,
        endAdornment: (
            <>
                {loading && (
                    <CircularProgress
                        id={buildDebugId(
                            baseId,
                            ids.FOLDER_NAME,
                            ids.LOADING_SKELETON
                        )}
                        color="inherit"
                        size={20}
                    />
                )}
            </>
        ),
    };

    if (value && !required) {
        inputProps.endAdornment = (
            <IconButton
                id={buildDebugId(name, ids.DELETE_BTN)}
                aria-label={t("clearInput")}
                size="small"
                onClick={() => setFieldValue(name, "")}
            >
                <ClearIcon />
            </IconButton>
        );
    }

    return (
        <FormTextField
            id={buildDebugId(baseId, id)}
            size="small"
            className={classes.inputSelectorTextFiled}
            InputProps={inputProps}
            {...props}
        />
    );
};

export default withErrorAnnouncer(SaveAsField);
