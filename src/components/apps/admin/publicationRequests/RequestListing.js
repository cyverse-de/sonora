import React, { useState } from "react";
import { useTranslation } from "i18n";
import { useQuery, useMutation, useQueryClient } from "react-query";

import buildID from "components/utils/DebugIDUtil";
import EmptyTable from "components/table/EmptyTable";

import DETableHead from "components/table/DETableHead";
import TableLoading from "components/table/TableLoading";
import {
    getAppPublicationRequests,
    adminPublishApp,
    APP_PUBLICATION_REQUESTS_QUERY_KEY,
} from "serviceFacades/apps";
import DEDialog from "components/utils/DEDialog";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";

import ids from "../../ids";
import constants from "../../../../constants";

import {
    Button,
    IconButton,
    Paper,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
} from "@material-ui/core";
import PublicIcon from "@material-ui/icons/Public";

/**
 *
 * @author sriram
 *
 * A component that displays a list of app publication requests.
 *
 */

const appColumnData = (t) => [
    { name: t("name"), enableSorting: false, key: "name" },
    {
        name: t("intName"),
        enableSorting: false,
        key: "integrator_name",
    },
    {
        name: t("intEmail"),
        enableSorting: false,
        key: "integrator_email",
    },
    {
        name: t("toolsUsed"),
        enableSorting: false,
        key: "tools",
    },
    {
        name: "",
        enableSorting: false,
        key: "publish",
    },
];

const toolColumnData = (t) => [
    { name: t("name"), align: "left", enableSorting: false, id: "name" },
    {
        name: t("imageName"),
        align: "left",
        enableSorting: false,
        id: "image_name",
    },
    { name: t("tag"), align: "left", enableSorting: false, id: "tag" },
];
function ToolsUsed(props) {
    const { tools, appName } = props;
    const [toolsDialogOpen, setToolsDialogOpen] = useState(false);
    const { t } = useTranslation("tools");
    // Get QueryClient from the context
    const queryClient = useQueryClient();
    return (
        <React.Fragment>
            <Button color="primary" onClick={() => setToolsDialogOpen(true)}>
                {t("viewTools")}
            </Button>
            <DEDialog
                id={buildID(ids.PUBLICATION_REQUESTS.TOOLS_USED_DIALOG)}
                open={toolsDialogOpen}
                title={t("toolsUsed", {
                    appName: appName,
                })}
                onClose={() => setToolsDialogOpen(false)}
            >
                <TableContainer component={Paper} style={{ overflow: "auto" }}>
                    <Table
                        stickyHeader={true}
                        size="small"
                        aria-label={t("toolsUsed", {
                            appName: appName,
                        })}
                        id={buildID(
                            ids.PUBLICATION_REQUESTS.TOOLS_USED_DIALOG,
                            ids.PUBLICATION_REQUESTS.TOOLS_USED_LISTING
                        )}
                    >
                        <TableBody>
                            {tools.map((tool) => {
                                return (
                                    <TableRow hover key={tool.id}>
                                        <TableCell>{tool.name}</TableCell>
                                        <TableCell>
                                            {tool.container.image.name}
                                        </TableCell>
                                        <TableCell>
                                            {tool.container.image.tag}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        <DETableHead
                            selectable={false}
                            numSelected={0}
                            rowCount={tools ? tools.length : 0}
                            baseId={buildID(
                                ids.PUBLICATION_REQUESTS.TOOLS_USED_DIALOG,
                                ids.PUBLICATION_REQUESTS.TOOLS_USED_LISTING
                            )}
                            columnData={toolColumnData(t)}
                        />
                    </Table>
                </TableContainer>
            </DEDialog>
        </React.Fragment>
    );
}
function AppPublicationRequests(props) {
    const { parentId } = props;
    const { t } = useTranslation("apps");

    const [requests, setRequests] = React.useState();
    const [error, setError] = React.useState();

    const queryClient = useQueryClient();

    const { isFetching: isRequestsFetching } = useQuery({
        queryKey: APP_PUBLICATION_REQUESTS_QUERY_KEY,
        queryFn: getAppPublicationRequests,
        enabled: true,
        onSuccess: (resp) => {
            setRequests(resp?.publication_requests);
            setError(null);
        },
        onError: (error) =>
            setError({ msg: t("appPubRequestsFetchError"), error }),
    });

    const { mutate: doAdminAppPublish, status: appPublishStatus } = useMutation(
        adminPublishApp,
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(
                    APP_PUBLICATION_REQUESTS_QUERY_KEY
                );
                setError(null);
            },
            onError: (error, { appName }) =>
                setError({ msg: t("appPublicationError", { appName }), error }),
        }
    );

    const onPublishClicked = (app) => {
        doAdminAppPublish({
            appId: app?.id,
            systemId: app.system_id,
            appName: app?.name,
        });
    };
    return (
        <>
            {error && (
                <ErrorTypographyWithDialog
                    baseId={parentId}
                    errorMessage={error?.msg}
                    errorObject={error?.error}
                />
            )}
            <TableContainer component={Paper} style={{ overflow: "auto" }}>
                <Table
                    stickyHeader={true}
                    size="small"
                    aria-label={t("ariaTableListing")}
                    id={buildID(
                        parentId,
                        ids.PUBLICATION_REQUESTS.REQUEST_LISTING
                    )}
                >
                    {(isRequestsFetching ||
                        appPublishStatus === constants.LOADING) && (
                        <TableLoading
                            numColumns={6}
                            numRows={25}
                            baseId="tableId"
                        />
                    )}
                    <TableBody>
                        {(!requests || requests.length === 0) && (
                            <EmptyTable
                                message={t("noRequests")}
                                numColumns={appColumnData(t).length}
                            />
                        )}
                        {requests &&
                            requests.length > 0 &&
                            requests.map((request) => (
                                <TableRow hover key={request.id}>
                                    <TableCell>{request.app.name}</TableCell>
                                    <TableCell>
                                        {request.app.integrator_name}
                                    </TableCell>
                                    <TableCell>
                                        {request.app.integrator_email}
                                    </TableCell>
                                    <TableCell>
                                        <ToolsUsed
                                            tools={request.app.tools}
                                            appName={request.app.name}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip
                                            title={t("publishApp", {
                                                appName: request.app.name,
                                            })}
                                        >
                                            <IconButton
                                                onClick={() =>
                                                    onPublishClicked(
                                                        request.app
                                                    )
                                                }
                                            >
                                                <PublicIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    <DETableHead
                        selectable={false}
                        numSelected={0}
                        rowCount={requests ? requests.length : 0}
                        baseId={parentId}
                        columnData={appColumnData(t)}
                    />
                </Table>
            </TableContainer>
        </>
    );
}

export default AppPublicationRequests;
