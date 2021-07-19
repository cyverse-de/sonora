import React from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import { Button } from "@material-ui/core";

import {
    ALL_INSTANT_LAUNCHES_KEY,
    LIST_PUBLIC_QUICK_LAUNCHES_KEY,
    getPublicQuicklaunches,
    listFullInstantLaunches,
    addInstantLaunch,
} from "serviceFacades/instantlaunches";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";
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

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { SUCCESS } from "components/announcer/AnnouncerConstants";

import ids from "components/instantlaunches/ids";

import { shortenUsername, isInInstantLaunch } from "../functions";

const QuickLaunchList = ({ showErrorAnnouncer }) => {
    const baseID = buildID(ids.BASE, ids.QL, ids.LIST);
    const { t } = useTranslation(["instantlaunches", "common"]);

    const allQL = useQuery(
        LIST_PUBLIC_QUICK_LAUNCHES_KEY,
        getPublicQuicklaunches
    );

    const allILs = useQuery(ALL_INSTANT_LAUNCHES_KEY, listFullInstantLaunches);

    const [promote] = useMutation(addInstantLaunch, {
        onSuccess: () => {
            queryCache.invalidateQueries(ALL_INSTANT_LAUNCHES_KEY);
            announce({
                text: t("createdInstantLaunch"),
                variant: SUCCESS,
            });
        },
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
                                <TableCell>{t("quickLaunch")}</TableCell>
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
                                                        promote(row.id);
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
