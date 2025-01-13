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
    TableContainer,
    Paper,
} from "@mui/material";

export default function LoginsTable() {
    const theme = useTheme();
    var status = "loading";
    var error = null;
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
            <Table size="small"></Table>
        </TableContainer>
    );
}
