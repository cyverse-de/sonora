import React, { useState } from "react";
import { useTranslation } from "i18n";
import { useQuery, useMutation, queryCache } from "react-query";

import { build, EmptyTable } from "@cyverse-de/ui-lib";

import DETableHead from "components/utils/DETableHead";
import TableLoading from "components/utils/TableLoading";
import {
    getAppPublicationRequests,
    adminPublishApp,
    APP_PUBLICATION_REQUESTS_QUERY_KEY,
} from "serviceFacades/apps";
import DEDialog from "components/utils/DEDialog";
import constants from "../../constants";

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
        name: t("integratorName"),
        enableSorting: false,
        key: "integrator_name",
    },
    {
        name: t("integratorEmail"),
        enableSorting: false,
        key: "integrator_email",
    },
    {
        name: "Tools Used",
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
    const { tools, appName, parentId } = props;
    const [toolsDialogOpen, setToolsDialogOpen] = useState(false);
    const { t } = useTranslation("tools");
    return (
        <React.Fragment>
            <Button color="primary" onClick={() => setToolsDialogOpen(true)}>
                {t("viewTools")}
            </Button>
            <DEDialog
                open={toolsDialogOpen}
                title={t("toolsUsed", {
                    appName: appName,
                })}
                onClose={() => setToolsDialogOpen(false)}
            >
                <Table>
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
                        baseId={parentId}
                        columnData={toolColumnData(t)}
                    />
                </Table>
            </DEDialog>
        </React.Fragment>
    );
}
function AppPublicationRequests(props) {
    const { parentId } = props;
    const [requests, setRequests] = React.useState();
    const { t } = useTranslation("apps");

    const { isFetching: isRequestsFetching, error } = useQuery({
        queryKey: APP_PUBLICATION_REQUESTS_QUERY_KEY,
        queryFn: getAppPublicationRequests,
        config: {
            enabled: true,
            onSuccess: (resp) => setRequests(resp?.publication_requests),
        },
    });

    const [doAdminAppPublish, { status: appPublishStatus }] = useMutation(
        adminPublishApp,
        {
            onSuccess: (data) => {
                queryCache.invalidateQueries(
                    APP_PUBLICATION_REQUESTS_QUERY_KEY
                );
            },
            onError: (error) =>
                console.log("unable to publish app=>" + JSON.stringify(error)),
        }
    );

    const onPublishClicked = (app) => {
        console.log("publish this app=> " + app?.id);
        doAdminAppPublish({ appId: app?.id, systemId: app.system_id });
    };
    return (
        <TableContainer component={Paper} style={{ overflow: "auto" }}>
            <Table
                stickyHeader={true}
                size="small"
                aria-label={t("ariaTableListing")}
                id="tableId"
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
                                        parentId={build(parentId, "tools")}
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
                                                onPublishClicked(request.app)
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
    );
}

export default AppPublicationRequests;
