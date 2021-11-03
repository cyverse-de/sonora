/**
 * @author psarando
 *
 * A component for displaying the App Launch Wizard for a given app.
 * Also handles calling analysis submission and quick-launch-save endpoints.
 */
import React from "react";

import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useTranslation } from "i18n";

import NavigationConstants from "common/NavigationConstants";

import { useDefaultOutputDir } from "components/data/utils";

import { useConfig } from "contexts/config";
import { useBootstrapInfo } from "contexts/bootstrap";

import { submitAnalysis } from "serviceFacades/analyses";
import { addSavedLaunch } from "serviceFacades/savedLaunches";

import { trackIntercomEvent, IntercomEvents } from "common/intercom";

import RunError from "components/apps/RunError";
import AppLaunchWizard from "./AppLaunchWizard";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import { ERROR_CODES } from "components/error/errorCode";
import AccessRequestDialog from "components/vice/AccessRequestDialog";
import ids from "components/apps/ids";

import { Button, Typography } from "@material-ui/core";

const Launch = ({
    app,
    launchError,
    viceQuota,
    runningJobs,
    pendingRequest,
    loading,
}) => {
    const [submissionError, setSubmissionError] = React.useState(null);
    const [accessRequestDialogOpen, setAccessRequestDialogOpen] =
        React.useState(false);
    const [bootstrapInfo] = useBootstrapInfo();
    const [config] = useConfig();

    const router = useRouter();
    const { t } = useTranslation("vice");
    const defaultOutputDir = useDefaultOutputDir();

    const { mutate: submitAnalysisMutation } = useMutation(
        ({ submission }) => submitAnalysis(submission),
        {
            onSuccess: (resp, { onSuccess }) => {
                router.push(`/${NavigationConstants.ANALYSES}/${resp?.id}`);
                onSuccess(resp);
                trackIntercomEvent(IntercomEvents.LAUNCHED_JOB, resp);
            },
            onError: (error, { onError }) => {
                onError(error);
                setSubmissionError(error);
            },
        }
    );

    const { mutate: addSavedLaunchMutation } = useMutation(
        ({ savedLaunch }) => addSavedLaunch(savedLaunch),
        {
            onSuccess: (resp, { onSuccess }) => {
                // TODO route to app details or QL listing page?
                onSuccess(resp);
            },
            onError: (error, { onError }) => {
                onError(error);
                setSubmissionError(error);
            },
        }
    );

    const preferences = bootstrapInfo?.preferences;
    const notify = preferences?.enableAnalysisEmailNotification || false;

    const defaultMaxCPUCores = config?.tools?.private.max_cpu_limit;
    const defaultMaxMemory = config?.tools?.private.max_memory_limit;
    const defaultMaxDiskSpace = config?.tools?.private.max_disk_limit;

    const baseId = "apps";

    if (launchError) {
        if (
            launchError === ERROR_CODES.ERR_LIMIT_REACHED ||
            launchError === ERROR_CODES.ERR_FORBIDDEN
        ) {
            return (
                <Typography style={{ margin: 8 }}>
                    <RunError
                        code={launchError}
                        viceQuota={viceQuota}
                        runningJobs={runningJobs}
                    />
                </Typography>
            );
        }
        if (launchError === ERROR_CODES.ERR_PERMISSION_NEEDED) {
            if (pendingRequest) {
                return (
                    <Typography style={{ margin: 8 }}>
                        {t("pendingRequestMessage")}
                    </Typography>
                );
            }
            return (
                <>
                    <Typography style={{ margin: 8 }}>
                        {t("accessRequestPrompt")}
                    </Typography>
                    <Button
                        onClick={() => setAccessRequestDialogOpen(true)}
                        color="primary"
                        variant="contained"
                    >
                        {t("requestAccess")}
                    </Button>
                    <AccessRequestDialog
                        open={accessRequestDialogOpen}
                        baseId={ids.ACCESS_REQUEST_DLG}
                        onClose={() => setAccessRequestDialogOpen(false)}
                    />
                </>
            );
        }
        return (
            <WrappedErrorHandler errorObject={launchError} baseId={baseId} />
        );
    }

    return (
        <AppLaunchWizard
            baseId={baseId}
            notify={notify}
            defaultOutputDir={defaultOutputDir}
            defaultMaxCPUCores={defaultMaxCPUCores}
            defaultMaxMemory={defaultMaxMemory}
            defaultMaxDiskSpace={defaultMaxDiskSpace}
            app={app}
            appError={submissionError}
            loading={loading}
            submitAnalysis={(submission, onSuccess, onError) => {
                setSubmissionError(null);
                submitAnalysisMutation({ submission, onSuccess, onError });
            }}
            createSavedLaunch={(savedLaunch, onSuccess, onError) => {
                setSubmissionError(null);
                addSavedLaunchMutation({ savedLaunch, onSuccess, onError });
            }}
        />
    );
};

export default Launch;
