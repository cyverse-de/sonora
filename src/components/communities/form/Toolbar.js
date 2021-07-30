/**
 * @author aramsey
 *
 * A toolbar that displays above the form for editing communities
 *
 * This toolbar contains buttons for saving, deleting, and unfollowing a
 * community
 */

import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import DotMenu from "components/dotMenu/DotMenu";
import {
    Button,
    Hidden,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    Toolbar,
} from "@material-ui/core";
import { Delete, EmojiPeople, ExitToApp, Save } from "@material-ui/icons";

import { groupShortName } from "components/teams/util";
import BackButton from "components/utils/BackButton";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import DeleteButton from "components/utils/DeleteButton";
import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";

const useStyles = makeStyles(styles);

function EditCommunityToolbar(props) {
    const {
        parentId,
        isAdmin,
        isFollower,
        onUnfollowSelected,
        onDeleteCommunitySelected,
        onFollowSelected,
        communityName,
        handleSubmit,
    } = props;
    const { t } = useTranslation(["communities", "common"]);
    const classes = useStyles();

    const [unfollowCommunityDlgOpen, setUnfollowCommunityDlgOpen] =
        useState(false);
    const [deleteCommunityDlgOpen, setDeleteCommunityDlgOpen] = useState(false);
    const [followCommunityDlgOpen, setFollowCommunityDlgOpen] = useState(false);

    const baseId = buildID(parentId, ids.TOOLBAR);
    const communityShortName = groupShortName(communityName);
    const isCreatingCommunity = !communityName;

    const unfollowEnabled = !isAdmin && isFollower;
    const followEnabled = !isAdmin && !isFollower;
    const deleteEnabled = isAdmin && !isCreatingCommunity;

    return (
        <Toolbar variant="dense">
            <BackButton />
            {isAdmin && (
                <Button
                    type="submit"
                    color="primary"
                    variant="outlined"
                    id={buildID(baseId, ids.BUTTONS.SAVE_BTN)}
                    className={classes.button}
                    startIcon={<Save />}
                    onClick={handleSubmit}
                >
                    {t("common:save")}
                </Button>
            )}
            <div className={classes.divider} />
            <Hidden xsDown>
                {unfollowEnabled && (
                    <Button
                        color="primary"
                        variant="outlined"
                        id={buildID(baseId, ids.BUTTONS.UNFOLLOW_BTN)}
                        className={classes.button}
                        startIcon={<ExitToApp />}
                        onClick={() => {
                            setUnfollowCommunityDlgOpen(true);
                        }}
                    >
                        {t("unfollow")}
                    </Button>
                )}
                {followEnabled && (
                    <Button
                        color="primary"
                        variant="outlined"
                        id={buildID(baseId, ids.BUTTONS.FOLLOW_BTN)}
                        className={classes.button}
                        startIcon={<EmojiPeople />}
                        onClick={() => {
                            setFollowCommunityDlgOpen(true);
                        }}
                    >
                        {t("follow")}
                    </Button>
                )}
                {deleteEnabled && (
                    <DeleteButton
                        baseId={baseId}
                        variant="outlined"
                        onClick={() => {
                            setDeleteCommunityDlgOpen(true);
                        }}
                    >
                        {t("common:delete")}
                    </DeleteButton>
                )}
            </Hidden>
            <Hidden smUp>
                <DotMenu
                    baseId={baseId}
                    render={(onClose) => [
                        unfollowEnabled && (
                            <MenuItem
                                key={buildID(baseId, ids.BUTTONS.UNFOLLOW_MI)}
                                onClick={() => {
                                    onClose();
                                    setUnfollowCommunityDlgOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <ExitToApp />
                                </ListItemIcon>
                                <ListItemText primary={t("unfollow")} />
                            </MenuItem>
                        ),
                        followEnabled && (
                            <MenuItem
                                key={buildID(baseId, ids.BUTTONS.FOLLOW_MI)}
                                onClick={() => {
                                    onClose();
                                    setFollowCommunityDlgOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <EmojiPeople />
                                </ListItemIcon>
                                <ListItemText primary={t("follow")} />
                            </MenuItem>
                        ),
                        deleteEnabled && (
                            <MenuItem
                                key={buildID(baseId, ids.BUTTONS.DELETE_MI)}
                                onClick={() => {
                                    onClose();
                                    setDeleteCommunityDlgOpen(true);
                                }}
                            >
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                <ListItemText primary={t("common:delete")} />
                            </MenuItem>
                        ),
                    ]}
                />
            </Hidden>
            <ConfirmationDialog
                baseId={ids.UNFOLLOW_COMMUNITY_DLG}
                open={unfollowCommunityDlgOpen}
                onClose={() => setUnfollowCommunityDlgOpen(false)}
                onConfirm={() => {
                    setUnfollowCommunityDlgOpen(false);
                    onUnfollowSelected();
                }}
                title={t("unfollowCommunityTitle", {
                    name: communityShortName,
                })}
                contentText={t("unfollowCommunityText")}
                confirmButtonText={t("unfollow")}
            />
            <ConfirmationDialog
                baseId={ids.DELETE_COMMUNITY_DLG}
                open={deleteCommunityDlgOpen}
                onClose={() => setDeleteCommunityDlgOpen(false)}
                onConfirm={() => {
                    setDeleteCommunityDlgOpen(false);
                    onDeleteCommunitySelected();
                }}
                title={t("deleteCommunityTitle", { name: communityShortName })}
                contentText={t("deleteCommunityText")}
                confirmButtonText={t("common:delete")}
            />
            <ConfirmationDialog
                baseId={ids.FOLLOW_COMMUNITY_DLG}
                open={followCommunityDlgOpen}
                onClose={() => setFollowCommunityDlgOpen(false)}
                onConfirm={() => {
                    setFollowCommunityDlgOpen(false);
                    onFollowSelected();
                }}
                title={t("followCommunityTitle", { name: communityShortName })}
                contentText={t("followCommunityText")}
                confirmButtonText={t("follow")}
            />
        </Toolbar>
    );
}

export default EditCommunityToolbar;
