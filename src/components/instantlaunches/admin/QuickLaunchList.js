import React from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import { Button } from "@material-ui/core";

import {
    addInstantLaunch,
    ALL_INSTANT_LAUNCHES_KEY,
    LIST_PUBLIC_QUICK_LAUNCHES_KEY,
    getPublicQuicklaunches,
    listFullInstantLaunches,
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

import { Add as AddIcon } from "@material-ui/icons";

import { useTranslation } from "i18n";
import { build as buildID } from "@cyverse-de/ui-lib";
import ids from "components/instantlaunches/ids";

import { shortenUsername } from "../functions";

const promoteQuickLaunch = async (quicklaunch) =>
    await addInstantLaunch(quicklaunch.id);

const isInInstantLaunch = (qlID, instantlaunches) => {
    const ilIDs = instantlaunches.map((il) => il.quick_launch_id);
    return ilIDs.includes(qlID);
};

const QuickLaunchList = ({ showErrorAnnouncer }) => {
    const baseID = buildID(ids.BASE, ids.QL, ids.LIST);
    const { t } = useTranslation(["instantlaunches", "common"]);

    const allQL = useQuery(
        LIST_PUBLIC_QUICK_LAUNCHES_KEY,
        getPublicQuicklaunches
    );

    const allILs = useQuery(ALL_INSTANT_LAUNCHES_KEY, listFullInstantLaunches);

    const [promote] = useMutation(promoteQuickLaunch, {
        onSuccess: () => queryCache.invalidateQueries(ALL_INSTANT_LAUNCHES_KEY),
        onError: (error) =>
            showErrorAnnouncer(t("instantLaunchCreationError"), error),
    });

    const isLoading = allQL.isLoading || allILs.isLoading;
    const isError = allQL.isError || allILs.isError;

    return (
        <div>
            {isLoading ? (
                <Skeleton
                    variant="rect"
                    animation="wave"
                    height={300}
                    width="100%"
                    ids={buildID(baseID, ids.SKELETON)}
                />
            ) : isError ? (
                <WrappedErrorHandler
                    errorObject={allQL.error || allILs.error}
                    baseId={baseID}
                />
            ) : (
                <TableContainer component={Paper}>
                    <Table id={buildID(baseID, ids.TABLE)}>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("common:name")}</TableCell>
                                <TableCell>{t("createdBy")}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allQL.data.map((row, index) => {
                                const rowID = buildID(
                                    baseID,
                                    ids.TABLE,
                                    ids.ROW,
                                    index
                                );
                                return (
                                    <TableRow key={row.id} id={rowID}>
                                        <TableCell
                                            id={buildID(rowID, ids.NAME)}
                                        >
                                            {row.name}
                                        </TableCell>

                                        <TableCell
                                            id={buildID(rowID, ids.CREATOR)}
                                        >
                                            {shortenUsername(row.creator)}
                                        </TableCell>

                                        {isInInstantLaunch(
                                            row.id,
                                            allILs.data.instant_launches
                                        ) ? (
                                            <TableCell
                                                id={buildID(rowID, ids.ADD)}
                                            />
                                        ) : (
                                            <TableCell
                                                id={buildID(rowID, ids.ADD)}
                                            >
                                                <Button
                                                    id={buildID(
                                                        rowID,
                                                        ids.ADD,
                                                        ids.BUTTON
                                                    )}
                                                    variant="contained"
                                                    startIcon={<AddIcon />}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        promote(row);
                                                    }}
                                                >
                                                    {t("common:create")}
                                                </Button>
                                            </TableCell>
                                        )}
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

export default withErrorAnnouncer(QuickLaunchList);
