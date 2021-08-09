import React from "react";

import { useQueryClient, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import { Button } from "@material-ui/core";

import {
    ALL_INSTANT_LAUNCHES_KEY,
    LIST_PUBLIC_SAVED_LAUNCHES_KEY,
    getPublicSavedLaunches,
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

const SavedLaunchList = ({ showErrorAnnouncer }) => {
    const baseID = buildID(ids.BASE, ids.SAVED_LAUNCHES, ids.LIST);
    const { t } = useTranslation(["instantlaunches", "common"]);

    const allSavedLaunches = useQuery(
        LIST_PUBLIC_SAVED_LAUNCHES_KEY,
        getPublicSavedLaunches
    );

    // Get QueryClient from the context
    const queryClient = useQueryClient();
    const allILs = useQuery(ALL_INSTANT_LAUNCHES_KEY, listFullInstantLaunches);

    const { promote } = useMutation(addInstantLaunch, {
        onSuccess: () => {
            queryClient.invalidateQueries(ALL_INSTANT_LAUNCHES_KEY);
            announce({
                text: t("createdInstantLaunch"),
                variant: SUCCESS,
            });
        },
        onError: (error) =>
            showErrorAnnouncer(t("instantLaunchCreationError"), error),
    });

    const isLoading = allSavedLaunches.isLoading || allILs.isLoading;
    const isError = allSavedLaunches.isError || allILs.isError;

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
                    errorObject={allSavedLaunches.error || allILs.error}
                    baseId={baseID}
                />
            ) : (
                <TableContainer component={Paper}>
                    <Table id={buildID(baseID, ids.TABLE)}>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("savedLaunch")}</TableCell>
                                <TableCell>{t("createdBy")}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allSavedLaunches.data.map((row, index) => {
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

export default withErrorAnnouncer(SavedLaunchList);
