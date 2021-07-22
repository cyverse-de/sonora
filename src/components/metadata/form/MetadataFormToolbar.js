/**
 * @author psarando
 */
import React from "react";

import { Trans } from "react-i18next";

import { useTranslation } from "i18n";

import BackButton from "components/utils/BackButton";
import SaveButton from "components/utils/SaveButton";
import DEDialog from "components/utils/DEDialog";

import ids from "../ids";
import styles from "../styles";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";

import {
    Divider,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Toolbar,
    Typography,
    makeStyles,
} from "@material-ui/core";

import ContentView from "@material-ui/icons/List";
import HelpIcon from "@material-ui/icons/Help";
import SaveIcon from "@material-ui/icons/Save";
import CopyIcon from "@material-ui/icons/FileCopy";
import SaveAltIcon from "@material-ui/icons/SaveAlt";

const useStyles = makeStyles(styles);

const MetadataFormToolbar = (props) => {
    const {
        baseId,
        title,
        saveDisabled,
        showSave,
        onSave,
        showSaveToFile,
        onSaveToFile,
        showCopy,
        onCopyMetadata,
        showViewInTemplate,
        onViewInTemplate,
        showImportIRODSMetadata,
        onImportIRODSMetadata,
    } = props;

    const [helpDialogOpen, setHelpDialogOpen] = React.useState(false);

    const { t } = useTranslation(["metadata", "common"]);

    const classes = useStyles();

    return (
        <Toolbar variant="dense" className={classes.metadataFormToolbar}>
            <BackButton />
            <Typography
                id={buildID(baseId, ids.TITLE)}
                variant="h6"
                color="inherit"
                className={classes.metadataFormTitle}
            >
                {title}
            </Typography>

            {showSave && (
                <SaveButton
                    baseId={baseId}
                    disabled={saveDisabled}
                    onSave={onSave}
                />
            )}

            <DotMenu
                baseId={baseId}
                buttonText={t("common:dotMenuText")}
                ButtonProps={{ classes: { root: classes.dotMenu } }}
                iconOnlyBreakpoint="sm"
                render={(onClose) => [
                    showViewInTemplate && (
                        <MenuItem
                            key={ids.BUTTONS.VIEW_TEMPLATES}
                            id={buildID(baseId, ids.BUTTONS.VIEW_TEMPLATES)}
                            onClick={() => {
                                onViewInTemplate();
                                onClose();
                            }}
                        >
                            <ListItemIcon>
                                <ContentView />
                            </ListItemIcon>
                            <ListItemText primary={t("viewInTemplate")} />
                        </MenuItem>
                    ),
                    showImportIRODSMetadata && (
                        <MenuItem
                            key={ids.BUTTONS.IMPORT_IRODS_METADATA}
                            id={buildID(
                                baseId,
                                ids.BUTTONS.IMPORT_IRODS_METADATA
                            )}
                            onClick={() => {
                                onImportIRODSMetadata();
                                onClose();
                            }}
                        >
                            <ListItemIcon>
                                <SaveAltIcon />
                            </ListItemIcon>
                            <ListItemText primary={t("importIRODSMetadata")} />
                        </MenuItem>
                    ),
                    showSaveToFile && (
                        <MenuItem
                            key={ids.BUTTONS.SAVE_METADATA_TO_FILE}
                            id={buildID(
                                baseId,
                                ids.BUTTONS.SAVE_METADATA_TO_FILE
                            )}
                            onClick={() => {
                                onSaveToFile();
                                onClose();
                            }}
                        >
                            <ListItemIcon>
                                <SaveIcon />
                            </ListItemIcon>
                            <ListItemText primary={t("saveToFile")} />
                        </MenuItem>
                    ),
                    showCopy && (
                        <MenuItem
                            key={ids.BUTTONS.COPY_METADATA}
                            id={buildID(baseId, ids.BUTTONS.COPY_METADATA)}
                            onClick={() => {
                                onCopyMetadata();
                                onClose();
                            }}
                        >
                            <ListItemIcon>
                                <CopyIcon />
                            </ListItemIcon>
                            <ListItemText primary={t("copyMetadata")} />
                        </MenuItem>
                    ),
                    <Divider key="divider" />,
                    <MenuItem
                        key={ids.BUTTONS.HELP}
                        id={buildID(baseId, ids.BUTTONS.HELP)}
                        onClick={() => {
                            setHelpDialogOpen(true);
                            onClose();
                        }}
                    >
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        <ListItemText primary={t("common:help")} />
                    </MenuItem>,
                ]}
            />

            <DEDialog
                baseId={baseId}
                open={helpDialogOpen}
                title={t("common:help")}
                onClose={() => {
                    setHelpDialogOpen(false);
                }}
            >
                <Typography component="div">
                    <Trans
                        t={t}
                        i18nKey="helpText"
                        components={{
                            p: <p />,
                        }}
                    />
                </Typography>
            </DEDialog>
        </Toolbar>
    );
};

export default MetadataFormToolbar;
