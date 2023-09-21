import React from "react";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Typography,
    useTheme,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import { PlayCircleOutlineOutlined } from "@mui/icons-material";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import ids from "components/instantlaunches/ids";
import InstantLaunchButtonWrapper from "./InstantLaunchButtonWrapper";

const useStyles = makeStyles((theme) => ({
    progress: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(5),
    },
    inProgress: {
        marginBottom: theme.spacing(3),
    },
    closeAuto: {
        marginBottom: theme.spacing(3),
    },
}));

/**
 * The loading dialog that displays while the acutal submission call is in progress.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether or not the dialog is open.
 */
export const InstantLaunchSubmissionDialog = ({ open }) => {
    const baseID = buildID(ids.BASE, ids.SUBMISSION, ids.DIALOG);
    const { t } = useTranslation("instantlaunches");
    const classes = useStyles();

    return (
        <Dialog
            open={open}
            onClose={(event) => {
                event.stopPropagation();
                event.preventDefault();
            }}
            id={baseID}
            disableEscapeKeyDown
        >
            <DialogTitle id={buildID(baseID, ids.TITLE)}>
                {t("submittingInstantLaunch")}
            </DialogTitle>

            <DialogContent>
                <div
                    className={classes.progress}
                    id={buildID(baseID, ids.PROGRESS)}
                >
                    <LinearProgress />
                </div>

                <Typography variant="h6" className={classes.inProgress}>
                    {t("submissionInProgress")}
                </Typography>

                <Typography variant="body2" className={classes.closeAuto}>
                    {t("dialogWillCloseAutomatically")}
                </Typography>

                <Typography variant="caption">
                    {t("disablePopupBlocker")}
                </Typography>
            </DialogContent>
        </Dialog>
    );
};

/**
 * An IconButton with a handler that launches the app in the instant launch with
 * the resource as an input.
 *
 * @param {Object} props
 * @param {Object} props.instantLaunch - The instant launch to use.
 * @param {Object} props.resource - The resource to use as an input to the instant launch.
 */
const InstantLaunchButton = ({
    instantLaunch,
    resource = {},
    size = "medium",
    themeSpacing = 0,
    color = "primary",
    computeLimitExceeded = false,
}) => {
    const baseID = buildID(ids.BASE, ids.LAUNCH, ids.BUTTON);
    const theme = useTheme();

    return (
        <InstantLaunchButtonWrapper
            instantLaunch={instantLaunch}
            resource={resource}
            computeLimitExceeded={computeLimitExceeded}
            render={(onClick) => (
                <IconButton
                    id={baseID}
                    variant="contained"
                    size={size}
                    style={{ marginLeft: theme.spacing(themeSpacing) }}
                    color={color}
                    onClick={onClick}
                >
                    <PlayCircleOutlineOutlined />
                </IconButton>
            )}
        />
    );
};

export default InstantLaunchButton;
