/**
 * @author aramsey
 */
import React, { useEffect, useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import { Container, makeStyles, Typography } from "@material-ui/core";
import { Trans, useTranslation } from "i18n";
import { useQuery } from "react-query";

import ErrorHandler from "components/utils/error/ErrorHandler";
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

const useStyles = makeStyles(styles);

function ViceLoading(props) {
    const { accessUrl } = props;
    const { t } = useTranslation("vice-loading");
    const classes = useStyles();

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

    const { isFetching, error: statusError } = useQuery({
        queryKey: [VICE_LOADING_STATUS_QUERY, { accessUrl }],
        queryFn: getLoadingStatus,
        config: {
            enabled: !!accessUrl && !ready,
            onSuccess: setData,
            refetchInterval: 5000,
        },
    });

    const { error: urlReadyError } = useQuery({
        queryKey: [VICE_LOADING_URL_READY, { accessUrl }],
        queryFn: getUrlReady,
        config: {
            enabled: progress.percent === 100 && !ready,
            onSuccess: (resp) => setReady(resp.ready),
            refetchInterval: 5000,
        },
    });

    useEffect(() => {
        setTimeoutError(null);

        let timeout = null;
        const timeoutMilliseconds = config?.vice?.deploymentTimeoutMs || 180000;
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
        const hasPods =
            pod?.containerStatuses?.length > 0 &&
            pod?.initContainerStatuses?.length > 0;

        const {
            done: fileTransferDone,
            hasError: fileTransferError,
            restartCount: fileTransferRestartCount,
        } = getContainerDetails(pods, config?.vice?.initContainerName);
        const {
            done: inputFilesPodDone,
            hasError: inputFilesPodError,
            restartCount: inputFilesPodRestartCount,
        } = getContainerDetails(pods, config?.vice?.inputFilesContainerName);
        const {
            done: viceProxyPodDone,
            hasError: viceProxyPodError,
            restartCount: viceProxyPodRestartCount,
        } = getContainerDetails(pods, config?.vice?.viceProxyContainerName);
        const {
            done: analysisPodDone,
            hasError: analysisPodError,
            restartCount: analysisPodRestartCount,
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
                    />
                ),
            });
            return;
        }

        if (!fileTransferDone) {
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
            const restartCount =
                inputFilesPodRestartCount + viceProxyPodRestartCount;
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
                        values={{ restartCount }}
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
                            restartCount: analysisPodRestartCount,
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

    if (isFetching && Object.keys(data).length === 0 && !statusError) {
        return <LoadingAnimation />;
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
                    id={build(baseId, ids.STATUS_MSG)}
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
