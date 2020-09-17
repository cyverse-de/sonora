/**
 * @author sriram
 *
 * A toolbar for file viewer.
 *
 *
 */
import React, { useEffect, useState } from "react";

import { queryCache, useQuery } from "react-query";
import { useTranslation } from "i18n";

import { getHost } from "../../utils/getHost";
import ids from "./ids";

import { getInfoTypes, INFO_TYPES_QUERY_KEY } from "serviceFacades/filesystem";
import DetailsDrawer from "components/data/details/Drawer";
import ResourceTypes from "components/models/ResourceTypes";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { build, DotMenu } from "@cyverse-de/ui-lib";
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
    ListItemSecondaryAction,
    MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
    Add,
    CloudDownload,
    Delete,
    Info,
    Refresh,
    Save,
    FormatListNumbered,
    TableChart,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    divider: {
        flexGrow: 1,
    },
    toolbarItems: {
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
    },
}));

function ViewerToolbar(props) {
    const {
        baseId,
        path,
        resourceId,
        showLineNumbers,
        onShowLineNumbers,
        showErrorAnnouncer,
        firstRowHeader,
        onFirstRowHeader,
        onAddRow,
        onDeleteRow,
        editing,
        onSave,
        selectionCount,
        dirty,
        onRefresh,
        fileName,
    } = props;
    const { t } = useTranslation("data");
    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [download, setDownload] = useState(false);
    const classes = useStyles();

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

    return (
        <>
            <Toolbar variant="dense" id={baseId}>
                <Typography variant="body2" color="primary">
                    {fileName}
                </Typography>
                <Hidden smDown>
                    {onShowLineNumbers && (
                        <>
                            <Divider
                                orientation="vertical"
                                flexItem
                                style={{ margin: 8 }}
                            />
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            id={build(
                                                baseId,
                                                ids.LINE_NUMBERS_SWITCH
                                            )}
                                            size="small"
                                            checked={showLineNumbers}
                                            onChange={(event) =>
                                                onShowLineNumbers(
                                                    event.target.checked
                                                )
                                            }
                                            name={t("showLineNumbers")}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            {t("showLineNumbers")}
                                        </Typography>
                                    }
                                />
                            </FormGroup>
                        </>
                    )}
                    {onFirstRowHeader && (
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Switch
                                        id={build(baseId, ids.HEADER_SWITCH)}
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

                    <div className={classes.divider} />
                    {editing && (
                        <>
                            <Button
                                id={build(baseId, ids.ADD_BTN)}
                                size="small"
                                className={classes.toolbarItems}
                                variant="outlined"
                                disableElevation
                                color="primary"
                                onClick={onAddRow}
                                startIcon={<Add fontSize="small" />}
                            >
                                <Hidden xsDown>{t("add")}</Hidden>
                            </Button>
                            <Button
                                id={build(baseId, ids.DELETE_BTN)}
                                size="small"
                                className={classes.toolbarItems}
                                variant="outlined"
                                disableElevation
                                color="primary"
                                onClick={onDeleteRow}
                                startIcon={<Delete fontSize="small" />}
                                disabled={selectionCount === 0}
                            >
                                <Hidden xsDown>{t("delete")}</Hidden>
                            </Button>
                            <Button
                                id={build(baseId, ids.SAVE_BTN)}
                                size="small"
                                className={classes.toolbarItems}
                                variant="outlined"
                                disableElevation
                                color="primary"
                                onClick={onSave}
                                startIcon={<Save fontSize="small" />}
                                disabled={!dirty}
                            >
                                <Hidden xsDown>{t("save")}</Hidden>
                            </Button>
                            <Divider
                                orientation="vertical"
                                flexItem
                                style={{ margin: 8 }}
                            />
                        </>
                    )}
                    <Button
                        id={build(baseId, ids.DETAILS_BTN)}
                        size="small"
                        className={classes.toolbarItems}
                        variant="outlined"
                        disableElevation
                        color="primary"
                        onClick={() =>
                            setDetailsResource({
                                id: resourceId,
                                path,
                                label: fileName,
                                type: ResourceTypes.FILE,
                            })
                        }
                        startIcon={<Info />}
                    >
                        <Hidden xsDown>{t("details")}</Hidden>
                    </Button>
                    <Button
                        id={build(baseId, ids.DOWNLOAD_BTN)}
                        size="small"
                        className={classes.toolbarItems}
                        variant="outlined"
                        disableElevation
                        color="primary"
                        onClick={() => setDownload(true)}
                        startIcon={<CloudDownload fontSize="small" />}
                    >
                        <Hidden xsDown>{t("download")}</Hidden>
                    </Button>
                    <Button
                        id={build(baseId, ids.REFRESH_BTN)}
                        size="small"
                        className={classes.toolbarItems}
                        variant="outlined"
                        disableElevation
                        color="primary"
                        onClick={() => onRefresh(path, resourceId)}
                        startIcon={<Refresh fontSize="small" />}
                    >
                        <Hidden xsDown>{t("refresh")}</Hidden>
                    </Button>
                </Hidden>
                <Hidden mdUp>
                    <>
                        <div className={classes.divider} />
                        <DotMenu
                            baseId={baseId}
                            render={(onClose) => [
                                onShowLineNumbers && (
                                    <MenuItem
                                        key={build(
                                            baseId,
                                            ids.LINE_NUMBER_MENU_ITEM
                                        )}
                                        id={build(
                                            baseId,
                                            ids.LINE_NUMBER_MENU_ITEM
                                        )}
                                    >
                                        <ListItemIcon>
                                            <FormatListNumbered fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={t("showLineNumbers")}
                                        />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                id={build(
                                                    baseId,
                                                    ids.LINE_NUMBERS_SWITCH
                                                )}
                                                size="small"
                                                checked={showLineNumbers}
                                                onChange={(event) => {
                                                    onShowLineNumbers(
                                                        event.target.checked
                                                    );
                                                    onClose();
                                                }}
                                                color="primary"
                                            />
                                        </ListItemSecondaryAction>
                                    </MenuItem>
                                ),
                                onFirstRowHeader && (
                                    <MenuItem
                                        key={build(
                                            baseId,
                                            ids.FIRST_ROW_HEADER_MENU_ITEM
                                        )}
                                        id={build(
                                            baseId,
                                            ids.FIRST_ROW_HEADER_MENU_ITEM
                                        )}
                                    >
                                        <ListItemIcon>
                                            <TableChart fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={t("firstRowHeader")}
                                        />
                                        <ListItemSecondaryAction>
                                            <Switch
                                                id={build(
                                                    baseId,
                                                    ids.HEADER_SWITCH
                                                )}
                                                size="small"
                                                checked={firstRowHeader}
                                                onChange={(event) => {
                                                    onFirstRowHeader(
                                                        event.target.checked
                                                    );
                                                    onClose();
                                                }}
                                                color="primary"
                                            />
                                        </ListItemSecondaryAction>
                                    </MenuItem>
                                ),

                                editing && [
                                    <MenuItem
                                        key={build(baseId, ids.ADD_MENU_ITEM)}
                                        id={build(baseId, ids.ADD_MENU_ITEM)}
                                        onClick={() => {
                                            onClose();
                                            onAddRow();
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Info fontSize="small" />
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
                                            <Save fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("save")} />
                                    </MenuItem>,
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
                                            <Delete fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText primary={t("delete")} />
                                    </MenuItem>,
                                ],
                                <MenuItem
                                    key={build(baseId, ids.DETAILS_MENU_ITEM)}
                                    id={build(baseId, ids.DETAILS_MENU_ITEM)}
                                    onClick={() => {
                                        onClose();
                                        setDetailsResource({
                                            id: resourceId,
                                            path,
                                            label: fileName,
                                            type: ResourceTypes.FILE,
                                        });
                                    }}
                                >
                                    <ListItemIcon>
                                        <Info fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary={t("details")} />
                                </MenuItem>,
                                <MenuItem
                                    key={build(baseId, ids.DOWNLOAD_MENU_ITEM)}
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
                                    key={build(baseId, ids.REFRESH_MENU_ITEM)}
                                    id={build(baseId, ids.REFRESH_MENU_ITEM)}
                                    onClick={() => {
                                        onClose();
                                        onRefresh(path, resourceId);
                                    }}
                                >
                                    <ListItemIcon>
                                        <Refresh fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary={t("refresh")} />
                                </MenuItem>,
                            ]}
                        />
                    </>
                </Hidden>
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
        </>
    );
}
export default withErrorAnnouncer(ViewerToolbar);
