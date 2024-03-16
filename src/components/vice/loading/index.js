/**
 * @author aramsey
 *
 * The VICE loading page view that displays when a VICE instance is not
 * yet ready.  It shows which stage the launch process is currently in and
 * allows users to see more details or contact support.
 *
 * This component will query the /vice/:subdomain/description endpoint every
 * few seconds to get the latest status to display to the user.
 *
 * The completion percentage is arbitrary but 20% is completed once the
 * deployment, service, ingresses, and config maps are created (5% each), 25%
 * after the pods have been created, 60% after the init container which deals
 * with downloading input files is done, 75% after the 2 DE pods (vice-proxy and
 * input-files) are responding, and 100% after the analysis pod is responding.
 *
 */
import React, { useEffect, useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import { Container, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Trans, useTranslation } from "i18n";
import { useQuery } from "react-query";

import ErrorHandler from "components/error/ErrorHandler";
import LinearProgressWithLabel from "components/utils/LinearProgressWithLabel";
import { useConfig } from "contexts/config";
import ids from "./ids";
import {
    getLoadingStatus,
    getUrlReady,
    VICE_LOADING_STATUS_QUERY,
    VICE_LOADING_URL_READY,
} from "serviceFacades/vice/loading";
import { getContainerDetails } from "./util";
import styles from "./styles";
import ViceLoadingToolbar from "./Toolbar";
import LoadingAnimation from "./LoadingAnimation";

const useStyles = makeStyles()(styles);

function ViceLoading(props) {
    const { accessUrl } = props;
    const { t } = useTranslation("vice-loading");
    const { classes } = useStyles();

    const [config] = useConfig();

    const baseId = ids.VIEW;

    const [timerName, setTimerName] = useState(null);
    const [timeoutError, setTimeoutError] = useState(false);
    const [data, setData] = useState({});
    const [ready, setReady] = useState(false);
    const [progress, setProgress] = useState({
        percent: 0,
        message: null,
        hasError: false,
    });

    const { deployments, configMaps, services, ingresses, pods } = data;
    const deployment = deployments?.[0];
    const appName = deployment?.appName;

    const { error: statusError } = useQuery({
        queryKey: [VICE_LOADING_STATUS_QUERY, { accessUrl }],
        queryFn: () => getLoadingStatus({ accessUrl }),
        enabled: !!accessUrl && !ready,
        onSuccess: setData,
        refetchInterval: 5000,
    });

    const { error: urlReadyError } = useQuery({
        queryKey: [VICE_LOADING_URL_READY, { accessUrl }],
        queryFn: () => getUrlReady({ accessUrl }),
        enabled: progress.percent === 100 && !ready,
        onSuccess: (resp) => setReady(resp.ready),
        refetchInterval: 5000,
    });

    useEffect(() => {
        setTimeoutError(null);

        let timeout = null;
        const timeoutMilliseconds = config?.vice?.deploymentTimeoutMs;
        if (timerName) {
            timeout = setTimeout(() => {
                setTimeoutError(true);
            }, timeoutMilliseconds);
        }
        return () => clearTimeout(timeout);
    }, [config, timerName]);

    useEffect(() => {
        const deploymentsDone = deployments?.length > 0;
        const configMapsDone = configMaps?.length > 1;
        const servicesDone = services?.length > 0;
        const ingressesDone = ingresses?.length > 0;
        const pod = pods?.[0];
        const hasPods = pod?.containerStatuses?.length > 0;

        const {
            done: fileTransferDone,
            hasError: fileTransferError,
            restartCount: fileTransferRestartCount,
            image: fileTransferImage,
        } = getContainerDetails(pods, config?.vice?.initContainerName);
        const usingCSIDriver = fileTransferImage == null;
        const { done: inputFilesPodDone, hasError: inputFilesPodError } =
            getContainerDetails(pods, config?.vice?.inputFilesContainerName);
        const { done: viceProxyPodDone, hasError: viceProxyPodError } =
            getContainerDetails(pods, config?.vice?.viceProxyContainerName);
        const {
            done: analysisPodDone,
            hasError: analysisPodError,
            image: analysisPodImage,
        } = getContainerDetails(pods, config?.vice?.analysisContainerName);

        if (
            !(
                deploymentsDone &&
                configMapsDone &&
                servicesDone &&
                ingressesDone
            )
        ) {
            setTimerName("deployments");
            const hasError = timeoutError;
            setProgress({
                percent:
                    (deploymentsDone +
                        configMapsDone +
                        servicesDone +
                        ingressesDone) *
                    5,
                hasError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "initializingViceLong"
                                : "initializingVice"
                        }
                        values={{ restartCount: fileTransferRestartCount }}
                    />
                ),
            });
            return;
        }

        if (!hasPods) {
            setTimerName("pods");
            const hasError = timeoutError;

            setProgress({
                percent: 20,
                hasError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={hasError ? "findingHostLong" : "findingHost"}
                        values={{ appName }}
                        components={{
                            break: <br />,
                        }}
                    />
                ),
            });
            return;
        }

        if (!usingCSIDriver && !fileTransferDone) {
            setTimerName(null);

            setProgress({
                percent: 25,
                hasError: fileTransferError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            fileTransferError
                                ? "downloadingInputsError"
                                : "downloadingInputs"
                        }
                        values={{ restartCount: fileTransferRestartCount }}
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
            });
            return;
        }

        if (!inputFilesPodDone && !viceProxyPodDone) {
            const hasError = inputFilesPodError || viceProxyPodError;

            setProgress({
                percent: 60,
                hasError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "downloadingDEImagesError"
                                : "downloadingDEImages"
                        }
                        components={{
                            break: <br />,
                        }}
                    />
                ),
            });
            return;
        }

        if (!analysisPodDone) {
            const hasError = analysisPodError;

            setProgress({
                percent: 75,
                hasError,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "downloadingVICEImageError"
                                : "downloadingVICEImage"
                        }
                        values={{
                            image: analysisPodImage,
                            appName,
                        }}
                        components={{
                            break: <br />,
                        }}
                    />
                ),
            });
            return;
        }
        const hasError = !!urlReadyError;
        setProgress({
            percent: 100,
            hasError,
            message: (
                <Trans
                    t={t}
                    i18nKey={
                        hasError
                            ? "waitingForResponseError"
                            : "waitingForResponse"
                    }
                    values={{
                        appName,
                    }}
                />
            ),
        });
    }, [
        config,
        configMaps,
        data,
        deployments,
        ingresses,
        pods,
        services,
        statusError,
        t,
        urlReadyError,
        timeoutError,
        appName,
    ]);

    if (statusError) {
        return <ErrorHandler errorObject={statusError} />;
    }

    if (ready) {
        window.location.href = decodeURIComponent(accessUrl);
    }

    return (
        <>
            <ViceLoadingToolbar
                parentId={baseId}
                deployments={deployments}
                configMaps={configMaps}
                services={services}
                ingresses={ingresses}
                pods={pods}
                ready={ready}
                progressMessage={progress.message}
            />
            <Container maxWidth="md" classes={{ root: classes.scrollable }}>
                <LoadingAnimation />
                {appName && (
                    <Typography variant="h5" gutterBottom={true}>
                        {t("launchVICE", { appName: deployment?.appName })}
                    </Typography>
                )}
                <LinearProgressWithLabel value={progress.percent} />
                <Typography
                    id={buildID(baseId, ids.STATUS_MSG)}
                    gutterBottom={true}
                    color={progress.hasError ? "error" : "inherit"}
                >
                    {progress.message}
                </Typography>
            </Container>
        </>
    );
}

export default ViceLoading;
