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
    PUBLIC_LINKS_QUERY_KEY,
} from "serviceFacades/filesystem";
import { getHost } from "../utils/getHost";
import SaveAsDialog from "./SaveAsDialog";
import { getParentPath } from "./utils";
import constants from "../../constants";
import ids from "./ids";

import { build } from "@cyverse-de/ui-lib";
import { ERROR_CODES, getErrorCode } from "components/utils/error/errorCode";
import GridLoading from "components/utils/GridLoading";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

import {
    Button,
    Hidden,
    Paper,
    TextField,
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
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    toolbarButtons: {
        flexGrow: 1,
        margin: theme.spacing(0.5),
    },
    paper: {
        padding: theme.spacing(0.5),
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
    const { t } = useTranslation("data");

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
                <TextField
                    multiline
                    rows={paths?.length || 3}
                    value={links}
                    fullWidth
                    variant="outlined"
                    id={build(baseId, ids.PUBLIC_LINKS_TEXT_FIELD)}
                />
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
                <Toolbar>
                    <Tooltip title={t("copyLinks")}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            className={classes.toolbarButtons}
                            onClick={copyToClipboard}
                            startIcon={<FileCopy />}
                            id={build(baseId, ids.COPY_LINKS_BTN)}
                        >
                            <Hidden xsDown>{t("copyLinks")}</Hidden>
                        </Button>
                    </Tooltip>
                    <Tooltip title={t("saveToFile")}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            className={classes.toolbarButtons}
                            onClick={() => setSaveAsDialogOpen(true)}
                            startIcon={<Save />}
                            id={build(baseId, ids.SAVE_LINKS_BTN)}
                        >
                            <Hidden xsDown>{t("saveToFile")}</Hidden>
                        </Button>
                    </Tooltip>
                    <Tooltip title={t("download")}>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            className={classes.toolbarButtons}
                            onClick={() => setDownload(true)}
                            startIcon={<CloudDownload />}
                            id={build(baseId, ids.DOWNLOAD_LINKS_BTN)}
                        >
                            <Hidden xsDown>{t("download")}</Hidden>
                        </Button>
                    </Tooltip>
                </Toolbar>
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
