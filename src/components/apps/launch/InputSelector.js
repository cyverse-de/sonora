/**
 * @author psarando, sriram
 *
 * Input Selector form field for picking a path from the data store.
 */
import React from "react";

import { useTranslation } from "i18n";

import { getParentPath } from "components/data/utils";
import DataSelectionDrawer from "components/data/SelectionDrawer";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { UploadTrackingProvider } from "contexts/uploadTracking";
import { usePreferences } from "contexts/userPreferences";

import { useSavePreferences } from "serviceFacades/users";

import ids from "./ids";
import styles from "./styles";

import { build as buildDebugId, FormTextField } from "@cyverse-de/ui-lib";

import {
    Button,
    IconButton,
    InputAdornment,
    makeStyles,
} from "@material-ui/core";

import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles(styles);

/**
 * A Browse button used by Input Selectors to open the data `SelectionDrawer`.
 */
const BrowseButton = (props) => {
    const {
        baseId,
        startingPath,
        acceptedType,
        multiSelect,
        onConfirm,
    } = props;
    const { t } = useTranslation("launch");
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <Button
                id={buildDebugId(baseId, ids.BUTTONS.BROWSE)}
                color="primary"
                size="small"
                variant="outlined"
                onClick={() => setOpen(true)}
            >
                {t("browse")}
            </Button>
            <UploadTrackingProvider>
                <DataSelectionDrawer
                    open={open}
                    onClose={() => setOpen(false)}
                    startingPath={startingPath}
                    acceptedType={acceptedType}
                    onConfirm={(selections) => {
                        setOpen(false);
                        onConfirm(selections);
                    }}
                    baseId={buildDebugId(baseId, "dataSelection")}
                    multiSelect={multiSelect}
                />
            </UploadTrackingProvider>
        </>
    );
};

/**
 * An Input Selector form field for picking data store file or folder paths.
 */
const InputSelector = ({
    acceptedType,
    startingPath,
    showErrorAnnouncer,
    ...props
}) => {
    // These props need to be spread down into the FormTextField
    const { id, field, form, required } = props;
    const classes = useStyles();
    const { t } = useTranslation("launch");
    const { t: prefI18n } = useTranslation("preferences");
    const { setFieldValue } = form;
    const [preferences, setPreferences] = usePreferences();

    //update last folder used.
    const [mutatePreferences] = useSavePreferences(
        (updatedPref) => {
            setPreferences(updatedPref.preferences);
        },
        (e) => {
            showErrorAnnouncer(prefI18n("savePrefError"), e);
        }
    );

    const inputProps = {
        readOnly: true,
        endAdornment: (
            <InputAdornment position="end">
                <BrowseButton
                    baseId={id}
                    startingPath={startingPath}
                    acceptedType={acceptedType}
                    multiSelect={false}
                    name={field.name}
                    onConfirm={(selection) => {
                        setFieldValue(field.name, selection);
                        const updatedPref = {
                            ...preferences,
                            lastFolder: getParentPath(selection),
                        };
                        mutatePreferences(updatedPref);
                    }}
                />
            </InputAdornment>
        ),
    };

    if (field.value && !required) {
        inputProps.endAdornment = (
            <IconButton
                id={buildDebugId(field.name, ids.BUTTONS.DELETE)}
                aria-label={t("clearInput")}
                size="small"
                onClick={() => setFieldValue(field.name, "")}
            >
                <ClearIcon />
            </IconButton>
        );
    }

    return (
        <FormTextField
            InputProps={inputProps}
            size="small"
            className={classes.inputSelectorTextFiled}
            {...props}
        />
    );
};

export { BrowseButton };

export default withErrorAnnouncer(InputSelector);
