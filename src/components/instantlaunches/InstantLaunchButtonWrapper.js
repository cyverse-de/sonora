/**
 * @author aramsey
 *
 * A component meant to wrap any other clickable element that should launch
 * an instant launch.
 *
 * The render component will be passed an `onClick` function.
 * The `onClick` function will handle launching the instant launch and
 * briefly displaying the Submission dialog to the user.
 */
import React, { useEffect, useCallback } from "react";

import { useMutation } from "react-query";

import { useRouter } from "next/router";

import NavigationConstants from "common/NavigationConstants";

import { useDefaultOutputDir } from "components/data/utils";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import { getHost } from "components/utils/getHost";
import SignInDialog from "components/utils/SignInDialog";
import AccessRequestDialog from "components/vice/AccessRequestDialog";
import RunErrorDialog from "components/vice/RunErrorDialog";
import VicePendingRequestDlg from "components/vice/VicePendingRequestDlg";

import constants from "constants.js";
import { useUserProfile } from "contexts/userProfile";
import { useBootstrapInfo } from "contexts/bootstrap";
import ids from "./ids";
import { InstantLaunchSubmissionDialog } from "./index";
import { instantlyLaunch } from "serviceFacades/instantlaunches";
import { useTranslation } from "i18n";
import { ERROR_CODES } from "components/error/errorCode";

function InstantLaunchButtonWrapper(props) {
    const {
        instantLaunch,
        computeLimitExceeded,
        resource = {},
        render,
        showErrorAnnouncer,
        autolaunch,
    } = props;
    const output_dir = useDefaultOutputDir();
    const [userProfile] = useUserProfile();
    const [bootstrapInfo] = useBootstrapInfo();

    const [open, setOpen] = React.useState(false);
    const [hasLaunched, setHasLaunched] = React.useState(false);
    const [signInDlgOpen, setSignInDlgOpen] = React.useState(false);
    const [accessRequestDialogOpen, setAccessRequestDialogOpen] =
        React.useState(false);
    const [pendingRequestDlgOpen, setPendingRequestDlgOpen] =
        React.useState(false);
    const [runErrorDetails, setRunErrorDetails] = React.useState(null);
    const [ilUrl, setIlUrl] = React.useState();

    const router = useRouter();
    const { t } = useTranslation("launch");

    React.useEffect(() => {
        if (ilUrl) {
            window.open(`${getHost()}${ilUrl}`);
            setIlUrl(null);
            setOpen(false);
        }
    }, [ilUrl]);

    const { mutate: launch } = useMutation(instantlyLaunch, {
        onSuccess: (listing) => {
            if (listing.analyses.length > 0) {
                const analysis = listing.analyses[0];
                if (analysis.interactive_urls?.length > 0) {
                    setIlUrl(
                        `${constants.VICE_LOADING_PAGE}/${encodeURIComponent(
                            analysis.interactive_urls[0]
                        )}`
                    );
                } else {
                    setOpen(false);
                }
                if (autolaunch) {
                    // go to the analysis landing, not keeping this page in browser history
                    router.replace(
                        `/${NavigationConstants.ANALYSES}/${analysis?.id}`
                    );
                }
            } else {
                setOpen(false);
            }
        },
        onError: (err) => {
            setOpen(false);

            const respData = err.response?.data;
            const runErrorCode = respData?.error_code;
            const details = respData?.details;

            if (runErrorCode === ERROR_CODES.ERR_PERMISSION_NEEDED) {
                if (details?.pendingRequest) {
                    setPendingRequestDlgOpen(true);
                } else {
                    setAccessRequestDialogOpen(true);
                }
            } else if (
                runErrorCode === ERROR_CODES.ERR_LIMIT_REACHED ||
                runErrorCode === ERROR_CODES.ERR_FORBIDDEN
            ) {
                setRunErrorDetails({ runErrorCode, ...details });
            } else {
                showErrorAnnouncer(err.message, err);
            }
        },
    });

    const preferences = bootstrapInfo?.preferences;
    const userId = userProfile?.id;

    const onClick = useCallback(() => {
        if (userId) {
            if (computeLimitExceeded) {
                showErrorAnnouncer(t("computeLimitExceededMsg"));
            } else {
                setOpen(true);
                launch({
                    instantLaunch,
                    resource,
                    output_dir,
                    preferences,
                });
            }
        } else {
            setSignInDlgOpen(true);
        }
    }, [
        preferences,
        computeLimitExceeded,
        instantLaunch,
        launch,
        output_dir,
        resource,
        showErrorAnnouncer,
        t,
        userId,
    ]);

    useEffect(() => {
        if (autolaunch && !hasLaunched) {
            onClick();
            setHasLaunched(true);
        }
    }, [autolaunch, onClick, hasLaunched, setHasLaunched]);

    return (
        <>
            {!autolaunch && render && render(onClick)}
            <InstantLaunchSubmissionDialog open={open} />
            <SignInDialog
                open={signInDlgOpen}
                handleClose={() => setSignInDlgOpen(false)}
            />
            <AccessRequestDialog
                open={accessRequestDialogOpen}
                baseId={ids.ACCESS_REQUEST_DLG}
                onClose={() => setAccessRequestDialogOpen(false)}
            />
            <VicePendingRequestDlg
                open={pendingRequestDlgOpen}
                onClose={() => setPendingRequestDlgOpen(false)}
            />
            <RunErrorDialog
                baseId={ids.RUN_ERROR_DLG}
                open={!!runErrorDetails}
                onClose={() => setRunErrorDetails(null)}
                code={runErrorDetails?.runErrorCode}
                runningJobs={runErrorDetails?.runningJobs}
                viceQuota={runErrorDetails?.maxJobs}
            />
        </>
    );
}

export default withErrorAnnouncer(InstantLaunchButtonWrapper);
