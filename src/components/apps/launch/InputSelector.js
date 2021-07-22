/**
 * @author psarando, sriram
 *
 * Input Selector form field for picking a path from the data store.
 */
import React from "react";

import { useTranslation } from "i18n";

import {
    getParentPath,
    useSelectorDefaultFolderPath,
} from "components/data/utils";
import DataSelectionDrawer from "components/data/SelectionDrawer";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import { UploadTrackingProvider } from "contexts/uploadTracking";
import { useBootstrapInfo } from "contexts/bootstrap";

import { useSavePreferences } from "serviceFacades/users";

import ids from "./ids";
import styles from "./styles";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";

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
        disabled,
        startingPath,
        acceptedType,
        multiSelect,
        onConfirm,
    } = props;

    const { t } = useTranslation("launch");
    const [open, setOpen] = React.useState(false);
    const defaultStartingPath = useSelectorDefaultFolderPath();

    return (
        <>
            <Button
                id={buildID(baseId, ids.BUTTONS.BROWSE)}
                disabled={disabled}
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
                    startingPath={startingPath || defaultStartingPath}
                    acceptedType={acceptedType}
                    onConfirm={(selections) => {
                        setOpen(false);
                        onConfirm(selections);
                    }}
                    baseId={buildID(baseId, "dataSelection")}
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
    const bootstrapInfo = useBootstrapInfo()[0];

    //update last folder used.
    const [mutatePreferences] = useSavePreferences(null, (e) => {
        showErrorAnnouncer(prefI18n("savePrefError"), e);
    });

    const inputProps = {
        readOnly: true,
        endAdornment: (
            <InputAdornment position="end">
                <BrowseButton
                    baseId={id}
                    disabled={props.disabled}
                    startingPath={startingPath}
                    acceptedType={acceptedType}
                    multiSelect={false}
                    name={field.name}
                    onConfirm={(selection) => {
                        setFieldValue(field.name, selection);
                        const updatedPref = {
                            ...bootstrapInfo.preferences,
                            lastFolder: getParentPath(selection),
                        };
                        mutatePreferences({ preferences: updatedPref });
                    }}
                />
            </InputAdornment>
        ),
    };

    if (field.value && !required && !props.disabled) {
        inputProps.endAdornment = (
            <IconButton
                id={buildID(field.name, ids.BUTTONS.DELETE)}
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
