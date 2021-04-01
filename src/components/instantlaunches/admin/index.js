import React from "react";

import { useMutation, useQuery } from "react-query";

import { Button } from "@material-ui/core";

import {
    QUICK_LAUNCH_LIST_ALL,
    listAllQuickLaunches,
    listGlobalQuickLaunches,
    addGlobalQuickLaunch,
} from "serviceFacades/quickLaunches";

import {
    addInstantLaunch,
    listInstantLaunches,
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

const promoteQuickLaunch = async ({ quicklaunch, globalQLList }) => {
    const promises = [];

    if (!isGlobal(quicklaunch.id, globalQLList)) {
        promises.push(addGlobalQuickLaunch(quicklaunch));
    }

    promises.push(addInstantLaunch(quicklaunch.id));

    return await Promise.all(promises);
};

const isGlobal = (id, globalQLList) => {
    const ids = globalQLList.map((gl) => gl.quick_launch_id);
    return ids.includes(id);
};

const isInInstantLaunch = (qlID, instantlaunches) => {
    const ilIDs = instantlaunches.map((il) => il.quick_launch_id);
    return ilIDs.includes(qlID);
};

const QuickLaunchList = (props) => {
    const baseID = "quickLaunchList";
    const { t } = useTranslation("instantlaunches");

    const allQL = useQuery(QUICK_LAUNCH_LIST_ALL, listAllQuickLaunches);
    const globalQLs = useQuery("global_qls", listGlobalQuickLaunches);
    const allILs = useQuery("all_instant_launches", listInstantLaunches);
    const [promote] = useMutation(promoteQuickLaunch);

    const isLoading =
        allQL.isLoading || globalQLs.isLoading || allILs.isLoading;
    const isError = allQL.isError || globalQLs.isError || allILs.isError;

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
                    errorObject={allQL.error || globalQLs.error || allILs.error}
                    baseId={baseID}
                />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allQL.data.map((row) => {
                                const gl = globalQLs.data;
                                return (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.creator}</TableCell>
                                        {isInInstantLaunch(
                                            row.id,
                                            allILs.data.instant_launches
                                        ) ? (
                                            <TableCell />
                                        ) : (
                                            <TableCell>
                                                <Button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        promote({
                                                            quicklaunch: row,
                                                            globalQLList: gl,
                                                        });
                                                    }}
                                                >
                                                    {t("createInstantLaunch")}
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

export default QuickLaunchList;
