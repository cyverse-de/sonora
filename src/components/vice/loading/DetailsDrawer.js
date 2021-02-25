/**
 * @author aramsey
 *
 * A Drawer component that displays on the VICE app loading page.
 *
 * The drawer contains more advanced information about the deployment of the
 * kubernetes resources for the VICE app.
 */
import React from "react";

import { Drawer, Grid, makeStyles, Typography } from "@material-ui/core";

import { useTranslation } from "i18n";
import GridLabelValue from "components/utils/GridLabelValue";
import styles from "./styles";

const useStyles = makeStyles(styles);

function DeploymentInfo(props) {
    const { deployments } = props;
    const { t } = useTranslation("vice-loading");

    const deployment = deployments?.[0];

    return (
        <>
            <Typography variant="h6">
                {!!deployment
                    ? t("deploymentComplete")
                    : t("deploymentPending")}
            </Typography>
            <Grid container>
                <GridLabelValue label={t("username")}>
                    <Typography>{deployment?.username}</Typography>
                </GridLabelValue>
                <GridLabelValue label={t("appName")}>
                    <Typography>{deployment?.appName}</Typography>
                </GridLabelValue>
                <GridLabelValue label={t("externalId")}>
                    <Typography>{deployment?.externalID}</Typography>
                </GridLabelValue>
                <GridLabelValue label={t("creationTime")}>
                    <Typography>{deployment?.creationTimestamp}</Typography>
                </GridLabelValue>
                <GridLabelValue label={t("image")}>
                    <Typography>{deployment?.image}</Typography>
                </GridLabelValue>
                <GridLabelValue label={t("containerPort")}>
                    <Typography>{deployment?.port}</Typography>
                </GridLabelValue>
                <GridLabelValue label={t("containerUid")}>
                    <Typography>{deployment?.user}</Typography>
                </GridLabelValue>
                <GridLabelValue label={t("containerGroupId")}>
                    <Typography>{deployment?.group}</Typography>
                </GridLabelValue>
            </Grid>
        </>
    );
}

function PodInfo(props) {
    const { pods } = props;
    const { t } = useTranslation("vice-loading");
    const pod = pods?.[0];
    const containerStatuses = pod?.containerStatuses;
    const podsPending = containerStatuses.find((status) => !status.ready);
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6">
                    {podsPending ? t("podsPending") : t("podsComplete")}
                </Typography>
            </Grid>
            {containerStatuses.map((status, index) => (
                <GridLabelValue label={status.name} key={index}>
                    <Typography>{JSON.stringify(status.state)}</Typography>
                </GridLabelValue>
            ))}
        </Grid>
    );
}

function InitContainerInfo(props) {
    const { initContainerStatus } = props;
    const { t } = useTranslation("vice-loading");
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h6">
                    {initContainerStatus?.ready
                        ? t("initContainerComplete")
                        : t("initContainerPending")}
                </Typography>
            </Grid>
            <GridLabelValue label={t("inputFilesLabel")}>
                <Typography>
                    {JSON.stringify(initContainerStatus.state)}
                </Typography>
            </GridLabelValue>
        </Grid>
    );
}

function DetailsDrawer(props) {
    const {
        drawerId,
        open,
        onClose,
        deployments,
        configMaps,
        services,
        ingresses,
        pods,
    } = props;
    const { t } = useTranslation("vice-loading");
    const classes = useStyles();

    return (
        <Drawer id={drawerId} anchor="bottom" open={open} onClose={onClose}>
            <div className={classes.drawerContent}>
                <DeploymentInfo deployments={deployments} />

                <Typography variant="h6">
                    {services?.length > 0
                        ? t("serviceComplete")
                        : t("servicePending")}
                </Typography>
                <Typography variant="h6">
                    {ingresses?.length > 0
                        ? t("ingressComplete")
                        : t("ingressPending")}
                </Typography>
                <Typography variant="h6">
                    {configMaps?.length > 1
                        ? t("configMapsComplete")
                        : t("configMapsPending")}
                </Typography>

                <InitContainerInfo
                    initContainerStatus={pods?.[0]?.initContainerStatuses?.[0]}
                />
                <PodInfo pods={pods} />
            </div>
        </Drawer>
    );
}

export default DetailsDrawer;
