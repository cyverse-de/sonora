/**
 * @author sriram
 *
 * A table that display VICE access requests
 *
 *
 */
import React, { useMemo } from "react";
import { build } from "@cyverse-de/ui-lib";
import BasicTable from "components/utils/BasicTable";
import { IconButton, Paper, Typography } from "@material-ui/core";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

export default function TableView(props) {
    const { baseId, data } = props;
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
                    return (
                        <IconButton>
                            <ThumbUpIcon />
                        </IconButton>
                    );
                },
            },
            {
                Header: "Reject",
                id: "rejectButton",
                Cell: ({ row, value }) => {
                    return (
                        <IconButton>
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
            <Typography variant="h6" style={{ padding: 16 }}>
                Access Requests
            </Typography>
            <BasicTable columns={columns} data={data} />
        </Paper>
    );
}
