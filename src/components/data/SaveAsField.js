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

import { build as buildDebugId, FormTextField } from "@cyverse-de/ui-lib";

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
    const { id, field, form, required } = props;
    const classes = useStyles();
    const { t } = useTranslation("data");
    const { setFieldValue } = form;

    const inputProps = {
        readOnly: true,
        endAdornment: (
            <InputAdornment position="end">
                <SaveAsButton
                    baseId={id}
                    startingPath={startingPath}
                    multiSelect={false}
                    name={field.name}
                    onConfirm={(path) => {
                        setFieldValue(field.name, path);
                    }}
                />
            </InputAdornment>
        ),
    };

    if (field.value && !required) {
        inputProps.endAdornment = (
            <IconButton
                id={buildDebugId(field.name, ids.DELETE_BTN)}
                aria-label={t("clearInput")}
                size="small"
                onClick={() => setFieldValue(field.name, "")}
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
                    {...props}
                />
            </Grid>
        </Grid>
    );
};

export { SaveAsButton };

export default withErrorAnnouncer(SaveAsField);
