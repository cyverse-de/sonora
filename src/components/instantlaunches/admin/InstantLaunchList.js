import React from "react";

import { useMutation, useQuery } from "react-query";

import { Button } from "@material-ui/core";

import { listGlobalQuickLaunches } from "serviceFacades/quickLaunches";

import {
    listInstantLaunches,
    //upsertInstantLaunchMetadata,
    listInstantLaunchesByMetadata,
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

const addToDashboard = ({ id, dashboardILs }) => {};

const isInDashboard = (id, dashboardILs) => {
    const dILIDs = dashboardILs.map((dil) => dil.id);
    return dILIDs.includes(id);
};

const constructFullIL = (instantLaunch, allQLs) => {};

const InstantLaunchList = (props) => {
    const baseID = "instantlaunchlist";
    const { t } = useTranslation("instantlaunches");

    const allILs = useQuery("all_instant_launches", listInstantLaunches);
    const allQLs = useQuery("all_quick_launches", listGlobalQuickLaunches);
    const dashboardILs = useQuery(
        ["dashboard_instant_launches", "ui_location", "dashboard"],
        listInstantLaunchesByMetadata
    );

    const [addToDash] = useMutation(addToDashboard);

    const isLoading = allILs.isLoading;
    const isError = allILs.isError;

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
                    errorObject={allILs.error}
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allILs.data.map((il) => {
                                const fullIL = constructFullIL(il, allQLs.data);
                                return (
                                    <TableRow key={fullIL.id}>
                                        <TableCell>{fullIL.name}</TableCell>
                                        <TableCell>
                                            {fullIL.createdBy}
                                        </TableCell>
                                        {isInDashboard(
                                            fullIL.id,
                                            dashboardILs.data
                                        ) ? (
                                            <TableCell />
                                        ) : (
                                            <TableCell>
                                                <Button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                        addToDash({
                                                            id: fullIL.id,
                                                            dashboardILs:
                                                                dashboardILs.data,
                                                        });
                                                    }}
                                                >
                                                    {t("addToDashboard")}
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

export default InstantLaunchList;
