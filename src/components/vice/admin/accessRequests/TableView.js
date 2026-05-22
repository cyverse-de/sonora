/**
 * @author sriram
 *
 * A table that display VICE access requests
 *
 *
 */
import React, { useMemo } from "react";
import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import { formatDateObject } from "components/utils/DateFormatter";

import ids from "./ids";

import {
    ACCESS_REQUEST_REJECTED,
    ACCESS_REQUEST_APPROVED,
    ACCESS_REQUEST_COMPLETED,
} from "serviceFacades/vice/accessRequest";
import BasicTable from "components/table/BasicTable";
import ExternalLink from "components/utils/ExternalLink";
import { useConfig } from "contexts/config";

import { IconButton, Typography } from "@mui/material";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function TableView(props) {
    const { baseId, loading, data, onUpdateRequest, emptyDataMessage } = props;
    const { t } = useTranslation("vice-admin");
    const [config] = useConfig();
    const columns = useMemo(
        () => [
            {
                header: t("user"),
                accessorKey: "requesting_user",
                cell: ({ row, getValue }) => {
                    const original = row.original;
                    const value = getValue();
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
                            <Typography>
                                <ExternalLink
                                    href={`${config?.intercom?.userProfileUrl}${value}`}
                                >
                                    {t("intercomProfile")}
                                </ExternalLink>
                            </Typography>
                        </>
                    );
                },
            },
            {
                header: t("approve"),
                id: ids.APPROVE_BTN,
                cell: ({ row }) => {
                    const original = row.original;
                    return (
                        <IconButton
                            id={buildID(baseId, ids.APPROVE_BTN)}
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
                            size="large"
                        >
                            <ThumbUpIcon />
                        </IconButton>
                    );
                },
            },
            {
                header: t("reject"),
                id: ids.REJECT_BTN,
                cell: ({ row }) => {
                    const original = row.original;
                    return (
                        <IconButton
                            id={buildID(baseId, ids.REJECT_BTN)}
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
                            size="large"
                        >
                            <ThumbDownIcon />
                        </IconButton>
                    );
                },
            },
            {
                header: t("requestedDate"),
                accessorKey: "created_date",
                cell: ({ getValue }) => {
                    return (
                        <Typography>
                            {formatDateObject(new Date(getValue()))}
                        </Typography>
                    );
                },
            },
            {
                header: t("useCase"),
                accessorKey: "details.intended_use",
                cell: ({ getValue }) => {
                    return <Typography>{getValue()}</Typography>;
                },
            },
            {
                header: t("lastUpdated"),
                accessorKey: "updated_date",
                cell: ({ getValue }) => {
                    return (
                        <Typography>
                            {formatDateObject(new Date(getValue()))}
                        </Typography>
                    );
                },
            },
        ],
        [baseId, config, onUpdateRequest, t]
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
