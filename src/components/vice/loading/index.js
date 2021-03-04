/**
 * @author aramsey
 */
import React, { useEffect, useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    Container,
    Drawer,
    makeStyles,
    Typography,
} from "@material-ui/core";
import { BugReport, Info } from "@material-ui/icons";
import { Trans, useTranslation } from "i18n";
import { useQuery } from "react-query";

import LinearProgressWithLabel from "components/utils/LinearProgressWithLabel";
import ContactSupportDialog from "./ContactSupportDialog";
import DetailsContent from "./DetailsContent";
import ids from "./ids";
import {
    getLoadingStatus,
    getUrlReady,
    VICE_LOADING_STATUS_QUERY,
    VICE_LOADING_URL_READY,
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
    const [contactSupportDlgOpen, setContactSupportDlgOpen] = useState(false);
    const [data, setData] = useState({});
    const [ready, setReady] = useState(false);
    const [progress, setProgress] = useState({
        percent: 0,
        message: null,
        hasError: false,
    });
    const handleClose = () => setDrawerOpen(false);
    const handleClick = () => setDrawerOpen(!drawerOpen);
    const onContactSupport = () => setContactSupportDlgOpen(true);
    const onCloseContactSupport = () => setContactSupportDlgOpen(false);

    const { deployments, configMaps, services, ingresses, pods } = data;
    const deployment = deployments?.[0];

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
                hasError: false,
                message: t("initializingVice"),
            });
        } else if (fileTransferStatus !== DEContainerStatus.DONE) {
            const hasError = fileTransferStatus === DEContainerStatus.ERROR;
            setProgress({
                percent: 20,
                hasError,
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
                hasError,
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
            });
        } else if (analysisPodStatus !== DEContainerStatus.DONE) {
            const hasError = analysisPodStatus === DEContainerStatus.ERROR;

            setProgress({
                percent: 75,
                hasError,
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
            });
        } else {
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
                        components={{
                            bold: <b />,
                            break: <br />,
                        }}
                    />
                ),
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
        urlReadyError,
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
                onClick={onContactSupport}
            >
                {t("reportProblemBtn")}
            </Button>

            <Drawer
                id={build(baseId, ids.DETAILS_DRAWER)}
                anchor="bottom"
                open={drawerOpen}
                onClose={handleClose}
            >
                <DetailsContent
                    deployments={deployments}
                    configMaps={configMaps}
                    services={services}
                    ingresses={ingresses}
                    pods={pods}
                />
            </Drawer>

            <ContactSupportDialog
                baseId={ids.CONTACT_SUPPORT_DLG}
                open={contactSupportDlgOpen}
                onClose={onCloseContactSupport}
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
