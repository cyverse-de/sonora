/**
 *
 * @author sriram
 *
 * List Quick Launches
 *
 */

import React, { useState } from "react";
import { useTranslation } from "i18n";
import { useQuery, useMutation } from "react-query";

import ids from "../ids";
import constants from "../constants";
import { getHost } from "components/utils/getHost";
import ConfirmationDialog from "components/utils/ConfirmationDialog";

import {
    QUICK_LAUNCH_LISTING,
    listQuickLaunches,
    deleteQuickLaunch,
} from "serviceFacades/quickLaunches";
import { useUserProfile } from "contexts/userProfile";

import { build, CopyTextArea, QuickLaunch } from "@cyverse-de/ui-lib";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

import Code from "@material-ui/icons/Code";
import Play from "@material-ui/icons/PlayArrow";
import Share from "@material-ui/icons/Share";

function ActionsPopper(props) {
    const {
        anchorEl,
        useQuickLaunchClickHandler,
        embedCodeClickHandler,
        shareClickHandler,
        onActionPopperClose,
        baseDebugId,
    } = props;

    const { t } = useTranslation("apps");

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
                <Tooltip title={t("qLaunchToolTip")}>
                    <IconButton
                        id={build(baseDebugId, ids.QUICK_LAUNCH.useQuickLaunch)}
                        fontSize="small"
                        onClick={useQuickLaunchClickHandler}
                    >
                        <Play color="primary" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("qLaunchEmbedToolTip")}>
                    <IconButton
                        id={build(
                            baseDebugId,
                            ids.QUICK_LAUNCH.embedQuickLaunch
                        )}
                        fontSize="small"
                        onClick={embedCodeClickHandler}
                    >
                        <Code color="primary" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t("qLaunchShareToolTip")}>
                    <IconButton
                        id={build(
                            baseDebugId,
                            ids.QUICK_LAUNCH.shareQuickLaunch
                        )}
                        fontSize="small"
                        onClick={shareClickHandler}
                    >
                        <Share color="primary" />
                    </IconButton>
                </Tooltip>
            </Paper>
        </Popover>
    );
}

function ListQuickLaunches(props) {
    const { appId, systemId, baseDebugId } = props;
    const { t } = useTranslation("apps");
    const [userProfile] = useUserProfile();
    const [embedCode, setEmbedCode] = useState("");
    const [qLaunchUrl, setQLaunchUrl] = useState("");
    const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selected, setSelected] = useState();

    const userName = userProfile?.id;

    const { data: quickLaunches, error, isFetching } = useQuery({
        queryKey: [QUICK_LAUNCH_LISTING, { appId }],
        queryFn: listQuickLaunches,
    });

    const quickLaunchClickHandler = (event, qLaunch) => {
        setSelected(qLaunch);
        if (qLaunch.is_public) {
            setAnchorEl(event.currentTarget);
        } else {
            //   onQuickLaunch(qLaunch);
        }
    };

    const useQuickLaunchClickHandler = () => {
        // onQuickLaunch(selected);
    };

    const [deleteQuickLaunchMutation] = useMutation(deleteQuickLaunch, {
        onSuccess: (resp, { onSuccess }) => {
            console.log("quick launch deleted");
        },
        onError: (error) => {
            console.log("unable to delete" + error);
        },
    });

    const embedCodeClickHandler = () => {
        const shareUrl = getShareUrl(selected.id);
        const host = getHost();
        const imgSrc = `https://${host}/${constants.QUICK_LAUNCH_EMBED_ICON}`;

        const embed = `<a href="${shareUrl}" target="_blank"><img src="${imgSrc}"></a>`;

        setEmbedCode(embed);
        setEmbedDialogOpen(true);
    };

    const shareClickHandler = () => {
        setQLaunchUrl(getShareUrl(selected.id));
        setShareDialogOpen(true);
    };

    const getShareUrl = () => {
        const host = getHost();

        const url = new URL(host);

        url.searchParams.set(constants.TYPE, constants.QUICK_LAUNCH);
        url.searchParams.set(constants.QUICK_LAUNCH_ID, selected.id);
        url.searchParams.set(constants.APP_ID, selected.app_id);

        return url.toString();
    };

    const deleteQuickLaunchHandler = (event, qLaunch) => {
        setSelected(qLaunch);
        setDeleteConfirmOpen(true);
    };

    if (!quickLaunches || quickLaunches.length === 0) {
        if (systemId !== constants.AGAVE) {
            return (
                <React.Fragment>
                    <Typography variant="subtitle2">
                        {t("noQuickLaunches")}
                    </Typography>
                    <Link component="button">
                        {t("createQuickLaunchLabel")}
                    </Link>
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
                <Paper style={{ padding: 5 }} id={baseDebugId}>
                    <Grid container spacing={1}>
                        {quickLaunches.map((qLaunch, index) => {
                            const id = build(baseDebugId, qLaunch.id);
                            const is_public = qLaunch.is_public;
                            const onDelete =
                                userName === qLaunch.creator
                                    ? (event) =>
                                          deleteQuickLaunchHandler(
                                              event,
                                              qLaunch
                                          )
                                    : undefined;
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
                        })}
                    </Grid>
                </Paper>
                <ActionsPopper
                    anchorEl={anchorEl}
                    baseDebugId={baseDebugId}
                    useQuickLaunchClickHandler={useQuickLaunchClickHandler}
                    embedCodeClickHandler={embedCodeClickHandler}
                    shareClickHandler={shareClickHandler}
                    onActionPopperClose={() => setAnchorEl(null)}
                />
                <Dialog open={embedDialogOpen} maxWidth="sm" fullWidth={true}>
                    <DialogTitle>{t("embedLbl")}</DialogTitle>
                    <DialogContent>
                        <CopyTextArea
                            debugIdPrefix={build(
                                baseDebugId,
                                ids.QUICK_LAUNCH.embedQuickLaunch
                            )}
                            text={embedCode}
                            multiline={true}
                        />
                    </DialogContent>
                </Dialog>
                <Dialog open={shareDialogOpen} maxWidth="sm" fullWidth={true}>
                    <DialogTitle>{t("shareLbl")}</DialogTitle>
                    <DialogContent>
                        <CopyTextArea
                            debugIdPrefix={build(
                                baseDebugId,
                                ids.QUICK_LAUNCH.shareQuickLaunch
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
