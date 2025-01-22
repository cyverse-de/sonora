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
import { useTranslation } from "i18n";
import {
    formatDate,
    getFormattedDistance,
} from "components/utils/DateFormatter";
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
    const { t } = useTranslation(["dashboard", "common"]);

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
                    errorMessage={t("loginsTableError")}
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
                        <TableCell>{t("loginTime")}</TableCell>
                        <TableCell></TableCell>
                        <TableCell>{t("ipAddress")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.logins.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {t("common:timestamp", {
                                    timestamp: getFormattedDistance(
                                        row["login_time"] / 1000
                                    ),
                                })}
                            </TableCell>
                            <TableCell>
                                ({formatDate(row["login_time"])})
                            </TableCell>
                            <TableCell>{row["ip_address"]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
