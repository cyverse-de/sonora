/**
 *
 * @author mian
 *
 * A table of recent logins for the user.
 *
 */

import React from "react";

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
    var status = "loading";
    var error = null;
    var data = {
        logins: [{ ip_address: "0.0.0.0", login_time: 1736962713000 }],
    };
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
