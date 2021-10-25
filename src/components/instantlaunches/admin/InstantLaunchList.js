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

import { Skeleton } from "@material-ui/lab";

import { format as formatDate } from "date-fns";

import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";
import buildID from "components/utils/DebugIDUtil";

import ids from "components/instantlaunches/ids";

import {
    Button,
    makeStyles,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Typography,
    Paper,
    IconButton,
} from "@material-ui/core";

import DEDialog from "components/utils/DEDialog";
import isQueryLoading from "components/utils/isQueryLoading";

import {
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";

import { useTranslation } from "i18n";

import { shortenUsername } from "../functions";

import SavedLaunchList from "./SavedLaunchList";
import constants from "constants.js";

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
    const skeletonID = buildID(baseID, ids.SKELETON);

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
            {isLoading ? (
                <Skeleton
                    variant="rect"
                    animation="wave"
                    height={300}
                    width="100%"
                    id={skeletonID}
                />
            ) : isError ? (
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

                    <TableContainer className={classes.table} component={Paper}>
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

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("common:name")}</TableCell>
                                    <TableCell>{t("createdBy")}</TableCell>
                                    <TableCell>{t("addedOn")}</TableCell>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allILs.data.instant_launches.map(
                                    (il, index) => {
                                        const addedOn = Date.parse(il.added_on);
                                        const rowID = buildID(
                                            baseID,
                                            ids.TABLE,
                                            ids.ROW,
                                            index
                                        );
                                        return (
                                            <TableRow key={il.id} id={rowID}>
                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.NAME
                                                    )}
                                                >
                                                    {il.quick_launch_name}
                                                </TableCell>

                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.ADDED_BY
                                                    )}
                                                >
                                                    {shortenUsername(
                                                        il.added_by
                                                    )}
                                                </TableCell>

                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.ADDED_ON
                                                    )}
                                                >
                                                    {formatDate(
                                                        addedOn,
                                                        "yyyy-MM-dd pppp"
                                                    )}
                                                </TableCell>

                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.DASH
                                                    )}
                                                >
                                                    {isInDashboard(
                                                        il.id,
                                                        dashboardILs.data
                                                            .instant_launches
                                                    ) ? (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();
                                                                event.preventDefault();
                                                                removeFromDash(
                                                                    il.id
                                                                );
                                                            }}
                                                            id={buildID(
                                                                rowID,
                                                                ids.DASH,
                                                                ids.RM_DASH,
                                                                ids.BUTTON
                                                            )}
                                                        >
                                                            {t(
                                                                "removeFromDashboard"
                                                            )}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();
                                                                event.preventDefault();
                                                                addToDash(
                                                                    il,
                                                                    t
                                                                );
                                                            }}
                                                            id={buildID(
                                                                rowID,
                                                                ids.DASH,
                                                                ids.ADD_DASH,
                                                                ids.BUTTON
                                                            )}
                                                        >
                                                            {t(
                                                                "addToDashboard"
                                                            )}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.NAV_DRAWER
                                                    )}
                                                >
                                                    {isInNavDrawer(
                                                        il.id,
                                                        navDrawerILs.data
                                                            .instant_launches
                                                    ) ? (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                removeFromDrawerMutation(
                                                                    il.id
                                                                );
                                                            }}
                                                            id={buildID(
                                                                rowID,
                                                                ids.NAV_DRAWER,
                                                                ids.RM_DRAWER,
                                                                ids.BUTTON
                                                            )}
                                                        >
                                                            {t(
                                                                "removeFromNavDrawer"
                                                            )}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                addToNavDrawerMutation(
                                                                    il,
                                                                    t
                                                                );
                                                            }}
                                                            id={buildID(
                                                                rowID,
                                                                ids.NAV_DRAWER,
                                                                ids.ADD_NAV_DRAWER,
                                                                ids.BUTTON
                                                            )}
                                                        >
                                                            {t(
                                                                "addToNavDrawer"
                                                            )}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.LISTING
                                                    )}
                                                >
                                                    {isInListing(
                                                        il.id,
                                                        listingILs.data
                                                            .instant_launches
                                                    ) ? (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                removeFromListingMutation(
                                                                    il.id
                                                                );
                                                            }}
                                                            id={buildID(
                                                                rowID,
                                                                ids.LISTING,
                                                                ids.RM_LISTING,
                                                                ids.BUTTON
                                                            )}
                                                        >
                                                            {t(
                                                                "removeFromInstantLaunchListing"
                                                            )}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                addToListingMutation(
                                                                    il,
                                                                    t
                                                                );
                                                            }}
                                                            id={buildID(
                                                                rowID,
                                                                ids.LISTING,
                                                                ids.ADD_LISTING,
                                                                ids.BUTTON
                                                            )}
                                                        >
                                                            {t(
                                                                "addToInstantLaunchListing"
                                                            )}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.DELETE
                                                    )}
                                                >
                                                    <IconButton
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            event.preventDefault();
                                                            deleteIL(il.id);
                                                        }}
                                                        id={buildID(
                                                            rowID,
                                                            ids.DELETE,
                                                            ids.BUTTON
                                                        )}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </div>
    );
};

export default withErrorAnnouncer(InstantLaunchList);
