import React from "react";

import { useQueryClient, useMutation, useQuery } from "react-query";

import {
    listFullInstantLaunches,
    adminListInstantLaunchesByMetadata,
    ALL_INSTANT_LAUNCHES_KEY,
    DASHBOARD_INSTANT_LAUNCHES_KEY,
    addToDashboardHandler,
    removeFromDashboardHandler,
    deleteInstantLaunchHandler,
    addToNavDrawer,
    removeFromNavDrawer,
    LIST_INSTANT_LAUNCHES_BY_METADATA_KEY,
    addToInstantLaunchListing,
    removeFromInstantLaunchListing,
} from "serviceFacades/instantlaunches";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import { format as formatDate } from "date-fns";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";
import buildID from "components/utils/DebugIDUtil";

import ids from "components/instantlaunches/ids";

import BasicTable from "components/table/BasicTable";
import DEDialog from "components/utils/DEDialog";
import isQueryLoading from "components/utils/isQueryLoading";

import { useTranslation } from "i18n";

import { shortenUsername } from "../functions";

import RowDotMenu from "./RowDotMenu";
import SavedLaunchList from "./SavedLaunchList";
import constants from "constants.js";

import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import {
    Add as AddIcon,
    Close as CloseIcon,
    Home as HomeIcon,
    LabelImportant as NestedIcon,
    MenuOutlined,
} from "@material-ui/icons";

/**
 * Checks if the instant launch associated with 'id' is in
 * the list of instant launches included in the dashboard.
 *
 * @param {string} id - The UUID for the instant launch being checked.
 * @param {Object[]} dashboardILs - List of instant launches currently in the dashbaord.
 * @returns {boolean} - Whether the instant launch is included in the list of dashboard instant launches.
 */
const isInDashboard = (id, dashboardILs) => {
    const dILIDs = dashboardILs.map((dil) => dil.id);
    return dILIDs.includes(id);
};

/**
 * Checks if the instant launch associated with 'id' is in
 * the list of instant launches included in the navigation drawer.
 *
 * @param {string} id - The UUID for the instant launch being checked.
 * @param {Object[]} navDrawerILs - List of instant launches currently in the navigation drawer.
 * @returns {boolean} - Whether the instant launch is included in the list of navigation drawer instant launches.
 */
const isInNavDrawer = (id, navDrawerILs) => {
    return navDrawerILs.find((il) => il.id === id);
};

/**
 * Checks if the instant launch associated with 'id' is in the instant
 * launch listing.
 *
 * @param {string} id - The UUID for the instant launch being checked.
 * @param {Object[]} listingILs - List of instant launches currently in the instant launch listing.
 * @returns {boolean} - Whether the instant launch is included in the instant launch listing.
 */
const isInListing = (id, listingILs) => {
    return listingILs.find((il) => il.id === id);
};

const useStyles = makeStyles((theme) => ({
    addButton: {
        marginRight: theme.spacing(2),
        float: "right",
    },
    closeButton: {
        marginTop: theme.spacing(2),
    },
    creationDescription: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: "100%",
    },
    tableDescription: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    tableTitle: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
}));

const CreationDialog = ({ t, open, onClose }) => {
    const createID = buildID(ids.BASE, ids.CREATE, ids.DIALOG);
    const closeID = buildID(createID, ids.CLOSE, ids.BUTTON);

    const classes = useStyles();

    return (
        <DEDialog
            title={
                <>
                    {t("createInstantLaunch")}
                    <Typography
                        variant="body2"
                        className={classes.creationDescription}
                    >
                        {t("creationDescription")}
                    </Typography>
                </>
            }
            open={open}
            onClose={onClose}
            baseId={createID}
            actions={
                <Button
                    variant="contained"
                    startIcon={<CloseIcon />}
                    color="primary"
                    onClick={onClose}
                    id={closeID}
                    className={classes.closeButton}
                >
                    {t("common:close")}
                </Button>
            }
        >
            <SavedLaunchList />
        </DEDialog>
    );
};

