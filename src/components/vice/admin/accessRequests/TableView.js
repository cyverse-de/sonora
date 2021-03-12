/**
 * @author sriram
 *
 * A table that display VICE access requests
 *
 *
 */
import React, { useMemo } from "react";
import { useTranslation } from "i18n";
import { build } from "@cyverse-de/ui-lib";
import {
    ACCESS_REQUEST_REJECTED,
    ACCESS_REQUEST_APPROVED,
    ACCESS_REQUEST_COMPLETED,
} from "serviceFacades/vice/accessRequest";
import BasicTable from "components/utils/BasicTable";
import { IconButton, Paper, Typography } from "@material-ui/core";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export default function TableView(props) {
    const {
        baseId,
        data,
        onUpdateRequest,
        showAllRequest,
        onRequestFilterChange,
    } = props;
    const { t } = useTranslation("vice-admin");
    const columns = useMemo(
        () => [
            {
                Header: "User",
                accessor: "requesting_user",
                Cell: ({ row, value }) => {
                    return <Typography>{value}</Typography>;
                },
            },
            {
                Header: "Name",
                accessor: "details.name",
                Cell: ({ row, value }) => {
                    return <Typography>{value}</Typography>;
                },
            },
            {
                Header: "Email",
                accessor: "details.email",
                Cell: ({ row, value }) => {
                    return <Typography>{value}</Typography>;
                },
            },
            {
                Header: "Use Case",
                accessor: "details.intended_use",
                Cell: ({ row, value }) => {
                    return <Typography>{value}</Typography>;
                },
            },
            {
                Header: "Approve",
                id: "approveButton",
                Cell: ({ row, value }) => {
                    const original = row.original;
                    return (
                        <IconButton
                            color={
                                original?.status?.toLowerCase() ===
                                ACCESS_REQUEST_COMPLETED
                                    ? "primary"
                                    : "default"
                            }
                            onClick={() =>
                                onUpdateRequest(
                                    original.id,
                                    ACCESS_REQUEST_APPROVED,
                                    t("accessRequestApprovedMsg")
                                )
                            }
                        >
                            <ThumbUpIcon />
                        </IconButton>
                    );
                },
            },
            {
                Header: "Reject",
                id: "rejectButton",
                Cell: ({ row, value }) => {
                    const original = row.original;
                    return (
                        <IconButton
                            color={
                                original?.status?.toLowerCase() ===
                                ACCESS_REQUEST_REJECTED
                                    ? "primary"
                                    : "default"
                            }
                            onClick={() =>
                                onUpdateRequest(
                                    original.id,
                                    ACCESS_REQUEST_REJECTED,
                                    t("accessRequestDeniedMsg")
                                )
                            }
                        >
                            <ThumbDownIcon />
                        </IconButton>
                    );
                },
            },
        ],
        []
    );
    return (
        <Paper style={{ marginTop: 16, marginBottom: 16 }}>
            <div style={{ padding: 16 }}>
                <Typography variant="h6" component="span">
                    Access Requests
                </Typography>
                <FormControlLabel
                    style={{ float: "right" }}
                    control={
                        <Switch
                            checked={showAllRequest}
                            onChange={onRequestFilterChange}
                            name="requestFilter"
                            color="primary"
                        />
                    }
                    label="Show All Requests"
                />
            </div>
            <BasicTable columns={columns} data={data} />
        </Paper>
    );
}
