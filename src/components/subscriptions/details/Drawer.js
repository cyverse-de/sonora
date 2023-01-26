import React, { useState } from "react";
import { useTranslation } from "i18n";
import { formatDateObject } from "components/utils/DateFormatter";

import {
    Box,
    makeStyles,
    Grid,
    Typography,
    Drawer,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import GridLabelValue from "components/utils/GridLabelValue";
import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";

import { DETab, DETabPanel, DETabs } from "../../utils/DETabs";

const TABS = {
    subscriptionDetails: "Details",
};

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        [theme.breakpoints.up("lg")]: {
            width: "25%",
        },
        [theme.breakpoints.down("lg")]: {
            width: "50%",
        },
        [theme.breakpoints.down("sm")]: {
            width: "90%",
        },
    },
    drawerHeader: {
        margin: theme.spacing(1),
        height: "4em",
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },
    drawerSubheader: {
        marginLeft: theme.spacing(1),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },
}));

function DetailsPanel(props) {
    const { baseId, details } = props;
    const { t } = useTranslation("subscriptions");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    return (
        <>
            {/* <Divider/> */}
            <Typography component="div">
                <Box p={isMobile ? 1 : 3}>
                    <Grid
                        container
                        spacing={3}
                        id={buildID(baseId, details.id, "subscriptionDetails")}
                    >
                        <GridLabelValue label={t("username") + t("colon")}>
                            {details?.user.username}
                        </GridLabelValue>
                        <GridLabelValue label={t("startDate") + t("colon")}>
                            {formatDateObject(
                                details.effective_start_date &&
                                    new Date(details.effective_start_date)
                            )}
                        </GridLabelValue>
                        <GridLabelValue label={t("endDate") + t("colon")}>
                            {details?.effective_end_date}
                        </GridLabelValue>
                        <GridLabelValue label={t("planName") + t("colon")}>
                            {details?.plan.name}
                        </GridLabelValue>
                        <GridLabelValue label={t("quotas") + t("colon")}>
                            <QuotasDetails details={details} />
                        </GridLabelValue>
                        <GridLabelValue label={t("usages") + t("colon")}>
                            <UsagesDetails details={details} />
                        </GridLabelValue>
                    </Grid>
                </Box>
            </Typography>
        </>
    );
}

function QuotasDetails(props) {
    const { details } = props;
    return (
        <>
            {details &&
                details.quotas.length > 0 &&
                details.quotas.map((item, _) => {
                    return (
                        <Typography>
                            {item.quota} {item.resource_type.unit}
                        </Typography>
                    );
                })}
        </>
    );
}

function SubscriptionDrawer(props) {
    const { anchor, baseId, onClose, open, selectedSubscription } = props;
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState("Details");
    const drawerId = buildID(baseId, ids.DETAILS_DRAWER);
    const detailsTabId = buildID(drawerId, ids.DETAILS_TAB);
    const { t } = useTranslation("subscriptions");

    //const username = selectedSubscription?.user.username;
    return (
        <>
            <Drawer
                anchor={anchor}
                onClose={onClose}
                open={open}
                PaperProps={{
                    id: drawerId,
                    classes: { root: classes.drawerPaper },
                    variant: "outlined",
                }}
            >
                {/* <SubscriptionHeader baseId={baseId} username={username}/> */}

                <DETabs value={selectedTab} onChange={setSelectedTab}>
                    <DETab
                        value={TABS.subscriptionDetails}
                        label={t("subscriptionDetailsTabLabel")}
                        id={detailsTabId}
                    />
                </DETabs>
                <DETabPanel
                    tabId={detailsTabId}
                    value={TABS.subscriptionDetails}
                    selectedTab={selectedTab}
                >
                    <SubscriptionSubheader />
                    <DetailsPanel
                        baseId={baseId}
                        details={selectedSubscription}
                    />
                </DETabPanel>
            </Drawer>
        </>
    );
}

// function SubscriptionHeader(props){
//     const {baseId, username} = props;
//     const classes = useStyles();
//     return(
//         <>
//             <div className={classes.drawerHeader}>
//                 <Typography variant="h6" component="span">
//                     {username}
//                 </Typography>
//             </div>
//         </>
//     )
// }

function SubscriptionSubheader() {
    //const { baseId } = props;
    const { t } = useTranslation("subscriptions");
    const classes = useStyles();

    return (
        <div className={classes.drawerSubheader}>
            <Grid container>
                <Grid xs={12}>
                    <item>{t("details")}</item>
                </Grid>
            </Grid>
        </div>
    );
}

function UsagesDetails(props) {
    const { details } = props;
    return (
        <>
            {details &&
                details.usages.length > 0 &&
                details.usages.map((item, _) => {
                    return (
                        <Typography>
                            {item.usage} {item.resource_type.unit}
                        </Typography>
                    );
                })}
        </>
    );
}

export default SubscriptionDrawer;
