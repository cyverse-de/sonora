import React, { useState } from "react";
import { useTranslation } from "i18n";

import {
    Box,
    Divider,
    Drawer,
    Grid,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";

import { VerifiedUser } from "@material-ui/icons";
import EmptyTable from "components/table/EmptyTable";
import { formatDateObject } from "components/utils/DateFormatter";
import GridLabelValue from "components/utils/GridLabelValue";
import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";
import { DERow } from "components/table/DERow";
import { DETab, DETabPanel, DETabs } from "../../utils/DETabs";
import DETableHead from "components/table/DETableHead";
import dateConstants from "components/utils/dateConstants";
import constants from "../../../../src/constants";
import navigationConstants from "../../../common/NavigationConstants";
import { formatFileSize } from "components/data/utils";

const TABS = {
    subscriptionDetails: "details",
    addonsDetails: "addonsDetails",
};

const ADDONS_TABLE_COLUMNS = [
    { name: "Add-on", numeric: false, enableSorting: false },
    { name: "Amount", numeric: false, enableSorting: false },
    { name: "Resource Type", numeric: false, enableSorting: false },
    { name: "Paid", numeric: false, enableSorting: false },
];

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        [theme.breakpoints.up("lg")]: {
            maxWidth: "25%",
        },
        [theme.breakpoints.down("lg")]: {
            maxWidth: "50%",
            minWidth: "45%",
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: "90%",
        },
    },
    drawerHeader: {
        margin: theme.spacing(1),
        height: "2em",
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
        alignItems: "center",
    },
    drawerSubheader: {
        margin: theme.spacing(2),
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
    },
}));

function AddonsDetails(props) {
    const { addons, parentId, t } = props;

    return (
        <Table>
            <DETableHead
                selectable={false}
                rowCount={addons ? addons.length : 0}
                baseId={parentId}
                ids={ids.ADDONS.DETAILS_TABLE}
                columnData={ADDONS_TABLE_COLUMNS}
            />
            <TableBody>
                {addons && !addons.length && (
                    <EmptyTable
                        message={t("noAddons")}
                        numColumns={ADDONS_TABLE_COLUMNS.length}
                    />
                )}
                {addons &&
                    addons.length > 0 &&
                    addons.map((item, index) => {
                        let resourceInBytes =
                            item.addon.resource_type.unit.toLowerCase() ===
                            "bytes";
                        return (
                            <DERow key={index}>
                                <TableCell>
                                    <Typography>{item.addon.name}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {resourceInBytes
                                            ? formatFileSize(item.amount)
                                            : `${item.amount}`}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {item.addon.resource_type.unit}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {item.paid ? t("true") : t("false")}
                                    </Typography>
                                </TableCell>
                            </DERow>
                        );
                    })}
            </TableBody>
        </Table>
    );
}

function DetailsPanel(props) {
    const { baseId, selectedSubscription, t } = props;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    return (
        <Box p={isMobile ? 1 : 3}>
            <Grid
                container
                spacing={3}
                id={buildID(baseId, selectedSubscription.id, ids.DETAILS_PANEL)}
            >
                <GridLabelValue label={t("startDate")}>
                    {formatDateObject(
                        selectedSubscription?.effective_start_date &&
                            new Date(
                                selectedSubscription?.effective_start_date
                            ),
                        dateConstants.DATE_FORMAT
                    )}
                </GridLabelValue>
                <GridLabelValue label={t("endDate")}>
                    {formatDateObject(
                        selectedSubscription?.effective_end_date &&
                            new Date(selectedSubscription?.effective_end_date),
                        dateConstants.DATE_FORMAT
                    )}
                </GridLabelValue>
                <GridLabelValue label={t("planName")}>
                    {selectedSubscription?.plan.name}
                </GridLabelValue>
                <GridLabelValue label={t("paid")}>
                    {selectedSubscription?.paid ? t("true") : t("false")}
                </GridLabelValue>
                <GridLabelValue label={t("quotas")}>
                    <QuotasDetails
                        selectedSubscription={selectedSubscription}
                    />
                </GridLabelValue>
                <GridLabelValue label={t("usages")}>
                    <UsagesDetails
                        selectedSubscription={selectedSubscription}
                        t={t}
                    />
                </GridLabelValue>
            </Grid>
        </Box>
    );
}

