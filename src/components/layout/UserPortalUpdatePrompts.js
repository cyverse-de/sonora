/**
 * @author aramsey
 *
 * The components for prompting users to update their user account information
 * within the User Portal if necessary.
 *
 * The Snackbar is used when the user is within the grace period to update
 * their information.
 *
 * The dialog is used when the grace period has expired and the user must
 * update their information in order to use CyVerse services.
 */

import React, { useEffect, useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    makeStyles,
    Snackbar,
    Typography,
    useTheme,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Alert, AlertTitle } from "@material-ui/lab";

import constants from "constants.js";
import { useUserProfile } from "contexts/userProfile";
import { useTranslation } from "i18n";
import ids from "./ids";
import { usePortalStatus } from "serviceFacades/users";
import styles from "./styles";

const useStyles = makeStyles(styles);

function UserPortalUpdatePrompts() {
    const [userProfile] = useUserProfile();

    const { t } = useTranslation("common");
    const theme = useTheme();
    const classes = useStyles();

    const baseId = ids.USER_PORTAL_UPDATE_DLG;
    const dialogTitleId = buildID(baseId, ids.DIALOG_TITLE);

    const [showSnackbar, setShowSnackbar] = useState(false);

    const { data: userPortalResp } = usePortalStatus(userProfile?.id, (err) => {
        console.log("Received error response from user portal API", err);
    });

    useEffect(() => {
        setShowSnackbar(userPortalResp?.warning_required);
    }, [userPortalResp]);

    const onCloseAnnouncer = () => setShowSnackbar(false);

    const onUpdateNow = () => {
        const updateUrl = userPortalResp?.update_url;
        if (updateUrl) {
            const portalUrl = `${updateUrl}&redirectUrl=${encodeURIComponent(
                window.location.href
            )}`;
            window.location.replace(portalUrl);
        }
    };

    const onLearnMore = () => {
        window.open(constants.USER_PORTAL_FAQ, "_blank");
    };

    return (
        <>
            <Snackbar
                id={ids.USER_PORTAL_ANNOUNCER}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                open={showSnackbar}
            >
                <Alert
                    variant="filled"
                    severity="warning"
                    style={{
                        color: theme.palette.warning.contrastText,
                    }}
                    action={[
                        <Button
                            variant="outlined"
                            onClick={onLearnMore}
                            id={buildID(
                                ids.USER_PORTAL_ANNOUNCER,
                                ids.LEARN_MORE
                            )}
                            key={ids.LEARN_MORE}
                            classes={{ root: classes.announcerBtn }}
                        >
                            <Typography>{t("learnMore")}</Typography>
                        </Button>,
                        <Button
                            variant="outlined"
                            onClick={onUpdateNow}
                            id={buildID(
                                ids.USER_PORTAL_ANNOUNCER,
                                ids.UPDATE_BTN
                            )}
                            key={ids.UPDATE_BTN}
                        >
                            <Typography>{t("updateNow")}</Typography>
                        </Button>,
                        <IconButton
                            id={buildID(
                                ids.USER_PORTAL_ANNOUNCER,
                                ids.CLOSE_BTN
                            )}
                            key={ids.CLOSE_BTN}
                            size="small"
                            style={{
                                color: theme.palette.warning.contrastText,
                            }}
                            onClick={onCloseAnnouncer}
                        >
                            <Close />
                        </IconButton>,
                    ]}
                >
                    <AlertTitle>{t("updateAccountInformation")}</AlertTitle>
                    {t("userPortalGracePeriodText")}
                </Alert>
            </Snackbar>

            <Dialog
                open={!!userPortalResp?.update_required}
                id={baseId}
                fullWidth
                disableBackdropClick
                disableEscapeKeyDown
                aria-labelledby={dialogTitleId}
            >
                <DialogTitle id={dialogTitleId}>
                    {t("updateAccountInformation")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t("userPortalExpiredText")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        id={buildID(baseId, ids.UPDATE_BTN)}
                        onClick={onUpdateNow}
                        color="primary"
                        variant="contained"
                    >
                        {t("updateAccountInformation")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UserPortalUpdatePrompts;
