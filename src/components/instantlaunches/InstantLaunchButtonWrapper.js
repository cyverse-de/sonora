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

import { useMutation, useQuery } from "react-query";

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
import {
    instantlyLaunch,
    extractLaunchId,
} from "serviceFacades/instantlaunches";
import {
    SAVED_LAUNCH_APP_INFO,
    getAppInfo,
} from "serviceFacades/savedLaunches";
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
    const [appInfo, setAppInfo] = React.useState(null);

    const [signInDlgOpen, setSignInDlgOpen] = React.useState(false);
    const [accessRequestDialogOpen, setAccessRequestDialogOpen] =
        React.useState(false);
    const [pendingRequestDlgOpen, setPendingRequestDlgOpen] =
        React.useState(false);
    const [runErrorDetails, setRunErrorDetails] = React.useState(null);
    const [ilUrl, setIlUrl] = React.useState();

    const { t } = useTranslation("launch");

    React.useEffect(() => {
        if (ilUrl) {
            window.open(`${getHost()}${ilUrl}`);
            setIlUrl(null);
            setOpen(false);
        }
    }, [ilUrl]);

    const launchId = extractLaunchId(instantLaunch);

    const { isFetching: savedLaunchLoading } = useQuery({
        queryKey: [SAVED_LAUNCH_APP_INFO, { launchId }],
        queryFn: () => getAppInfo({ launchId }),
        enabled: open,
        onSuccess: setAppInfo,
        onError: (err) => {
            setOpen(false);
            showErrorAnnouncer(err.message, err);
        },
    });

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

    useEffect(() => {
        if (open && !savedLaunchLoading) {
            launch({
                instantLaunch,
                resource,
                output_dir,
                preferences,
                appInfo,
            });
        }
    }, [
        open,
        savedLaunchLoading,
        instantLaunch,
        launch,
        resource,
        output_dir,
        preferences,
        appInfo,
    ]);

    const onClick = useCallback(() => {
        if (userId) {
            if (computeLimitExceeded) {
                showErrorAnnouncer(t("computeLimitExceededMsg"));
            } else {
                setOpen(true);
            }
        } else {
            setSignInDlgOpen(true);
        }
    }, [computeLimitExceeded, showErrorAnnouncer, t, userId]);

    useEffect(() => {
        if (autolaunch && !hasLaunched) {
            onClick();
            setHasLaunched(true);
        }
    }, [autolaunch, onClick, hasLaunched]);

    return (
        <>
            {!autolaunch && render && render(onClick)}
            <InstantLaunchSubmissionDialog
                open={open}
                appInfo={appInfo}
                resource={resource}
            />
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
