/**
 * @author sriram
 *
 * A component for displaying public links for selected paths
 *
 */

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { useTranslation } from "i18n";

import { uploadTextAsFile } from "serviceFacades/fileio";
import {
    getPublicLinks,
    refreshCache,
    PUBLIC_LINKS_QUERY_KEY,
} from "serviceFacades/filesystem";
import { getHost } from "../utils/getHost";
import SaveAsDialog from "./SaveAsDialog";
import { getParentPath } from "./utils";
import constants from "../../constants";
import ids from "./ids";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { INFO } from "components/announcer/AnnouncerConstants";
import { ERROR_CODES, getErrorCode } from "components/error/errorCode";
import GridLoading from "components/utils/GridLoading";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import {
    Button,
    Grid,
    Paper,
    TextareaAutosize,
    Toolbar,
    Tooltip,
    Typography,
    useTheme,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";

import {
    CheckCircle,
    CloudDownload,
    Error,
    Save,
    FileCopy,
    Cached,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    toolbarButtons: {
        margin: theme.spacing(0.2),
    },
    paper: {
        padding: theme.spacing(0.2),
        flexGrow: 1,
    },
}));

const DEFAULT_FILE_NAME = "de-links.txt";

function PublicLinks(props) {
    const classes = useStyles();
    const { baseId, paths } = props;
    const theme = useTheme();
    const [links, setLinks] = useState();
    const [download, setDownload] = useState(false);
    const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
    const [saveNewFileError, setSaveNewFileError] = useState(null);
    const [fileSavePath, setFileSavePath] = useState();
    const [successMsg, setSuccessMsg] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [refreshCacheEnabled, setRefreshCacheEnabled] = useState(false);
    const [refreshCacheKey, setRefreshCacheKey] = useState();

    const { t } = useTranslation("data");
    const { t: common } = useTranslation("common");

    const { isFetching, error } = useQuery({
        queryKey: [PUBLIC_LINKS_QUERY_KEY, paths],
        queryFn: getPublicLinks,
        config: {
            enabled: paths && paths.length > 0,
            onSuccess: (resp) => {
                const pathsWithLink = resp?.paths;
                let parsedLinks = "";
                pathsWithLink &&
                    paths.forEach((path) => {
                        parsedLinks = parsedLinks.concat(
                            `${pathsWithLink[path]}\n`
                        );
                    });
                setLinks(parsedLinks);
            },
        },
    });

    useQuery({
        queryKey: refreshCacheKey,
        queryFn: refreshCache,
        config: {
            enabled: refreshCacheEnabled,
            onSuccess: (resp) => {
                setRefreshCacheEnabled(false);
                setErrorMsg(null);
                announce({
                    text: t("refreshCacheSuccess"),
                    variant: INFO,
                });
            },
            onError: (err) => {
                setErrorMsg(err.toString());
            },
        },
    });

    const [saveTextAsFile, { status: fileSaveStatus }] = useMutation(
        uploadTextAsFile,
        {
            onSuccess: (resp) => {
                setSuccessMsg(
                    t("fileSaveSuccess", {
                        fileName: resp?.file.label,
                    })
                );
                setSaveAsDialogOpen(false);
            },
            onError: (error) => {
                const text =
                    getErrorCode(error) === ERROR_CODES.ERR_EXISTS
                        ? t("fileExists", {
                              path: getParentPath(fileSavePath),
                          })
                        : t("fileSaveError");
                setSaveNewFileError(text);
            },
        }
    );

    useEffect(() => {
        if (download) {
            window.open(
                `${getHost()}/api/downloadText?text=${encodeURIComponent(
                    links
                )}&fileName=${DEFAULT_FILE_NAME}`,
                "_blank"
            );
            setDownload(false);
        }
    }, [links, download]);

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(links)
            .then(() => {
                setSuccessMsg(t("copyLinksSuccess"));
            })
            .catch((err) => setErrorMsg(t("copyLinksError")));
    };

    if (error) {
        return (
            <ErrorTypographyWithDialog
                errorMessage={t("publicLinkError")}
                errorObject={error}
            />
        );
    }

    if (isFetching) {
        return (
            <Paper>
                <GridLoading rows={paths?.length || 3} />
                <Toolbar>
                    <Skeleton variant="rect" width={300} />
                </Toolbar>
            </Paper>
        );
    }

    return (
        <>
            <Paper className={classes.paper} elevation={0}>
                {successMsg && (
                    <>
                        <div style={{ float: "left" }}>
                            <CheckCircle
                                size="small"
                                style={{ color: theme.palette.info.main }}
                            />
                        </div>
                        <Typography variant="caption">{successMsg}</Typography>
                    </>
                )}
                {errorMsg && (
                    <>
                        <div style={{ float: "left" }}>
                            <Error size="small" color="error" />
                        </div>
                        <Typography variant="caption">{errorMsg}</Typography>
                    </>
                )}
                <TextareaAutosize
                    rowsMin={3}
                    value={links}
                    id={buildID(baseId, ids.PUBLIC_LINKS_TEXT_FIELD)}
                    style={{ width: "100%" }}
                />
                <Grid container>
                    <Grid item sm={3}>
                        <Tooltip title={t("copyLinks")}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.toolbarButtons}
                                onClick={copyToClipboard}
                                startIcon={<FileCopy />}
                                id={buildID(baseId, ids.COPY_LINKS_BTN)}
                            >
                                {common("copy")}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item sm={3}>
                        <Tooltip title={t("saveToFile")}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.toolbarButtons}
                                onClick={() => setSaveAsDialogOpen(true)}
                                startIcon={<Save />}
                                id={buildID(baseId, ids.SAVE_LINKS_BTN)}
                            >
                                {t("saveToFile")}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item sm={3}>
                        <Tooltip title={t("download")}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.toolbarButtons}
                                onClick={() => setDownload(true)}
                                startIcon={<CloudDownload />}
                                id={buildID(baseId, ids.DOWNLOAD_LINKS_BTN)}
                            >
                                {t("download")}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid item sm={3}>
                        <Tooltip title={t("refreshCacheTooltip")}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                className={classes.toolbarButtons}
                                onClick={() => {
                                    setRefreshCacheKey([
                                        "refreshCacheKey",
                                        { paths },
                                    ]);
                                    setRefreshCacheEnabled(true);
                                }}
                                startIcon={<Cached />}
                                id={buildID(baseId, ids.REFRESH_CACHE_BTN)}
                            >
                                {t("refreshCache")}
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Typography variant="caption">
                    {t("publicLinkWarning")}
                </Typography>
            </Paper>
            <SaveAsDialog
                path={getParentPath(paths[0])}
                open={saveAsDialogOpen}
                onClose={() => setSaveAsDialogOpen(false)}
                saveFileError={saveNewFileError}
                onSaveAs={(newPath) => {
                    setFileSavePath(newPath);
                    setSaveNewFileError(null);

                    saveTextAsFile({
                        dest: newPath,
                        content: links,
                        newFile: true,
                    });
                }}
                loading={fileSaveStatus === constants.LOADING}
                setSaveNewFileError={setSaveNewFileError}
            />
        </>
    );
}
export default PublicLinks;
