/**
 *
 * @author sriram
 *
 * List Saved Launches
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";
import { useQueryClient, useQuery, useMutation } from "react-query";
import Link from "next/link";

import ids from "../ids";
import constants from "../constants";
import SavedLaunch from "./SavedLaunch";

import { getSavedLaunchPath } from "components/apps/utils";
import SystemIds from "components/models/systemId";
import { getHost } from "components/utils/getHost";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import GridLoading from "components/utils/GridLoading";
import { getUserName } from "components/utils/getUserName";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import NavigationConstants from "common/NavigationConstants";

import {
    SAVED_LAUNCH_LISTING,
    listSavedLaunches,
    deleteSavedLaunch,
} from "serviceFacades/savedLaunches";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";

import buildID from "components/utils/DebugIDUtil";
import CopyTextArea from "components/copy/CopyTextArea";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Link as MuiLink } from "@mui/material";
import { useTheme } from "@mui/material";

import Code from "@mui/icons-material/Code";
import Play from "@mui/icons-material/PlayArrow";
import Share from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";

function SavedLaunchChipLink(props) {
    const {
        id,
        launchId,
        label,
        isPublic,
        handleClick,
        handleDelete,
        systemId,
        appId,
    } = props;
    const href = `/${NavigationConstants.APPS}/[systemId]/[appId]/launch?saved-launch-id=${launchId}`;
    const as = `/${NavigationConstants.APPS}/${systemId}/${appId}/launch?saved-launch-id=${launchId}`;
    return (
        <Link href={href} as={as} passHref>
            <SavedLaunch
                id={id}
                label={label}
                isPublic={isPublic}
                handleClick={handleClick}
                handleDelete={handleDelete}
            />
        </Link>
    );
}

function SavedLaunchButtonLink(props) {
    const { id, onClick, systemId, appId, launchId } = props;
    const { t } = useTranslation("apps");
    const href = `/${NavigationConstants.APPS}/[systemId]/[appId]/launch?saved-launch-id=${launchId}`;
    const as = `/${NavigationConstants.APPS}/${systemId}/${appId}/launch?saved-launch-id=${launchId}`;
    return (
        <Link href={href} as={as} passHref>
            <IconButton
                id={id}
                fontSize="small"
                onClick={onClick}
                title={t("savedLaunchToolTip")}
                size="large"
            >
                <Play color="primary" />
            </IconButton>
        </Link>
    );
}

function ActionsPopper(props) {
    const {
        savedLaunch,
        anchorEl,
        embedCodeClickHandler,
        shareClickHandler,
        onActionPopperClose,
        baseDebugId,
        systemId,
        appId,
    } = props;

    const { t } = useTranslation("apps");

    if (savedLaunch) {
        return (
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onActionPopperClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Paper>
                    <SavedLaunchButtonLink
                        id={buildID(
                            baseDebugId,
                            ids.SAVED_LAUNCH.USE_SAVED_LAUNCH
                        )}
                        fontSize="small"
                        launchId={savedLaunch.id}
                        appId={appId}
                        systemId={systemId}
                    />
                    <IconButton
                        id={buildID(
                            baseDebugId,
                            ids.SAVED_LAUNCH.EMBED_SAVED_LAUNCH
                        )}
                        fontSize="small"
                        onClick={embedCodeClickHandler}
                        title={t("savedLaunchEmbedToolTip")}
                        size="large"
                    >
                        <Code color="primary" />
                    </IconButton>
                    <IconButton
                        id={buildID(
                            baseDebugId,
                            ids.SAVED_LAUNCH.SHARE_SAVED_LAUNCH
                        )}
                        fontSize="small"
                        onClick={shareClickHandler}
                        title={t("savedLaunchShareToolTip")}
                        size="large"
                    >
                        <Share color="primary" />
                    </IconButton>
                </Paper>
            </Popover>
        );
    } else {
        return null;
    }
}

function ListSavedLaunches(props) {
    const { appId, systemId, baseDebugId } = props;
    const { t } = useTranslation(["apps", "common"]);
    const theme = useTheme();
    const [userProfile] = useUserProfile();
    const [config] = useConfig();
    const [embedCode, setEmbedCode] = useState("");
    const [savedLaunchUrl, setSavedLaunchUrl] = useState("");
    const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selected, setSelected] = useState();
    const [deleteError, setDeleteError] = useState();

    const userName = userProfile?.id;

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const {
        data: savedLaunches,
        error,
        isFetching,
    } = useQuery({
        queryKey: [SAVED_LAUNCH_LISTING, { appId }],
        queryFn: () => listSavedLaunches({ appId }),
    });

    const savedLaunchClickHandler = (event, savedLaunch) => {
        setSelected(savedLaunch);
        if (savedLaunch.is_public) {
            setAnchorEl(event.currentTarget);
        }
    };

    const { mutate: deleteSavedLaunchMutation } = useMutation(
        deleteSavedLaunch,
        {
            onSuccess: (resp, { onSuccess }) => {
                queryClient.invalidateQueries([
                    SAVED_LAUNCH_LISTING,
                    { appId },
                ]);
            },
            onError: setDeleteError,
        }
    );

    const embedCodeClickHandler = () => {
        const shareUrl = getShareUrl(selected.id);
        const host = getHost();
        const imgSrc = `${host}/${constants.SAVED_LAUNCH_EMBED_ICON}`;

        const embed = `<a href="${shareUrl}" target="_blank" rel="noopener noreferrer"><img src="${imgSrc}"></a>`;

        setAnchorEl(null);
        setEmbedCode(embed);
        setEmbedDialogOpen(true);
    };

    const shareClickHandler = () => {
        setAnchorEl(null);
        setSavedLaunchUrl(getShareUrl(selected.id));
        setShareDialogOpen(true);
    };

    const getShareUrl = () => {
        const host = getHost();
        const url = `${host}${getSavedLaunchPath(
            systemId,
            appId,
            selected?.id
        )}`;
        return url;
    };

    const deleteSavedLaunchHandler = (event, savedLaunch) => {
        setSelected(savedLaunch);
        setDeleteConfirmOpen(true);
    };

    if (error) {
        return (
            <ErrorTypographyWithDialog
                baseId={baseDebugId}
                errorMessage={t("savedLaunchError")}
                errorObject={error}
            />
        );
    }

    if (isFetching) {
        return <GridLoading rows={3} baseId={baseDebugId} />;
    }

    if (!savedLaunches || savedLaunches.length === 0) {
        if (systemId !== SystemIds.agave) {
            const href = `/${NavigationConstants.APPS}/[systemId]/[appId]/launch`;
            const as = `/${NavigationConstants.APPS}/${systemId}/${appId}/launch`;
            return (
                <React.Fragment>
                    <Typography variant="subtitle2">
                        {t("noSavedLaunches")}
                    </Typography>
                    <Link href={href} as={as} passHref>
                        <MuiLink>{t("createSavedLaunchLabel")}</MuiLink>
                    </Link>
                </React.Fragment>
            );
        } else {
            return (
                <Typography variant="subtitle2">
                    {t("savedLaunchNotSupportedMessage")}
                </Typography>
            );
        }
    } else {
        return (
            <React.Fragment>
                <Paper style={{ padding: theme.spacing(0.5) }} id={baseDebugId}>
                    <Grid container spacing={1}>
                        {savedLaunches.map((savedLaunch, index) => {
                            const id = buildID(baseDebugId, savedLaunch.id);
                            const is_public = savedLaunch.is_public;
                            const onDelete =
                                userName ===
                                getUserName(savedLaunch.creator, config)
                                    ? (event) =>
                                          deleteSavedLaunchHandler(
                                              event,
                                              savedLaunch
                                          )
                                    : undefined;
                            if (is_public) {
                                return (
                                    <Grid item key={index}>
                                        <SavedLaunch
                                            id={id}
                                            label={savedLaunch.name}
                                            isPublic={is_public}
                                            handleClick={(event) =>
                                                savedLaunchClickHandler(
                                                    event,
                                                    savedLaunch
                                                )
                                            }
                                            handleDelete={onDelete}
                                        />
                                    </Grid>
                                );
                            } else {
                                return (
                                    <Grid item key={index}>
                                        <SavedLaunchChipLink
                                            id={id}
                                            launchId={savedLaunch.id}
                                            label={savedLaunch.name}
                                            isPublic={is_public}
                                            handleClick={(event) =>
                                                savedLaunchClickHandler(
                                                    event,
                                                    savedLaunch
                                                )
                                            }
                                            handleDelete={onDelete}
                                            appId={appId}
                                            systemId={systemId}
                                        />
                                    </Grid>
                                );
                            }
                        })}
                    </Grid>
                    {deleteError && (
                        <ErrorTypographyWithDialog
                            baseId={baseDebugId}
                            errorMessage={t("savedLaunchDeleteError")}
                            errorObject={deleteError}
                        />
                    )}
                </Paper>
                <ActionsPopper
                    anchorEl={anchorEl}
                    baseDebugId={baseDebugId}
                    embedCodeClickHandler={embedCodeClickHandler}
                    shareClickHandler={shareClickHandler}
                    onActionPopperClose={() => setAnchorEl(null)}
                    savedLaunch={selected}
                    appId={appId}
                    systemId={systemId}
                />
                <Dialog open={embedDialogOpen} maxWidth="sm" fullWidth={true}>
                    <DialogTitle>
                        {t("embedLbl")}{" "}
                        <IconButton
                            aria-label={t("common:close")}
                            onClick={() => setEmbedDialogOpen(false)}
                            style={{
                                position: "absolute",
                                right: theme.spacing(0.5),
                                top: theme.spacing(0.5),
                                margin: 0,
                            }}
                            size="large"
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <CopyTextArea
                            debugIdPrefix={buildID(
                                baseDebugId,
                                ids.SAVED_LAUNCH.EMBED_SAVED_LAUNCH
                            )}
                            text={embedCode}
                            multiline={true}
                        />
                    </DialogContent>
                </Dialog>
                <Dialog open={shareDialogOpen} maxWidth="sm" fullWidth={true}>
                    <DialogTitle>
                        {t("shareLbl")}
                        <IconButton
                            aria-label={t("common:close")}
                            onClick={() => setShareDialogOpen(false)}
                            style={{
                                position: "absolute",
                                right: theme.spacing(0.5),
                                top: theme.spacing(0.5),
                                margin: 0,
                            }}
                            size="large"
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <CopyTextArea
                            debugIdPrefix={buildID(
                                baseDebugId,
                                ids.SAVED_LAUNCH.SHARE_SAVED_LAUNCH
                            )}
                            text={savedLaunchUrl}
                            multiline={true}
                        />
                    </DialogContent>
                </Dialog>
                <ConfirmationDialog
                    baseId={baseDebugId}
                    title={t("deleteLbl")}
                    okLabel={t("deleteLbl")}
                    contentText={t("savedLaunchDeleteConfirmation")}
                    open={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    onConfirm={() => {
                        setDeleteConfirmOpen(false);
                        deleteSavedLaunchMutation(selected?.id);
                    }}
                />
            </React.Fragment>
        );
    }
}

export default ListSavedLaunches;
