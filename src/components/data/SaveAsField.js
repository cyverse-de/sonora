/**
 * @author sriram
 *
 * A field to collect file name from a user to save a newly created file.
 * Must be used along with InputSelector to collect path to the new file.
 */

import React from "react";

import { useTranslation } from "i18n";
import ids from "./ids";
import styles from "./styles";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

import { CircularProgress, IconButton } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ClearIcon from "@mui/icons-material/Clear";

const useStyles = makeStyles(styles);

const SaveAsField = ({ loading, ...props }) => {
    // These props need to be spread down into the FormTextField
    const {
        id,
        field: { name, value },
        form: { setFieldValue },
        required,
    } = props;

    const classes = useStyles();
    const { t } = useTranslation("data");

    const inputProps = {
        readOnly: loading,
        endAdornment: (
            <>
                {loading && (
                    <CircularProgress
                        id={buildID(id, ids.FOLDER_NAME, ids.LOADING_SKELETON)}
                        color="inherit"
                        size={20}
                    />
                )}
            </>
        ),
    };

    if (value && !required && !loading) {
        inputProps.endAdornment = (
            <IconButton
                id={buildID(name, ids.DELETE_BTN)}
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
            id={id}
            size="small"
            className={classes.inputSelectorTextFiled}
            InputProps={inputProps}
            margin="dense"
            {...props}
        />
    );
};

export default SaveAsField;
