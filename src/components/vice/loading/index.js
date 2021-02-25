/**
 * @author aramsey
 */
import React, { useEffect, useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import { BugReport, Info } from "@material-ui/icons";
import { Trans, useTranslation } from "i18n";
import { useQuery } from "react-query";

import LinearProgressWithLabel from "components/utils/LinearProgressWithLabel";
import DetailsDrawer from "./DetailsDrawer";
import ids from "./ids";
import {
    getLoadingStatus,
    VICE_LOADING_STATUS_QUERY,
} from "serviceFacades/vice/loading";
import { DEContainerStatus, getContainerDetails } from "./util";
import styles from "./styles";

const useStyles = makeStyles(styles);

function ViceLoading(props) {
    const { accessUrl } = props;
    const { t } = useTranslation("vice-loading");
    const classes = useStyles();

    const baseId = ids.VIEW;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [data, setData] = useState({});
    const [progress, setProgress] = useState({
        percent: 0,
        message: null,
        hasError: false,
    });
    const handleClose = () => setDrawerOpen(false);
    const handleClick = () => setDrawerOpen(!drawerOpen);

    const { deployments, configMaps, services, ingresses, pods } = data;
    const deployment = deployments?.[0];

    const { isFetching, error: statusError } = useQuery({
        queryKey: [VICE_LOADING_STATUS_QUERY, { accessUrl }],
        queryFn: getLoadingStatus,
        config: {
            enabled: !!accessUrl,
            onSuccess: setData,
            refetchInterval: 5000,
        },
    });

    useEffect(() => {
        if (statusError) {
            setProgress({
                hasError: true,
                percent: 0,
                message: t("statusEndpointError"),
            });
            return;
        }

        const appName = deployments?.[0]?.appName;
        const deploymentsDone = deployments?.length > 0;
        const configMapsDone = configMaps?.length > 1;
        const servicesDone = services?.length > 0;
        const ingressesDone = ingresses?.length > 0;

        const {
            status: fileTransferStatus,
            restartCount: fileTransferRestartCount,
        } = getContainerDetails(pods, "input-files-init");
        const {
            status: inputFilesPodStatus,
            restartCount: inputFilesPodRestartCount,
        } = getContainerDetails(pods, "input-files");
        const {
            status: viceProxyPodStatus,
            restartCount: viceProxyPodRestartCount,
        } = getContainerDetails(pods, "vice-proxy");
        const {
            status: analysisPodStatus,
            restartCount: analysisPodRestartCount,
            image: analysisPodImage,
        } = getContainerDetails(pods, "analysis");

        if (
            !(
                deploymentsDone &&
                configMapsDone &&
                servicesDone &&
                ingressesDone
            )
        ) {
            setProgress({
                percent:
                    (deploymentsDone +
                        configMapsDone +
                        servicesDone +
                        ingressesDone) *
                    5,
                message: t("initializingVice"),
            });
        } else if (fileTransferStatus !== DEContainerStatus.DONE) {
            const hasError = fileTransferStatus === DEContainerStatus.ERROR;
            setProgress({
                percent: 20,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "downloadInputsError"
                                : "downloadingInputs"
                        }
                        values={{ restartCount: fileTransferRestartCount }}
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
                hasError,
            });
        } else if (
            inputFilesPodStatus !== DEContainerStatus.DONE &&
            viceProxyPodStatus !== DEContainerStatus.DONE
        ) {
            const hasError =
                inputFilesPodStatus === DEContainerStatus.ERROR ||
                viceProxyPodStatus === DEContainerStatus.ERROR;
            const restartCount =
                inputFilesPodRestartCount || viceProxyPodRestartCount;
            setProgress({
                percent: 60,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "downloadingDEImages"
                                : "downloadingDEImages"
                        }
                        values={{ restartCount }}
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
                hasError,
            });
        } else if (analysisPodStatus !== DEContainerStatus.DONE) {
            const hasError = analysisPodStatus === DEContainerStatus.ERROR;

            setProgress({
                percent: 75,
                message: (
                    <Trans
                        t={t}
                        i18nKey={
                            hasError
                                ? "downloadVICEImageError"
                                : "downloadingVICEImage"
                        }
                        values={{
                            restartCount: analysisPodRestartCount,
                            image: analysisPodImage,
                            appName,
                        }}
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
                hasError,
            });
        } else {
            setProgress({
                percent: 100,
                message: t("waitingForResponse", { appName }),
            });
        }
    }, [
        configMaps,
        data,
        deployments,
        ingresses,
        pods,
        services,
        statusError,
        t,
    ]);

    if (isFetching && Object.keys(data).length === 0) {
        return (
            <img
                id={build(baseId, ids.LOADING_GIF)}
                src="/vice_loading_rocket.gif"
                alt={t("loadingGifAltText")}
                className={classes.centeredImage}
            />
        );
    }

    return (
        <Container maxWidth="md">
            <img
                id={build(baseId, ids.LOADING_IMG)}
                src="/vice_loading.png"
                alt={t("loadingImgAltText")}
                className={classes.centeredImage}
            />

            <Typography variant="h5" gutterBottom={true}>
                {t("launchVICE", { appName: deployment?.appName })}
            </Typography>

            <LinearProgressWithLabel value={progress.percent} />

            <Typography
                id={build(baseId, ids.STATUS_MSG)}
                gutterBottom={true}
                color={progress.hasError ? "error" : "inherit"}
                classes={{ root: classes.typographyMessage }}
            >
                {progress.message}
            </Typography>

            <Button
                id={build(baseId, ids.SHOW_MORE_BTN)}
                variant="contained"
                color="primary"
                startIcon={<Info />}
                onClick={handleClick}
                classes={{ root: classes.button }}
            >
                {t("showMoreBtn")}
            </Button>
            <Button
                id={build(baseId, ids.REPORT_PROBLEM_BTN)}
                variant="contained"
                startIcon={<BugReport />}
            >
                {t("reportProblemBtn")}
            </Button>

            <DetailsDrawer
                drawerId={build(baseId, ids.DETAILS_DRAWER)}
                open={drawerOpen}
                onClose={handleClose}
                deployments={deployments}
                configMaps={configMaps}
                services={services}
                ingresses={ingresses}
                pods={pods}
            />
        </Container>
    );
}

export default ViceLoading;