function QuotasDetails(props) {
    const { selectedSubscription } = props;
    return (
        <>
            {selectedSubscription &&
                selectedSubscription.quotas.length > 0 &&
                selectedSubscription.quotas.map((item, index) => {
                    // Only format data storage resources to human readable format
                    let resourceInBytes =
                        item.resource_type.unit.toLowerCase() === "bytes";
                    return (
                        <Typography key={index}>
                            {resourceInBytes
                                ? formatFileSize(item.quota)
                                : `${item.quota} ${item.resource_type.unit}`}
                        </Typography>
                    );
                })}
        </>
    );
}

function SubscriptionDrawer(props) {
    const {
        anchor,
        baseId,
        data,
        onClose,
        open,
        parentId,
        selectedSubscription,
        selectedSubscriptionAddons,
        selectedUserPortalId,
    } = props;
    const classes = useStyles();
    const drawerId = buildID(baseId, ids.DETAILS_DRAWER);
    const subscriptionDetailsTabId = buildID(
        drawerId,
        ids.SUBSCRIPTION_DETAILS_TAB
    );
    const addonsDetailsTabId = buildID(drawerId, ids.ADDONS.DETAILS_TAB);
    const { t } = useTranslation("subscriptions");
    const [selectedTab, setSelectedTab] = useState(TABS.subscriptionDetails);
    const username = selectedSubscription?.user.username;
    const onTabSelectionChange = (_event, selectedTab) => {
        setSelectedTab(selectedTab);
    };
    return (
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
            <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                <DETab
                    value={TABS.subscriptionDetails}
                    label={t("subscriptionDetailsTabLabel")}
                    id={subscriptionDetailsTabId}
                />
                <DETab
                    value={TABS.addonsDetails}
                    label={t("addons")}
                    id={addonsDetailsTabId}
                />
            </DETabs>
            <DETabPanel
                tabId={subscriptionDetailsTabId}
                value={TABS.subscriptionDetails}
                selectedTab={selectedTab}
            >
                <SubscriptionHeader
                    baseId={baseId}
                    username={username}
                    portalId={selectedUserPortalId}
                />
                <Divider />
                <SubscriptionSubheader />
                <DetailsPanel
                    baseId={baseId}
                    data={data}
                    selectedSubscription={selectedSubscription}
                    selectedSubscriptionAddons={selectedSubscriptionAddons}
                    t={t}
                />
            </DETabPanel>
            <DETabPanel
                tabId={subscriptionDetailsTabId}
                value={TABS.addonsDetails}
                selectedTab={selectedTab}
            >
                <SubscriptionHeader
                    baseId={baseId}
                    username={username}
                    portalId={selectedUserPortalId}
                />
                <Divider />
                <AddonsDetails
                    addons={selectedSubscriptionAddons}
                    parentId={parentId}
                    t={t}
                />
            </DETabPanel>
        </Drawer>
    );
}

function SubscriptionHeader(props) {
    const { portalId, username } = props;
    const classes = useStyles();
    const baseURL = constants.DEFAULT_USER_PORTAL_URL;
    const subURL = navigationConstants.ADMIN_USER_PORTAL_USERS;
    const linkToUserPortal = `${baseURL}${subURL}/${portalId}`;
    return (
        <div className={classes.drawerHeader}>
            {portalId && (
                <Tooltip title={linkToUserPortal}>
                    <IconButton
                        href={linkToUserPortal}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <VerifiedUser fontSize="small" color="primary" />
                    </IconButton>
                </Tooltip>
            )}

            <Typography variant="h6" component="span">
                {username}
            </Typography>
        </div>
    );
}

function SubscriptionSubheader() {
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
    const { selectedSubscription, t } = props;

    return (
        <>
            {selectedSubscription &&
                selectedSubscription.usages.length > 0 &&
                selectedSubscription.usages.map((item, index) => {
                    // Only format data usage to human readable format
                    let resourceInBytes =
                        item.resource_type.unit.toLowerCase() === "bytes";
                    return (
                        <Typography key={index}>
                            {resourceInBytes
                                ? formatFileSize(item.usage)
                                : `${item.usage} ${item.resource_type.unit}`}
                        </Typography>
                    );
                })}

            {selectedSubscription && !selectedSubscription.usages.length && (
                <Typography>{t("noUsages")}</Typography>
            )}
        </>
    );
}

export default SubscriptionDrawer;