/**
 * Presents a list of instant launches that can be updated,
 * deleted, or added to the dashboard.
 */
const InstantLaunchList = ({ showErrorAnnouncer }) => {
    const baseID = buildID(ids.BASE, ids.LIST);

    const { t } = useTranslation("instantlaunches");
    const classes = useStyles();

    const [dlgOpen, setDlgOpen] = React.useState(false);

    const instantLaunchLocationAttr =
        constants.METADATA.INSTANT_LAUNCH_LOCATION_ATTR;
    const instantLaunchDashboard = constants.METADATA.INSTANT_LAUNCH_DASHBOARD;
    const instantLaunchNavDrawer = constants.METADATA.INSTANT_LAUNCH_NAV_DRAWER;
    const instantLaunchListing = constants.METADATA.INSTANT_LAUNCH_LISTING;

    const allILs = useQuery(ALL_INSTANT_LAUNCHES_KEY, listFullInstantLaunches);
    const dashboardILs = useQuery(
        [
            DASHBOARD_INSTANT_LAUNCHES_KEY,
            instantLaunchLocationAttr,
            instantLaunchDashboard,
        ],
        () =>
            adminListInstantLaunchesByMetadata(
                instantLaunchLocationAttr,
                instantLaunchDashboard
            )
    );

    const navDrawerILs = useQuery(
        [
            LIST_INSTANT_LAUNCHES_BY_METADATA_KEY,
            instantLaunchLocationAttr,
            instantLaunchNavDrawer,
        ],
        () =>
            adminListInstantLaunchesByMetadata(
                instantLaunchLocationAttr,
                instantLaunchNavDrawer
            )
    );

    const listingILs = useQuery(
        [
            LIST_INSTANT_LAUNCHES_BY_METADATA_KEY,
            instantLaunchLocationAttr,
            instantLaunchListing,
        ],
        () =>
            adminListInstantLaunchesByMetadata(
                instantLaunchLocationAttr,
                instantLaunchListing
            )
    );

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const { mutate: addToDash, status: addToDashStatus } = useMutation(
        addToDashboardHandler,
        {
            onSuccess: () => {
                queryClient.invalidateQueries(DASHBOARD_INSTANT_LAUNCHES_KEY);
                announce({
                    text: t("addedToDashboard"),
                    variant: SUCCESS,
                });
            },
            onError: (error) => {
                showErrorAnnouncer(error.message, error);
            },
        }
    );

    const { mutate: removeFromDash, status: removeFromDashStatus } =
        useMutation(removeFromDashboardHandler, {
            onSuccess: () => {
                queryClient.invalidateQueries(DASHBOARD_INSTANT_LAUNCHES_KEY);
                announce({
                    text: t("removedFromDashboard"),
                    variant: SUCCESS,
                });
            },
            onError: (error) => {
                showErrorAnnouncer(t("removeDashboardILError"), error);
            },
        });

    const { mutate: addToNavDrawerMutation, status: addToNavStatus } =
        useMutation(addToNavDrawer, {
            onSuccess: () => {
                queryClient.invalidateQueries(
                    LIST_INSTANT_LAUNCHES_BY_METADATA_KEY
                );
                announce({
                    text: t("addedToNavDrawer"),
                    variant: SUCCESS,
                });
            },
            onError: (error) => {
                showErrorAnnouncer(error.message, error);
            },
        });

    const { mutate: removeFromDrawerMutation, status: removeFromNavStatus } =
        useMutation(removeFromNavDrawer, {
            onSuccess: () => {
                queryClient.invalidateQueries(
                    LIST_INSTANT_LAUNCHES_BY_METADATA_KEY
                );
                announce({
                    text: t("removedFromNavDrawer"),
                    variant: SUCCESS,
                });
            },
            onError: (error) => {
                showErrorAnnouncer(t("removeFromNavDrawerError"), error);
            },
        });

    const { mutate: addToListingMutation, status: addToListingStatus } =
        useMutation(addToInstantLaunchListing, {
            onSuccess: () => {
                queryClient.invalidateQueries(
                    LIST_INSTANT_LAUNCHES_BY_METADATA_KEY
                );
                announce({
                    text: t("addedToInstantLaunchListing"),
                    variant: SUCCESS,
                });
            },
            onError: (error) => {
                showErrorAnnouncer(error.message, error);
            },
        });

    const {
        mutate: removeFromListingMutation,
        status: removeFromListingStatus,
    } = useMutation(removeFromInstantLaunchListing, {
        onSuccess: () => {
            queryClient.invalidateQueries(
                LIST_INSTANT_LAUNCHES_BY_METADATA_KEY
            );
            announce({
                text: t("removedFromInstantLaunchListing"),
                variant: SUCCESS,
            });
        },
        onError: (error) => {
            showErrorAnnouncer(t("removeFromInstantLaunchListingError"), error);
        },
    });

    const { mutate: deleteIL, status: deleteILStatus } = useMutation(
        deleteInstantLaunchHandler,
        {
            onSuccess: () => {
                queryClient.invalidateQueries(DASHBOARD_INSTANT_LAUNCHES_KEY);
                queryClient.invalidateQueries(ALL_INSTANT_LAUNCHES_KEY);
                announce({
                    text: t("deletedInstantLaunch"),
                    variant: SUCCESS,
                });
            },

            onError: (error) => {
                showErrorAnnouncer(t("fetchDashboardILError"), error);
            },
        }
    );

    const columns = React.useMemo(() => {
        return [
            {
                Header: "",
                accessor: "quick_launch_id",
                Cell: ({ row }) => {
                    const il = row.original;

                    const inDashboard = isInDashboard(
                        il.id,
                        dashboardILs.data.instant_launches
                    );
                    const inNavDrawer = isInNavDrawer(
                        il.id,
                        navDrawerILs.data.instant_launches
                    );
                    const inListing = isInListing(
                        il.id,
                        listingILs.data.instant_launches
                    );

                    return (
                        <Grid container direction="row" wrap="nowrap">
                            {inListing && <NestedIcon fontSize="small" />}
                            {inNavDrawer && <MenuOutlined fontSize="small" />}
                            {inDashboard && <HomeIcon fontSize="small" />}
                        </Grid>
                    );
                },
            },
            {
                Header: t("common:name"),
                accessor: "quick_launch_name",
            },
            {
                Header: t("app"),
                accessor: "app_name",
            },
            {
                Header: t("appVersion"),
                accessor: "app_version",
            },
            {
                Header: t("createdBy"),
                accessor: "added_by",
                Cell: ({ row }) => {
                    const instantLaunch = row.original;
                    return shortenUsername(instantLaunch.added_by);
                },
            },
            {
                Header: t("addedOn"),
                accessor: "added_on",
                Cell: ({ row }) => {
                    const instantLaunch = row.original;
                    const addedOn = Date.parse(instantLaunch.added_on);

                    return formatDate(addedOn, "yyyy-MM-dd pppp");
                },
            },
            {
                Header: "",
                accessor: "id",
                Cell: ({ row }) => {
                    const il = row.original;

                    const rowID = buildID(baseID, ids.TABLE, ids.ROW, il.id);

                    const inDashboard = isInDashboard(
                        il.id,
                        dashboardILs.data.instant_launches
                    );
                    const inNavDrawer = isInNavDrawer(
                        il.id,
                        navDrawerILs.data.instant_launches
                    );
                    const inListing = isInListing(
                        il.id,
                        listingILs.data.instant_launches
                    );

                    return (
                        <RowDotMenu
                            baseId={rowID}
                            dashboardActionId={buildID(
                                rowID,
                                ids.DASH,
                                inDashboard ? ids.RM_DASH : ids.ADD_DASH,
                                ids.BUTTON
                            )}
                            dashboardAction={() =>
                                inDashboard
                                    ? removeFromDash(il.id)
                                    : addToDash(il, t)
                            }
                            dashboardLabel={t(
                                inDashboard
                                    ? "removeFromDashboard"
                                    : "addToDashboard"
                            )}
                            navDrawerActionId={buildID(
                                rowID,
                                ids.NAV_DRAWER,
                                inNavDrawer
                                    ? ids.RM_DRAWER
                                    : ids.ADD_NAV_DRAWER,
                                ids.BUTTON
                            )}
                            navDrawerAction={() =>
                                inNavDrawer
                                    ? removeFromDrawerMutation(il.id)
                                    : addToNavDrawerMutation(il, t)
                            }
                            navDrawerLabel={t(
                                inNavDrawer
                                    ? "removeFromNavDrawer"
                                    : "addToNavDrawer"
                            )}
                            listingActionId={buildID(
                                rowID,
                                ids.LISTING,
                                inListing ? ids.RM_LISTING : ids.ADD_LISTING,
                                ids.BUTTON
                            )}
                            listingAction={() =>
                                inListing
                                    ? removeFromListingMutation(il.id)
                                    : addToListingMutation(il, t)
                            }
                            listingLabel={t(
                                inListing
                                    ? "removeFromInstantLaunchListing"
                                    : "addToInstantLaunchListing"
                            )}
                            deleteActionId={buildID(rowID, ids.DELETE)}
                            deleteAction={() => deleteIL(il.id)}
                            deleteLabel={t("common:delete")}
                        />
                    );
                },
            },
        ];
    }, [
        addToDash,
        addToListingMutation,
        addToNavDrawerMutation,
        baseID,
        dashboardILs,
        deleteIL,
        listingILs,
        navDrawerILs,
        removeFromDash,
        removeFromDrawerMutation,
        removeFromListingMutation,
        t,
    ]);

    const isLoading = isQueryLoading([
        allILs.isLoading,
        dashboardILs.isLoading,
        navDrawerILs.isLoading,
        listingILs.isLoading,
        addToDashStatus,
        removeFromDashStatus,
        addToNavStatus,
        removeFromNavStatus,
        addToListingStatus,
        removeFromListingStatus,
        deleteILStatus,
    ]);
    const isError =
        allILs.isError ||
        dashboardILs.isError ||
        navDrawerILs.isError ||
        listingILs.isError;

    return (
        <div style={{ width: "100%" }}>
            {isError ? (
                <WrappedErrorHandler
                    errorObject={
                        allILs.error ||
                        dashboardILs.error ||
                        navDrawerILs.error ||
                        listingILs.error
                    }
                    baseId={baseID}
                />
            ) : (
                <>
                    <CreationDialog
                        t={t}
                        open={dlgOpen}
                        onClose={(event) => {
                            event.stopPropagation();
                            event.preventDefault();

                            setDlgOpen(false);
                        }}
                    />

                    <div className={classes.tableTitle}>
                        <Typography variant="h5" component="span">
                            {t("currentInstantLaunches")}
                        </Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            className={classes.addButton}
                            onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();

                                setDlgOpen(true);
                            }}
                            id={buildID(baseID, ids.ADD, ids.BUTTON)}
                        >
                            {t("common:new")}
                        </Button>
                    </div>

                    <Typography
                        variant="body2"
                        className={classes.tableDescription}
                    >
                        {t("listDescription")}
                    </Typography>

                    <BasicTable
                        columns={columns}
                        data={allILs?.data?.instant_launches || []}
                        loading={isLoading}
                        sortable={true}
                    />
                </>
            )}
        </div>
    );
};

export default withErrorAnnouncer(InstantLaunchList);
