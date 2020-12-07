/**
 * @author sriram
 *
 * A field to collect path (with filename) from a user to save a newly created file.
 */
import React, { useEffect, useState } from "react";

import { useTranslation } from "i18n";

import ids from "./ids";
import styles from "./styles";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import DataSelectionDrawer from "components/data/SelectionDrawer";
import { UploadTrackingProvider } from "contexts/uploadTracking";
import { useUserProfile } from "contexts/userProfile";
import { useConfig } from "contexts/config";
import ResourceTypes from "components/models/ResourceTypes";
import { parseNameFromPath } from "./utils";

import { build as buildDebugId, FormTextField } from "@cyverse-de/ui-lib";

import {
    Button,
    CircularProgress,
    Grid,
    Hidden,
    Paper,
    IconButton,
    makeStyles,
    Typography,
    useTheme,
} from "@material-ui/core";

import ClearIcon from "@material-ui/icons/Clear";
import { Folder } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const SaveAsField = ({ startingPath, showErrorAnnouncer, ...props }) => {
    // These props need to be spread down into the FormTextField
    const {
        id,
        path,
        field: { name, value },
        form: { setFieldValue },
        required,
        loading,
    } = props;

    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation("data");
    const [userProfile] = useUserProfile();
    const [config] = useConfig();
    const username = userProfile?.id;
    const irodsHomePath = config?.irods?.home_path;
    const [dest, setDest] = useState(path || `${irodsHomePath}/${username}`);
    const [selectionDrawerOpen, setSelectionDrawerOpen] = useState(false);

    const baseId = "saveAsFld";

    useEffect(() => {
        const val = parseNameFromPath(value);
        if (val) {
            setFieldValue(name, `${dest}/${val}`);
        } else {
            setFieldValue(name, "");
        }
    }, [setFieldValue, dest, value, name]);

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
        <Paper style={{ padding: theme.spacing(0.5) }}>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                spacing={1}
            >
                <Grid item xs>
                    <Typography
                        classes={{
                            root: classes.bottomPadding,
                        }}
                        component="span"
                        variant="body2"
                    >
                        {t("newFileLocation", {
                            path: dest,
                        })}
                    </Typography>
                    <Button
                        id={buildDebugId(baseId, ids.SAVE_BTN)}
                        size="small"
                        style={{
                            marginLeft: theme.spacing(1),
                        }}
                        variant="outlined"
                        disableElevation
                        color="primary"
                        onClick={() => setSelectionDrawerOpen(true)}
                        startIcon={<Folder fontSize="small" />}
                    >
                        <Hidden xsDown>{t("browse")}</Hidden>
                    </Button>
                </Grid>
                <Grid item xs>
                    <FormTextField
                        id={buildDebugId(baseId, id)}
                        size="small"
                        className={classes.inputSelectorTextFiled}
                        InputProps={inputProps}
                        {...props}
                    />
                </Grid>
            </Grid>
            <UploadTrackingProvider>
                <DataSelectionDrawer
                    open={selectionDrawerOpen}
                    startingPath={dest}
                    acceptedType={ResourceTypes.Folder}
                    onClose={() => setSelectionDrawerOpen(false)}
                    onConfirm={(selection) => {
                        setDest(selection);
                        setSelectionDrawerOpen(false);
                    }}
                    baseId={buildDebugId(baseId, "dataSelection")}
                    multiSelect={false}
                />
            </UploadTrackingProvider>
        </Paper>
    );
};

export default withErrorAnnouncer(SaveAsField);
