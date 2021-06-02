/**
 * @author sriram
 *
 * A toolbar for file viewer.
 *
 *
 */
import React, { useEffect, useState } from "react";

import { useMutation, queryCache, useQuery } from "react-query";
import { useTranslation } from "i18n";
import { NavigationParams } from "common/NavigationConstants";

import ids from "./ids";
import viewerConstants from "./constants";

import { getInfoTypes, INFO_TYPES_QUERY_KEY } from "serviceFacades/filesystem";
import DetailsDrawer from "components/data/details/Drawer";
import ResourceTypes from "components/models/ResourceTypes";

import BackButton from "components/utils/BackButton";
import { getHost } from "components/utils/getHost";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import { ERROR_CODES, getErrorCode } from "components/utils/error/errorCode";

import SaveAsDialog from "../SaveAsDialog";
import { getParentPath } from "../utils";

import { uploadTextAsFile } from "serviceFacades/fileio";

import {
    announce,
    AnnouncerConstants,
    build,
    DotMenu,
} from "@cyverse-de/ui-lib";
import {
    Button,
    Divider,
    Hidden,
    FormControlLabel,
    FormGroup,
    Switch,
    Toolbar,
    Typography,
    ListItemIcon,
    ListItemText,
    MenuItem,
    useTheme,
    useMediaQuery,
    Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    Add,
    CloudDownload,
    Delete,
    Info,
    List as MetadataIcon,
    Refresh,
    Save,
    Visibility as ReadOnlyIcon,
    Edit as EditableIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    divider: {
        flexGrow: 1,
    },
    toolbarItems: {
        margin: theme.spacing(0.5),
    },
    separator: {
        margin: theme.spacing(0.5),
    },
    editIcon: {
        color: theme.palette.info.main,
        marginLeft: theme.spacing(0.5),
        cursor: "pointer",
    },
}));

