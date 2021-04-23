import React from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import {
    listFullInstantLaunches,
    upsertInstantLaunchMetadata,
    listInstantLaunchesByMetadata,
    getInstantLaunchMetadata,
    resetInstantLaunchMetadata,
    deleteInstantLaunch,
    ALL_INSTANT_LAUNCHES_KEY,
    DASHBOARD_INSTANT_LAUNCHES_KEY,
} from "serviceFacades/instantlaunches";

import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { Skeleton } from "@material-ui/lab";

import { format as formatDate } from "date-fns";

import { build as buildID } from "@cyverse-de/ui-lib";
import ids from "components/instantlaunches/ids";

import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
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

import {
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";

import { useTranslation } from "i18n";
import { validateForDashboard } from "components/instantlaunches";

import { shortenUsername } from "../functions";

import QuickLaunchList from "./QuickLaunchList";

/**
 * Adds the instant launch to the list of instant launches
 * in the dashboard if it isn't already there.
 *
 * @param {string} id
 */
const addToDashboardHandler = async (il, t) =>
    await validateForDashboard(il)
        .then((isValid) => {
            if (!isValid) {
                console.log("not valid");
                throw new Error(t("cannotAddILToDashboard"));
            }
        })
        .then(() =>
            upsertInstantLaunchMetadata(il.id, {
                attr: "ui_location",
                value: "dashboard",
                unit: "",
            })
        );

/**
 * Removes an instant launch from the dashboard.
 *
 * @param {string} id
 */
const removeFromDashboardHandler = async (id) => {
    const ilMeta = await getInstantLaunchMetadata(id);

    if (!ilMeta.avus) {
        throw new Error("no avus in response");
    }

    const dashCount = ilMeta.avus.filter(
        ({ attr, value }) => attr === "ui_location" && value === "dashboard"
    ).length;

    if (dashCount > 0) {
        const filtered = ilMeta.avus.filter(
            ({ attr, value }) => attr !== "ui_location" && value !== "dashboard"
        );
        return await resetInstantLaunchMetadata(id, filtered);
    }

    return new Promise((resolve, reject) => resolve(ilMeta));
};

/**
 * Deletes an instant launch.
 * @param {*} id - The UUID of the instant launch to be deleted.
 */
const deleteInstantLaunchHandler = async (id) => {
    return await removeFromDashboardHandler(id).then((_) =>
        deleteInstantLaunch(id)
    );
};

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

const useStyles = makeStyles((theme) => ({
    addButton: {
        marginRight: theme.spacing(2),
        float: "right",
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
    const titleID = buildID(createID, ids.TITLE);
    const closeID = buildID(createID, ids.CLOSE, ids.BUTTON);

    return (
        <Dialog open={open} onClose={onClose} id={createID}>
            <DialogTitle id={titleID}>{t("createInstantLaunch")}</DialogTitle>

            <DialogContent>
                <QuickLaunchList />
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    startIcon={<CloseIcon />}
                    color="primary"
                    onClick={onClose}
                    id={closeID}
                >
                    {t("common:close")}
                </Button>
            </DialogActions>
        </Dialog>
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

    const allILs = useQuery(ALL_INSTANT_LAUNCHES_KEY, listFullInstantLaunches);
    const dashboardILs = useQuery(
        [DASHBOARD_INSTANT_LAUNCHES_KEY, "ui_location", "dashboard"],
        listInstantLaunchesByMetadata
    );

    const [addToDash] = useMutation(addToDashboardHandler, {
        onSuccess: () => {
            queryCache.invalidateQueries(DASHBOARD_INSTANT_LAUNCHES_KEY);
        },
        onError: (error) => {
            showErrorAnnouncer(error.message, error);
        },
    });

    const [removeFromDash] = useMutation(removeFromDashboardHandler, {
        onSuccess: () => {
            queryCache.invalidateQueries(DASHBOARD_INSTANT_LAUNCHES_KEY);
        },
        onError: (error) => {
            showErrorAnnouncer(t("removeDashboardILError"), error);
        },
    });

    const [deleteIL] = useMutation(deleteInstantLaunchHandler, {
        onSuccess: () => {
            queryCache.invalidateQueries(DASHBOARD_INSTANT_LAUNCHES_KEY);
            queryCache.invalidateQueries(ALL_INSTANT_LAUNCHES_KEY);
        },

        onError: (error) => {
            showErrorAnnouncer(t("fetchDashboardILError"), error);
        },
    });

    const isLoading = allILs.isLoading || dashboardILs.isLoading;
    const isError = allILs.isError || dashboardILs.isError;

    return (
        <div width="100%">
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
                    errorObject={allILs.error || dashboardILs.error}
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
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
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
                                                        ids.ADDED_BY
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
