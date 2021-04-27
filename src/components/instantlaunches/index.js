import React from "react";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    makeStyles,
    Typography,
    useTheme,
} from "@material-ui/core";

import { PlayCircleOutlineOutlined } from "@material-ui/icons";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { useRouter } from "next/router";

import constants from "../../constants";
import { useTranslation } from "i18n";

import { build as buildID } from "@cyverse-de/ui-lib";
import ids from "components/instantlaunches/ids";
import { instantlyLaunch } from "serviceFacades/instantlaunches";

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
            disableBackdropClick
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
    showErrorAnnouncer,
    size = "medium",
    themeSpacing = 0,
    color = "primary",
}) => {
    const baseID = buildID(ids.BASE, ids.LAUNCH, ids.BUTTON);
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();

    return (
        <IconButton
            id={baseID}
            variant="contained"
            size={size}
            style={{ marginLeft: theme.spacing(themeSpacing) }}
            color={color}
            onClick={async (event) => {
                event.stopPropagation();
                event.preventDefault();

                setOpen(true);

                await instantlyLaunch(instantLaunch, resource)
                    .then((listing) => {
                        if (listing.analyses.length > 0) {
                            const analysis = listing.analyses[0];
                            if (analysis.interactive_urls.length > 0) {
                                router
                                    .push(
                                        `${
                                            constants.VICE_LOADING_PAGE
                                        }/${encodeURIComponent(
                                            analysis.interactive_urls[0]
                                        )}`
                                    )
                                    .then(() => setOpen(false));
                            } else {
                                setOpen(false);
                            }
                        } else {
                            setOpen(false);
                        }
                    })
                    .catch((error) => {
                        setOpen(false);
                        showErrorAnnouncer(error.message, error);
                    });
            }}
        >
            <InstantLaunchSubmissionDialog open={open} />
            <PlayCircleOutlineOutlined />
        </IconButton>
    );
};

export default withErrorAnnouncer(InstantLaunchButton);