function ViewerToolbar(props) {
    const {
        baseId,
        path,
        resourceId,
        isPathListViewer,
        showLineNumbers,
        onShowLineNumbers,
        wrapText,
        onWrapText,
        showErrorAnnouncer,
        firstRowHeader,
        onFirstRowHeader,
        onAddRow,
        onDeleteRow,
        editable,
        onSave,
        selectionCount,
        dirty,
        onRefresh,
        handlePathChange,
        fileName,
        createFileType,
        onNewFileSaved,
        getFileContent,
        onSaving,
        onSaveComplete,
    } = props;

    const theme = useTheme();

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [download, setDownload] = useState(false);
    const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
    const [saveNewFileError, setSaveNewFileError] = useState(null);
    const [fileSavePath, setFileSavePath] = useState();

    const classes = useStyles();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    useEffect(() => {
        if (!infoTypesCache || infoTypesCache.length === 0) {
            setInfoTypesQueryEnabled(true);
        } else {
            if (infoTypes === null || infoTypes.length === 0) {
                setInfoTypes(infoTypesCache.types);
            }
        }
    }, [infoTypes, infoTypesCache]);

    useEffect(() => {
        if (download) {
            window.open(`${getHost()}/api/download?path=${path}`, "_blank");
            setDownload(false);
        }
    }, [path, download]);

    useQuery({
        queryKey: INFO_TYPES_QUERY_KEY,
        queryFn: getInfoTypes,
        config: {
            enabled: infoTypesQueryEnabled,
            onSuccess: (resp) => setInfoTypes(resp.types),
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                showErrorAnnouncer(t("infoTypeFetchError"), e);
            },
        },
    });

    const [saveTextAsFile, { isLoading: fileSaveLoading }] = useMutation(
        uploadTextAsFile,
        {
            onSuccess: (resp) => {
                onSaveComplete(resp);
                announce({
                    text: t("fileSaveSuccess", {
                        fileName: resp?.file.label,
                    }),
                    variant: AnnouncerConstants.SUCCESS,
                });

                if (createFileType && onNewFileSaved) {
                    //reload the viewer
                    onNewFileSaved(resp?.file.path, resp?.file.id);
                }
            },
            onError: (error) => {
                if (createFileType) {
                    const text =
                        getErrorCode(error) === ERROR_CODES.ERR_EXISTS
                            ? t("fileExists", {
                                  path: getParentPath(fileSavePath),
                              })
                            : t("fileSaveError");
                    setSaveNewFileError(text);
                } else {
                    showErrorAnnouncer(t("fileSaveError", { fileName }), error);
                }
            },
        }
    );

    const saveFile = () => {
        if (createFileType) {
            setSaveAsDialogOpen(true);
        } else {
            onSaving(fileSaveLoading);
            saveTextAsFile({
                dest: path,
                content: getFileContent(),
                newFile: false,
            });
        }
    };

    const onViewDetails = () =>
        setDetailsResource({
            id: resourceId,
            path,
            label: fileName,
            type: ResourceTypes.FILE,
        });

    const onViewMetadata = () =>
        handlePathChange(path, { view: NavigationParams.VIEW.METADATA });

    const ToolbarButton = ({ idExtension, text, ...props }) => {
        return (
            <Button
                id={build(baseId, idExtension)}
                size="small"
                className={classes.toolbarItems}
                variant="outlined"
                disableElevation
                color="primary"
                {...props}
            >
                <Hidden xsDown>{text}</Hidden>
            </Button>
        );
    };
    const LineNumberSwitch = ({ id }) => (
        <Switch
            id={id}
            size="small"
            checked={showLineNumbers}
            onChange={(event) => onShowLineNumbers(event.target.checked)}
            name={t("showLineNumbers")}
            color="primary"
        />
    );

    const WrapSwitch = ({ id }) => (
        <Switch
            id={id}
            size="small"
            checked={wrapText}
            onChange={(event) => onWrapText(event.target.checked)}
            name={t("wrapText")}
            color="primary"
        />
    );

    return (
        <>
            <Toolbar variant="dense" id={baseId}>
                <BackButton dirty={dirty} />
                <Divider
                    orientation="vertical"
                    flexItem
                    className={classes.separator}
                />
                <Typography
                    variant="body2"
                    color="primary"
                    style={{ marginLeft: theme.spacing(1) }}
                >
                    {fileName}
                </Typography>
                {editable && (
                    <Tooltip title={t("editableTooltip")}>
                        <EditableIcon
                            fontSize="small"
                            className={classes.editIcon}
                        />
                    </Tooltip>
                )}
                {!editable && (
                    <Tooltip
                        title={t("readOnlyFileTooltip", {
                            maxEditSize: viewerConstants.DEFAULT_PAGE_SIZE,
                        })}
                    >
                        <ReadOnlyIcon
                            fontSize="small"
                            className={classes.editIcon}
                        />
                    </Tooltip>
                )}
                <div className={classes.divider} />
                {!isSmall && (
                    <>
                        {onWrapText && (
                            <FormGroup
                                row
                                style={{ marginLeft: theme.spacing(1) }}
                            >
                                <FormControlLabel
                                    control={
                                        <WrapSwitch
                                            id={build(
                                                baseId,
                                                ids.WRAP_TEXT_SWITCH
                                            )}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {t("wrapText")}
                                        </Typography>
                                    }
                                />
                            </FormGroup>
                        )}
                        {onShowLineNumbers && (
                            <FormGroup
                                row
                                style={{ marginLeft: theme.spacing(1) }}
                            >
                                <FormControlLabel
                                    control={
                                        <LineNumberSwitch
                                            id={build(
                                                baseId,
                                                ids.LINE_NUMBERS_SWITCH
                                            )}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {t("showLineNumbers")}
                                        </Typography>
                                    }
                                />
                            </FormGroup>
                        )}
                        {onFirstRowHeader && (
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id={build(
                                                baseId,
                                                ids.HEADER_SWITCH
                                            )}
                                            size="small"
                                            checked={firstRowHeader}
                                            onChange={(event) =>
                                                onFirstRowHeader(
                                                    event.target.checked
                                                )
                                            }
                                            name={t("firstRowHeader")}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {t("firstRowHeader")}
                                        </Typography>
                                    }
                                />
                            </FormGroup>
                        )}

                        {editable && (
                            <>
                                {isPathListViewer && (
                                    <>
                                        <ToolbarButton
                                            idExtension={ids.ADD_BTN}
                                            onClick={onAddRow}
                                            startIcon={<Add fontSize="small" />}
                                            text={t("add")}
                                        />
                                        <ToolbarButton
                                            idExtension={ids.DELETE_BTN}
                                            onClick={onDeleteRow}
                                            startIcon={
                                                <Delete fontSize="small" />
                                            }
                                            text={t("delete")}
                                            disabled={selectionCount === 0}
                                        />
                                    </>
                                )}
                                <ToolbarButton
                                    idExtension={ids.SAVE_BTN}
                                    onClick={saveFile}
                                    startIcon={<Save fontSize="small" />}
                                    text={i18nCommon("save")}
                                    disabled={!dirty}
                                />
                            </>
                        )}
                    </>
                )}

                <DotMenu
                    baseId={baseId}
                    buttonText={i18nCommon("dotMenuText")}
                    iconOnlyBreakpoint="sm"
                    render={(onClose) => [
                        isSmall && onShowLineNumbers && (
                            <MenuItem
                                key={build(baseId, ids.LINE_NUMBER_SWITCH)}
                            >
                                <ListItemIcon>
                                    <LineNumberSwitch
                                        id={build(
                                            baseId,
                                            ids.LINE_NUMBER_SWITCH
                                        )}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={t("showLineNumbers")} />
                            </MenuItem>
                        ),
                        isSmall && onWrapText && (
                            <MenuItem key={build(baseId, ids.WRAP_TEXT_SWITCH)}>
                                <ListItemIcon>
                                    <WrapSwitch
                                        id={build(baseId, ids.WRAP_TEXT_SWITCH)}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={t("wrapText")} />
                            </MenuItem>
                        ),
                        isSmall && onFirstRowHeader && (
                            <MenuItem
                                key={build(
                                    baseId,
                                    ids.FIRST_ROW_HEADER_MENU_ITEM
                                )}
                            >
                                <ListItemIcon>
                                    <Switch
                                        id={build(baseId, ids.HEADER_SWITCH)}
                                        size="small"
                                        checked={firstRowHeader}
                                        onChange={(event) => {
                                            onFirstRowHeader(
                                                event.target.checked
                                            );
                                        }}
                                        color="primary"
                                        inputProps={{
                                            "aria-labelledby": build(
                                                baseId,
                                                ids.FIRST_ROW_HEADER_MENU_ITEM
                                            ),
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    id={build(
                                        baseId,
                                        ids.FIRST_ROW_HEADER_MENU_ITEM
                                    )}
                                    primary={t("firstRowHeader")}
                                />
                            </MenuItem>
                        ),
                        isSmall &&
                            editable && [
                                <MenuItem
                                    key={build(baseId, ids.SAVE_MENU_ITEM)}
                                    id={build(baseId, ids.SAVE_MENU_ITEM)}
                                    onClick={() => {
                                        onClose();
                                        onSave();
                                    }}
                                    disabled={!dirty}
                                >
                                    <ListItemIcon>
                                        <Save fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={i18nCommon("save")}
                                    />
                                </MenuItem>,
                                isPathListViewer && [
                                    <MenuItem
                                        key={build(baseId, ids.ADD_MENU_ITEM)}
                                        id={build(baseId, ids.ADD_MENU_ITEM)}
                                        onClick={() => {
                                            onClose();
                                            onAddRow();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Add fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("add")} />
                                    </MenuItem>,
                                    <MenuItem
                                        key={build(
                                            baseId,
                                            ids.DELETE_MENU_ITEM
                                        )}
                                        id={build(baseId, ids.DELETE_MENU_ITEM)}
                                        onClick={() => {
                                            onClose();
                                            onDeleteRow();
                                        }}
                                        disabled={selectionCount === 0}
                                    >
                                        <ListItemIcon>
                                            <Delete fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("delete")} />
                                    </MenuItem>,
                                ],
                            ],
                        !createFileType && [
                            <MenuItem
                                key={ids.DETAILS_MENU_ITEM}
                                id={build(baseId, ids.DETAILS_MENU_ITEM)}
                                onClick={() => {
                                    onClose();
                                    onViewDetails();
                                }}
                            >
                                <ListItemIcon>
                                    <Info fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={t("details")} />
                            </MenuItem>,
                            <MenuItem
                                key={ids.METADATA_MENU_ITEM}
                                id={build(baseId, ids.METADATA_MENU_ITEM)}
                                onClick={() => {
                                    onClose();
                                    onViewMetadata();
                                }}
                            >
                                <ListItemIcon>
                                    <MetadataIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={t("metadata")} />
                            </MenuItem>,
                            <MenuItem
                                key={ids.DOWNLOAD_MENU_ITEM}
                                id={build(baseId, ids.DOWNLOAD_MENU_ITEM)}
                                onClick={() => {
                                    onClose();
                                    setDownload(true);
                                }}
                            >
                                <ListItemIcon>
                                    <CloudDownload fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={t("download")} />
                            </MenuItem>,
                            <MenuItem
                                key={ids.REFRESH_MENU_ITEM}
                                id={build(baseId, ids.REFRESH_MENU_ITEM)}
                                onClick={onRefresh}
                            >
                                <ListItemIcon>
                                    <Refresh fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={i18nCommon("refresh")} />
                            </MenuItem>,
                        ],
                    ]}
                />
            </Toolbar>
            {detailsResource && (
                <DetailsDrawer
                    baseId={baseId}
                    resource={detailsResource}
                    onClose={() => setDetailsResource(null)}
                    open={detailsResource !== null}
                    infoTypes={infoTypes}
                />
            )}
            <SaveAsDialog
                path={getParentPath(path)}
                open={saveAsDialogOpen}
                onClose={() => setSaveAsDialogOpen(false)}
                saveFileError={saveNewFileError}
                onSaveAs={(newPath) => {
                    setFileSavePath(newPath);
                    setSaveNewFileError(null);
                    onSaving();
                    saveTextAsFile({
                        dest: newPath,
                        content: getFileContent(),
                        newFile: createFileType ? true : false,
                    });
                }}
                loading={fileSaveLoading}
            />
        </>
    );
}
export default withErrorAnnouncer(ViewerToolbar);
