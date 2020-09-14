/**
 * @author sriram
 *
 * A toolbar for file viewer.
 *
 *
 */
import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { useQuery, queryCache } from "react-query";

import ids from "./ids";
import { parseNameFromPath } from "../utils";
import ResourceTypes from "components/models/ResourceTypes";
import DetailsDrawer from "components/data/details/Drawer";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { build } from "@cyverse-de/ui-lib";

import { getInfoTypes, INFO_TYPES_QUERY_KEY } from "serviceFacades/filesystem";

import {
    Button,
    Divider,
    Hidden,
    FormGroup,
    FormControlLabel,
    Switch,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Add, Delete, Save, Info, CloudDownload } from "@material-ui/icons";

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
    } = props;
    const { t } = useTranslation("data");
    const [detailsResource, setDetailsResource] = useState(null);
    const [infoTypes, setInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [download, setDownload] = useState(false);
    const label = parseNameFromPath(path);
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
            const protocol = window.location.protocol;
            const slashes = protocol.concat("//");
            const host = slashes.concat(window.location.host);
            window.open(`${host}/api/download?path=${path}`, "_blank");
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
                    {label}
                </Typography>

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
                                        onFirstRowHeader(event.target.checked)
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
                    className={classes.toolbarItems}
                    variant="outlined"
                    disableElevation
                    color="primary"
                    onClick={() =>
                        setDetailsResource({
                            id: resourceId,
                            path,
                            label,
                            type: ResourceTypes.FILE,
                        })
                    }
                    startIcon={<Info />}
                >
                    <Hidden xsDown>{t("details")}</Hidden>
                </Button>
                <Button
                    id={build(baseId, ids.DOWNLOAD_BTN)}
                    className={classes.toolbarItems}
                    variant="outlined"
                    disableElevation
                    color="primary"
                    onClick={() => setDownload(true)}
                    startIcon={<CloudDownload />}
                >
                    <Hidden xsDown>{t("download")}</Hidden>
                </Button>
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
