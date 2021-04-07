import React from "react";

import { useMutation, useQuery } from "react-query";

import { Button } from "@material-ui/core";

import { listGlobalQuickLaunches } from "serviceFacades/quickLaunches";

import {
    listFullInstantLaunches,
    upsertInstantLaunchMetadata,
    listInstantLaunchesByMetadata,
    getInstantLaunchMetadata,
    resetInstantLaunchMetadata,
    deleteInstantLaunch,
} from "serviceFacades/instantlaunches";

import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";
import { Skeleton } from "@material-ui/lab";

import {
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
} from "@material-ui/core";
import { useTranslation } from "i18n";

/**
 * Adds the instant launch to the list of instant launches
 * in the dashboard if it isn't already there.
 *
 * @param {string} id
 */
const addToDashboardHandler = async (id) =>
    await upsertInstantLaunchMetadata(id, {
        attr: "ui_location",
        value: "dashboard",
        unit: "",
    });

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

/**
 * Removes a suffix from the username. Everything after the last '@' will be removed.
 *
 * @param {string} username - The username that will be shortened
 * @returns {string} - The shortened username
 */
const shortenUsername = (username) => {
    const atIndex = username.lastIndexOf("@");
    if (atIndex > -1) {
        return username.slice(0, atIndex);
    }
    return username;
};

/**
 * Presents a list of instant launches that can be updated,
 * deleted, or added to the dashboard.
 */
const InstantLaunchList = (props) => {
    const baseID = "instantlaunchlist";
    const { t } = useTranslation("instantlaunches");

    const allILs = useQuery("all_instant_launches", listFullInstantLaunches);
    const allQLs = useQuery("all_quick_launches", listGlobalQuickLaunches);
    const dashboardILs = useQuery(
        ["dashboard_instant_launches", "ui_location", "dashboard"],
        listInstantLaunchesByMetadata
    );

    const [addToDash] = useMutation(addToDashboardHandler);
    const [removeFromDash] = useMutation(removeFromDashboardHandler);
    const [deleteIL] = useMutation(deleteInstantLaunchHandler);

    const isLoading =
        allILs.isLoading || allQLs.isLoading || dashboardILs.isLoading;
    const isError = allILs.isError || allQLs.isError || dashboardILs.isError;

    return (
        <div>
            {isLoading ? (
                <Skeleton
                    variant="rect"
                    animation="wave"
                    height={300}
                    width="100%"
                />
            ) : isError ? (
                <WrappedErrorHandler
                    errorObject={
                        allILs.error || allQLs.error || dashboardILs.error
                    }
                    baseId={baseID}
                />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("name")}</TableCell>
                                <TableCell>{t("createdBy")}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allILs.data.instant_launches.map((il) => {
                                return (
                                    <TableRow key={il.id}>
                                        <TableCell>
                                            {il.quick_launch_name}
                                        </TableCell>
                                        <TableCell>
                                            {shortenUsername(il.added_by)}
                                        </TableCell>
                                        <TableCell>
                                            {isInDashboard(
                                                il.id,
                                                dashboardILs.data
                                                    .instant_launches
                                            ) ? (
                                                <Button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        removeFromDash(il.id);
                                                    }}
                                                >
                                                    {t("removeFromDashboard")}
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        addToDash(il.id);
                                                    }}
                                                >
                                                    {t("addToDashboard")}
                                                </Button>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    event.preventDefault();
                                                    deleteIL(il.id);
                                                }}
                                            >
                                                {t("deleteInstantLaunch")}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default InstantLaunchList;
