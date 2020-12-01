/**
 * @author sriram
 *
 * A field to collect path (with filename) from a user to save a newly created file.
 */
import React from "react";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import {
    build as buildDebugId,
    FormTextField,
    getFormError,
} from "@cyverse-de/ui-lib";

import {
    Button,
    Grid,
    IconButton,
    InputAdornment,
    makeStyles,
} from "@material-ui/core";

import ClearIcon from "@material-ui/icons/Clear";
import SaveAsDialog from "./SaveAsDialog";

const useStyles = makeStyles(styles);

const SaveAsButton = (props) => {
    const { baseId, startingPath, onConfirm } = props;
    const { t } = useTranslation("data");
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button
                id={buildDebugId(baseId, ids.SAVE_AS_BTN)}
                color="primary"
                size="small"
                variant="outlined"
                onClick={() => setOpen(true)}
            >
                {t("saveas")}
            </Button>
            <SaveAsDialog
                path={startingPath}
                open={open}
                onClose={() => setOpen(false)}
                onSaveAs={(path) => {
                    onConfirm(path);
                    setOpen(false);
                }}
            />
        </>
    );
};

const SaveAsField = ({ startingPath, showErrorAnnouncer, ...props }) => {
    // These props need to be spread down into the FormTextField
    const {
        id,
        field: { name, value },
        form: { touched, errors, setFieldValue },
        required,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation("data");
    const errorMsg = getFormError(name, touched, errors);

    const inputProps = {
        readOnly: true,
        endAdornment: (
            <InputAdornment position="end">
                <SaveAsButton
                    baseId={id}
                    startingPath={startingPath}
                    multiSelect={false}
                    name={name}
                    onConfirm={(path) => {
                        setFieldValue(name, path);
                    }}
                />
            </InputAdornment>
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
        <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
        >
            <Grid item xs>
                <FormTextField
                    InputProps={inputProps}
                    size="small"
                    className={classes.inputSelectorTextFiled}
                    error={errorMsg !== null}
                    {...props}
                />
            </Grid>
        </Grid>
    );
};

export { SaveAsButton };

export default withErrorAnnouncer(SaveAsField);
