/**
 * @author aramsey
 *
 * A toolbar that displays above the form for editing collections
 *
 * This toolbar contains buttons for saving, deleting, and unfollowing a
 * collection
 */

import React, { useState } from "react";

import {
    Button,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Toolbar,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Delete, EmojiPeople, ExitToApp, Save } from "@mui/icons-material";

import DotMenu from "components/dotMenu/DotMenu";
import BackButton from "components/utils/BackButton";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import buildID from "components/utils/DebugIDUtil";
import DeleteButton from "components/utils/DeleteButton";

import { useTranslation } from "i18n";
import ids from "../ids";
import styles from "../styles";
import useBreakpoints from "components/layout/useBreakpoints";

const useStyles = makeStyles(styles);

function EditCollectionToolbar(props) {
    const {
        parentId,
        isAdmin,
        isFollower,
        onUnfollowSelected,
        onDeleteCollectionSelected,
        onFollowSelected,
        collectionName,
        handleSubmit,
        dirty,
    } = props;
    const { t } = useTranslation(["collections", "common"]);
    const classes = useStyles();

    const [unfollowCollectionDlgOpen, setUnfollowCollectionDlgOpen] =
        useState(false);
    const [deleteCollectionDlgOpen, setDeleteCollectionDlgOpen] =
        useState(false);
    const [followCollectionDlgOpen, setFollowCollectionDlgOpen] =
        useState(false);

    const baseId = buildID(parentId, ids.TOOLBAR);
    const isCreatingCollection = !collectionName;

    const unfollowEnabled = !isAdmin && isFollower;
    const followEnabled = !isAdmin && !isFollower;
    const deleteEnabled = isAdmin && !isCreatingCollection;
    const { isSmDown, isSmUp } = useBreakpoints();

    return (
        <Toolbar variant="dense">
            <BackButton dirty={dirty} />
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
            {!isSmDown && (
                <>
                    {unfollowEnabled && (
                        <Button
                            color="primary"
                            variant="outlined"
                            id={buildID(baseId, ids.BUTTONS.UNFOLLOW_BTN)}
                            className={classes.button}
                            startIcon={<ExitToApp />}
                            onClick={() => {
                                setUnfollowCollectionDlgOpen(true);
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
                                setFollowCollectionDlgOpen(true);
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
                                setDeleteCollectionDlgOpen(true);
                            }}
                        >
                            {t("common:delete")}
                        </DeleteButton>
                    )}
                </>
            )}
            {!isSmUp && (
                <DotMenu
                    baseId={baseId}
                    render={(onClose) => [
                        unfollowEnabled && (
                            <MenuItem
                                key={buildID(baseId, ids.BUTTONS.UNFOLLOW_MI)}
                                id={buildID(baseId, ids.BUTTONS.UNFOLLOW_MI)}
                                onClick={() => {
                                    onClose();
                                    setUnfollowCollectionDlgOpen(true);
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
                                id={buildID(baseId, ids.BUTTONS.FOLLOW_MI)}
                                onClick={() => {
                                    onClose();
                                    setFollowCollectionDlgOpen(true);
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
                                id={buildID(baseId, ids.BUTTONS.DELETE_MI)}
                                onClick={() => {
                                    onClose();
                                    setDeleteCollectionDlgOpen(true);
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
            )}
            <ConfirmationDialog
                baseId={ids.UNFOLLOW_COLLECTION_DLG}
                open={unfollowCollectionDlgOpen}
                onClose={() => setUnfollowCollectionDlgOpen(false)}
                onConfirm={() => {
                    setUnfollowCollectionDlgOpen(false);
                    onUnfollowSelected();
                }}
                title={t("unfollowCollectionTitle", {
                    name: collectionName,
                })}
                contentText={t("unfollowCollectionText")}
                confirmButtonText={t("unfollow")}
            />
            <ConfirmationDialog
                baseId={ids.DELETE_COLLECTION_DLG}
                open={deleteCollectionDlgOpen}
                onClose={() => setDeleteCollectionDlgOpen(false)}
                onConfirm={() => {
                    setDeleteCollectionDlgOpen(false);
                    onDeleteCollectionSelected();
                }}
                title={t("deleteCollectionTitle", { name: collectionName })}
                contentText={t("deleteCollectionText")}
                confirmButtonText={t("common:delete")}
            />
            <ConfirmationDialog
                baseId={ids.FOLLOW_COLLECTION_DLG}
                open={followCollectionDlgOpen}
                onClose={() => setFollowCollectionDlgOpen(false)}
                onConfirm={() => {
                    setFollowCollectionDlgOpen(false);
                    onFollowSelected();
                }}
                title={t("followCollectionTitle", { name: collectionName })}
                contentText={t("followCollectionText")}
                confirmButtonText={t("follow")}
            />
        </Toolbar>
    );
}

export default EditCollectionToolbar;
