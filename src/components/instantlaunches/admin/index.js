import React from "react";

import { useQuery } from "react-query";

import { Button } from "@material-ui/core";

import {
    QUICK_LAUNCH_LIST_ALL,
    listAllQuickLaunches,
} from "serviceFacades/quickLaunches";

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

const QuickLaunchList = (props) => {
    const baseID = "quickLaunchList";
    const { isError, isLoading, data: rows, error } = useQuery(
        QUICK_LAUNCH_LIST_ALL,
        listAllQuickLaunches
    );

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
                <WrappedErrorHandler errorObject={error} baseId={baseID} />
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
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.creator}</TableCell>
                                    <TableCell>
                                        <Button>Test</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default QuickLaunchList;
