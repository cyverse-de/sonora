/**
 *
 * @author mian
 *
 * A table of recent logins for the user.
 *
 */

import React from "react";
import { useQuery } from "react-query";

import { logins, LOGINS_QUERY_KEY } from "serviceFacades/users";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import {
    useTheme,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

export default function LoginsTable() {
    const theme = useTheme();
    const { status, data, error } = useQuery({
        queryKey: [LOGINS_QUERY_KEY],
        queryFn: () => logins({ limit: 5 }),
    });

    if (status === "error") {
        return (
            <div style={{ padding: theme.spacing(1) }}>
                <ErrorTypographyWithDialog
                    errorObject={error}
                    errorMessage={""}
                />
            </div>
        );
    }
    if (status === "loading") {
        return <Skeleton variant="rectangular" height={200} />;
    }
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="right">Login Time</TableCell>
                        <TableCell align="right">IP Address</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data["logins"].map((row) => (
                        <TableRow>
                            <TableCell>{row["login_time"]}</TableCell>
                            <TableCell>{row["ip_address"]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
