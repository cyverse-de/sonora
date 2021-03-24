/**
 * @author sriram
 *
 * A table that display VICE access requests
 *
 *
 */
import React, { useMemo } from "react";
import { useTranslation } from "i18n";
import { formatDateObject } from "@cyverse-de/ui-lib";

import ids from "./ids";

import {
    ACCESS_REQUEST_REJECTED,
    ACCESS_REQUEST_APPROVED,
    ACCESS_REQUEST_COMPLETED,
} from "serviceFacades/vice/accessRequest";
import BasicTable from "components/utils/BasicTable";

import { IconButton, Typography } from "@material-ui/core";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

export default function TableView(props) {
    const { baseId, loading, data, onUpdateRequest, emptyDataMessage } = props;
    const { t } = useTranslation("vice-admin");
    const columns = useMemo(
        () => [
            {
                Header: t("user"),
                accessor: "requesting_user",
                Cell: ({ row, value }) => {
                    const original = row.original;
                    return (
                        <>
                            <Typography>
                                {t("user")}: {value}
                            </Typography>
                            <Typography>
                                {t("name")}: {original.details.name}
                            </Typography>
                            <Typography>
                                {t("email")}: {original.details.email}
                            </Typography>
                        </>
                    );
                },
            },
            {
                Header: t("requestedDate"),
                accessor: "created_date",
                Cell: ({ row, value }) => {
                    return (
                        <Typography>
                            {formatDateObject(new Date(value))}
                        </Typography>
                    );
                },
            },
            {
                Header: t("useCase"),
                accessor: "details.intended_use",
                Cell: ({ row, value }) => {
                    return <Typography>{value}</Typography>;
                },
            },
            {
                Header: t("approve"),
                id: ids.APPROVE_BTN,
                Cell: ({ row, value }) => {
                    const original = row.original;
                    return (
                        <IconButton
                            color={
                                original?.status?.toLowerCase() ===
                                    ACCESS_REQUEST_COMPLETED ||
                                original?.status?.toLowerCase() ===
                                    ACCESS_REQUEST_APPROVED
                                    ? "primary"
                                    : "default"
                            }
                            onClick={() =>
                                onUpdateRequest(
                                    original,
                                    ACCESS_REQUEST_APPROVED
                                )
                            }
                        >
                            <ThumbUpIcon />
                        </IconButton>
                    );
                },
            },
            {
                Header: t("reject"),
                id: ids.REJECT_BTN,
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
                                    original,
                                    ACCESS_REQUEST_REJECTED
                                )
                            }
                        >
                            <ThumbDownIcon />
                        </IconButton>
                    );
                },
            },
            {
                Header: t("lastUpdated"),
                accessor: "updated_date",
                Cell: ({ row, value }) => {
                    return (
                        <Typography>
                            {formatDateObject(new Date(value))}
                        </Typography>
                    );
                },
            },
        ],
        [onUpdateRequest, t]
    );
    return (
        <BasicTable
            baseId={baseId}
            loading={loading}
            columns={columns}
            data={data}
            emptyDataMessage={emptyDataMessage}
        />
    );
}
