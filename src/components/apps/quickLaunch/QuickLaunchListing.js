/**
 *
 * @author sriram
 *
 * List Quick Launches
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";
import { queryCache, useQuery, useMutation } from "react-query";
import Link from "next/link";

import ids from "../ids";
import constants from "../constants";
import QuickLaunch from "./QuickLaunch";
import { getHost } from "components/utils/getHost";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import GridLoading from "components/utils/GridLoading";
import { getUserName } from "components/utils/getUserName";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import NavigationConstants from "common/NavigationConstants";

import {
    QUICK_LAUNCH_LISTING,
    listQuickLaunches,
    deleteQuickLaunch,
} from "serviceFacades/quickLaunches";
import { useUserProfile } from "contexts/userProfile";

import { build, CopyTextArea } from "@cyverse-de/ui-lib";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { Link as MuiLink } from "@material-ui/core";
import { useTheme } from "@material-ui/core";

import Code from "@material-ui/icons/Code";
import Play from "@material-ui/icons/PlayArrow";
import Share from "@material-ui/icons/Share";
import CloseIcon from "@material-ui/icons/Close";

function QuickLaunchChipLink(props) {
    const {
        id,
        qid,
        label,
        isPublic,
        handleClick,
        handleDelete,
        systemId,
        appId,
    } = props;
    const href = `/${NavigationConstants.APPS}/[systemId]/[appId]/launch?quick-launch-id=${qid}`;
    const as = `/${NavigationConstants.APPS}/${systemId}/${appId}/launch?quick-launch-id=${qid}`;
    return (
        <Link href={href} as={as} passHref>
            <QuickLaunch
                id={id}
                label={label}
                isPublic={isPublic}
                handleClick={handleClick}
                handleDelete={handleDelete}
            />
        </Link>
    );
}

function QuickLaunchButtonLink(props) {
    const { id, onClick, systemId, appId, qid } = props;
    const { t } = useTranslation("apps");
    const href = `/${NavigationConstants.APPS}/[systemId]/[appId]/launch?quick-launch-id=${qid}`;
    const as = `/${NavigationConstants.APPS}/${systemId}/${appId}/launch?quick-launch-id=${qid}`;
    return (
        <Link href={href} as={as} passHref>
            <IconButton
                id={id}
                fontSize="small"
                onClick={onClick}
                title={t("qLaunchToolTip")}
            >
                <Play color="primary" />
            </IconButton>
        </Link>
    );
}

function ActionsPopper(props) {
    const {
        quickLaunch,
        anchorEl,
        embedCodeClickHandler,
        shareClickHandler,
        onActionPopperClose,
        baseDebugId,
        systemId,
        appId,
    } = props;

    const { t } = useTranslation("apps");

    if (quickLaunch) {
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
                    <QuickLaunchButtonLink
                        id={build(
                            baseDebugId,
                            ids.QUICK_LAUNCH.USE_QUICK_LAUNCH
                        )}
                        fontSize="small"
                        qid={quickLaunch.id}
                        appId={appId}
                        systemId={systemId}
                    />
                    <IconButton
                        id={build(
                            baseDebugId,
                            ids.QUICK_LAUNCH.EMBED_QUICK_LAUNCH
                        )}
                        fontSize="small"
                        onClick={embedCodeClickHandler}
                        title={t("qLaunchEmbedToolTip")}
                    >
                        <Code color="primary" />
                    </IconButton>
                    <IconButton
                        id={build(
                            baseDebugId,
                            ids.QUICK_LAUNCH.SHARE_QUICK_LAUNCH
                        )}
                        fontSize="small"
                        onClick={shareClickHandler}
                        title={t("qLaunchShareToolTip")}
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

function ListQuickLaunches(props) {
    const { appId, systemId, baseDebugId } = props;
    const { t } = useTranslation("apps");
    const theme = useTheme();
    const [userProfile] = useUserProfile();
    const [embedCode, setEmbedCode] = useState("");
    const [qLaunchUrl, setQLaunchUrl] = useState("");
    const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selected, setSelected] = useState();
    const [deleteError, setDeleteError] = useState();

    const userName = userProfile?.id;

    const { data: quickLaunches, error, isFetching } = useQuery({
        queryKey: [QUICK_LAUNCH_LISTING, { appId }],
        queryFn: listQuickLaunches,
    });

    const quickLaunchClickHandler = (event, qLaunch) => {
        setSelected(qLaunch);
        if (qLaunch.is_public) {
            setAnchorEl(event.currentTarget);
        }
    };

    const [deleteQuickLaunchMutation] = useMutation(deleteQuickLaunch, {
        onSuccess: (resp, { onSuccess }) => {
            queryCache.invalidateQueries([QUICK_LAUNCH_LISTING, { appId }]);
        },
        onError: setDeleteError,
    });

    const embedCodeClickHandler = () => {
        const shareUrl = getShareUrl(selected.id);
        const host = getHost();
        const imgSrc = `${host}/${constants.QUICK_LAUNCH_EMBED_ICON}`;

        const embed = `<a href="${shareUrl}" target="_blank" rel="noopener noreferrer"><img src="${imgSrc}"></a>`;

        setAnchorEl(null);
        setEmbedCode(embed);
        setEmbedDialogOpen(true);
    };

    const shareClickHandler = () => {
        setAnchorEl(null);
        setQLaunchUrl(getShareUrl(selected.id));
        setShareDialogOpen(true);
    };

    const getShareUrl = () => {
        const host = getHost();
        const url = `${host}/${NavigationConstants.APPS}/${systemId}/${appId}/launch?qId=${selected?.id}`;
        return url;
    };

    const deleteQuickLaunchHandler = (event, qLaunch) => {
        setSelected(qLaunch);
        setDeleteConfirmOpen(true);
    };

    if (error) {
        return (
            <ErrorTypographyWithDialog
                baseId={baseDebugId}
                errorMessage={t("quickLaunchError")}
                errorObject={error}
            />
        );
    }

    if (isFetching) {
        return <GridLoading rows={3} baseId={baseDebugId} />;
    }

    if (!quickLaunches || quickLaunches.length === 0) {
        if (systemId !== constants.AGAVE) {
            return (
                <React.Fragment>
                    <Typography variant="subtitle2">
                        {t("noQuickLaunches")}
                    </Typography>
                    <MuiLink component="button">
                        {t("createQuickLaunchLabel")}
                    </MuiLink>
                </React.Fragment>
            );
        } else {
            return (
                <Typography variant="subtitle2">
                    {t("quickLaunchNotSupportedMessage")}
                </Typography>
            );
        }
    } else {
        return (
            <React.Fragment>
                <Paper style={{ padding: theme.spacing(0.5) }} id={baseDebugId}>
                    <Grid container spacing={1}>
                        {quickLaunches.map((qLaunch, index) => {
                            const id = build(baseDebugId, qLaunch.id);
                            const is_public = qLaunch.is_public;
                            const onDelete =
                                userName === getUserName(qLaunch.creator)
                                    ? (event) =>
                                          deleteQuickLaunchHandler(
                                              event,
                                              qLaunch
                                          )
                                    : undefined;
                            if (is_public) {
                                return (
                                    <Grid item key={index}>
                                        <QuickLaunch
                                            id={id}
                                            label={qLaunch.name}
                                            isPublic={is_public}
                                            handleClick={(event) =>
                                                quickLaunchClickHandler(
                                                    event,
                                                    qLaunch
                                                )
                                            }
                                            handleDelete={onDelete}
                                        />
                                    </Grid>
                                );
                            } else {
                                return (
                                    <Grid item key={index}>
                                        <QuickLaunchChipLink
                                            id={id}
                                            qid={qLaunch.id}
                                            label={qLaunch.name}
                                            isPublic={is_public}
                                            handleClick={(event) =>
                                                quickLaunchClickHandler(
                                                    event,
                                                    qLaunch
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
                            errorMessage={t("quickLaunchDeleteError")}
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
                    quickLaunch={selected}
                    appId={appId}
                    systemId={systemId}
                />
                <Dialog open={embedDialogOpen} maxWidth="sm" fullWidth={true}>
                    <DialogTitle>
                        {t("embedLbl")}{" "}
                        <IconButton
                            aria-label={t("close")}
                            onClick={() => setEmbedDialogOpen(false)}
                            style={{
                                position: "absolute",
                                right: theme.spacing(0.5),
                                top: theme.spacing(0.5),
                                margin: 0,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <CopyTextArea
                            debugIdPrefix={build(
                                baseDebugId,
                                ids.QUICK_LAUNCH.EMBED_QUICK_LAUNCH
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
                            aria-label={t("close")}
                            onClick={() => setShareDialogOpen(false)}
                            style={{
                                position: "absolute",
                                right: theme.spacing(0.5),
                                top: theme.spacing(0.5),
                                margin: 0,
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <CopyTextArea
                            debugIdPrefix={build(
                                baseDebugId,
                                ids.QUICK_LAUNCH.SHARE_QUICK_LAUNCH
                            )}
                            text={qLaunchUrl}
                            multiline={true}
                        />
                    </DialogContent>
                </Dialog>
                <ConfirmationDialog
                    baseId={baseDebugId}
                    title={t("deleteLbl")}
                    okLabel={t("deleteLbl")}
                    contentText={t("quickLaunchDeleteConfirmation")}
                    open={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    onConfirm={() => {
                        setDeleteConfirmOpen(false);
                        deleteQuickLaunchMutation(selected?.id);
                    }}
                />
            </React.Fragment>
        );
    }
}

export default ListQuickLaunches;
