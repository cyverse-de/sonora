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

import { ERROR_CODES } from "components/utils/error/errorCode";
import NavigationConstants from "common/NavigationConstants";

import { useHomePath } from "components/data/utils";

import { useConfig } from "contexts/config";
import { useBootstrapInfo } from "contexts/bootstrap";

import { submitAnalysis } from "serviceFacades/analyses";
import { addQuickLaunch } from "serviceFacades/quickLaunches";

import { trackIntercomEvent, IntercomEvents } from "common/intercom";

import RunError from "components/apps/RunError";
import AppLaunchWizard from "./AppLaunchWizard";
import WrappedErrorHandler from "../../utils/error/WrappedErrorHandler";
import AccessRequestDialog from "components/vice/AccessRequestDialog";
import { Button, Typography } from "@material-ui/core";
import { getErrorCode, ERROR_CODES } from "components/utils/error/errorCode";

const Launch = ({ app, launchError, loading }) => {
   const [submissionError, setSubmissionError] = React.useState(null);
    const [
        accessRequestDialogOpen,
        setAccessRequestDialogOpen,
    ] = React.useState(false);
    const [bootstrapInfo] = useBootstrapInfo();
    const [config] = useConfig();
    const homePath = useHomePath();

    const router = useRouter();
    const { t } = useTranslation("vice");

    const [submitAnalysisMutation] = useMutation(
        ({ submission }) => submitAnalysis(submission),
        {
            onSuccess: (resp, { onSuccess }) => {
                router.push(`/${NavigationConstants.ANALYSES}`);
                onSuccess(resp);
                trackIntercomEvent(IntercomEvents.LAUNCHED_JOB, resp);
            },
            onError: (error, { onError }) => {
                const code = getErrorCode(error);
                console.log("code is =>" + code);
                if (
                    code === ERROR_CODES.ERR_FORBIDDEN ||
                    code === ERROR_CODES.ERR_LIMIT_REACHED ||
                    code === ERROR_CODES.ERR_PERMISSION_NEEDED
                ) {
                    setViceAccessError(code);
                }
                onError(error);
                setSubmissionError(error);
            },
        }
    );

    const [addQuickLaunchMutation] = useMutation(
        ({ quickLaunch }) => addQuickLaunch(quickLaunch),
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

    const defaultOutputDir =
        preferences?.default_output_folder?.path ||
        preferences?.system_default_output_dir?.path ||
        (homePath && `${homePath}/analyses`) ||
        "";

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
                    <RunError code={launchError} />
                </Typography>
            );
        }
        if (launchError === ERROR_CODES.ERR_PERMISSION_NEEDED) {
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
                        Request Access
                    </Button>
                    <AccessRequestDialog
                        open={accessRequestDialogOpen}
                        baseId={baseId}
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
        <>
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
                saveQuickLaunch={(quickLaunch, onSuccess, onError) => {
                    setSubmissionError(null);
                    addQuickLaunchMutation({ quickLaunch, onSuccess, onError });
                }}
            />
        </>
    );
};

export default Launch;
