import React, { useState, useEffect } from "react";
import { useTranslation } from "i18n";

import { useQuery, useMutation, queryCache } from "react-query";

import { makeStyles } from "@material-ui/styles";
import WrappedErrorHandler from "../../utils/error/WrappedErrorHandler";

import { build as buildID } from "@cyverse-de/ui-lib";

import getData, {
    saveOutputFiles,
    downloadInputFiles,
    extendTimeLimit,
    saveAndExit,
    exit,
    VICE_ADMIN_QUERY_KEY,
} from "../../../serviceFacades/vice/admin";
import DETabPanel from "components/utils/DETabPanel";

import RowFilter from "./filter";
import CollapsibleTable, { defineColumn, ExpanderColumn } from "./table";
import JobLimits from "./joblimits";

import ids from "./ids";
import {
    DEPLOYMENT_COLUMNS,
    COMMON_COLUMNS,
    SERVICE_COLUMNS,
    POD_COLUMNS,
    BASE_ID,
} from "./constants";
import { Skeleton, TabList, TabContext, TabPanel } from "@material-ui/lab";

import { JSONPath } from "jsonpath-plus";
import efcs from "./filter/efcs";
import { AppBar, Tab, Tabs } from "@material-ui/core";
import Listing from "./accessRequests/Listing";

const id = (...values) => buildID(ids.ROOT, ...values);
const TABS = {
    quotaRequests: "QUOTA REQUESTS",
    analyses: "ANALYSES",
};

const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(3),
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: theme.spacing(1),
        },
        [theme.breakpoints.down("xs")]: {
            paddingLeft: theme.spacing(0.5),
            paddingRight: theme.spacing(0.5),
            paddingTop: theme.spacing(0.5),
        },
        paddingBottom: 0,
        overflow: "auto",
        height: "90vh",
    },
    filterSkeleton: {
        marginBottom: theme.spacing(5),
    },
    footer: {
        width: "100%",
        height: theme.spacing(5),

        [theme.breakpoints.down("sm")]: {
            height: 32,
        },
    },
    refresh: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    tabAppBarColorPrimary: {
        backgroundColor: theme.palette.white,
    },
    tabRoot: {
        color: theme.palette.darkGray,
        "&:hover": {
            color: theme.palette.black,
        },
    },
    tabSelected: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    tabPanelRoot: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

// The column definitions for the table.
const commonColumns = [
    ExpanderColumn,
    defineColumn("Username", COMMON_COLUMNS.USERNAME, "username"),
    defineColumn(
        "Date Created",
        COMMON_COLUMNS.CREATION_TIMESTAMP,
        "creationTimestamp"
    ),
    defineColumn("Analysis Name", COMMON_COLUMNS.ANALYSIS_NAME, "analysisName"),
    defineColumn("App Name", COMMON_COLUMNS.APP_NAME, "appName"),
    defineColumn("Namespace", COMMON_COLUMNS.NAMESPACE, "namespace"),
    defineColumn("External ID", COMMON_COLUMNS.EXTERNAL_ID, "externalID"),
    defineColumn("App ID", COMMON_COLUMNS.APP_ID, "appID"),
    defineColumn("User ID", COMMON_COLUMNS.USER_ID, "userID"),
];

const columns = {
    analyses: commonColumns,

    deployments: [
        ...commonColumns,
        defineColumn("Image", DEPLOYMENT_COLUMNS.IMAGE, "image"),
        defineColumn("Port", DEPLOYMENT_COLUMNS.PORT, "port"),
        defineColumn("UID", DEPLOYMENT_COLUMNS.UID, "uid"),
        defineColumn("GID", DEPLOYMENT_COLUMNS.GID, "gid"),
    ],

    services: [
        ...commonColumns,
        defineColumn("Port Name", SERVICE_COLUMNS.PORT_NAME, "portName"),
        defineColumn("Node Port", SERVICE_COLUMNS.NODE_PORT, "nodePort"),
        defineColumn("Target Port", SERVICE_COLUMNS.TARGET_PORT, "targetPort"),
        defineColumn(
            "Target Port Name",
            SERVICE_COLUMNS.TARGET_PORT_NAME,
            "targetPortName"
        ),
        defineColumn("Protocol", SERVICE_COLUMNS.PROTOCOL, "protocol"),
    ],

    pods: [
        ...commonColumns,
        defineColumn("Phase", POD_COLUMNS.PHASE, "phase"),
        defineColumn("Message", POD_COLUMNS.MESSAGE, "message"),
        defineColumn("Reason", POD_COLUMNS.REASON, "reason"),
        defineColumn(
            "Status - Name",
            POD_COLUMNS.CONTAINER_STATUS_NAME,
            "containerStatusName"
        ),
        defineColumn(
            "Status - Ready",
            POD_COLUMNS.CONTAINER_STATUS_READY,
            "containerStatusReady"
        ),
        defineColumn(
            "Status - Restart Count",
            POD_COLUMNS.CONTAINER_STATUS_RESTART_COUNT,
            "containerStatusRestartCount"
        ),
        defineColumn(
            "Status - Image",
            POD_COLUMNS.CONTAINER_STATUS_IMAGE,
            "containerStatusImage"
        ),
        defineColumn(
            "Status - Image ID",
            POD_COLUMNS.CONTAINER_STATUS_IMAGE_ID,
            "containerStatusImageID"
        ),
        defineColumn(
            "Status - Container ID",
            POD_COLUMNS.CONTAINER_STATUS_CONTAINER_ID,
            "containerStatusContainerID"
        ),
        defineColumn(
            "Status - Started",
            POD_COLUMNS.CONTAINER_STATUS_STARTED,
            "containerStatusStarted"
        ),
    ],
    configMaps: commonColumns,
    ingresses: commonColumns,
};

const getAnalyses = ({ deployments = [] }) => {
    let analyses = {};

    // Should only need to interate through the deployments to find the
    // list of analyses in the data.
    deployments.forEach((element) => {
        if (!analyses.hasOwnProperty(element.externalID)) {
            analyses[element.externalID] = {
                externalID: element.externalID,
                username: element.username,
                analysisName: element.analysisName,
                appName: element.appName,
                creationTimestamp: element.creationTimestamp,
                appID: element.appID,
                userID: element.userID,
                namespace: element.namespace,
            };
        }
    });

    return Object.values(analyses);
};

const VICEAdminSkeleton = () => {
    const classes = useStyles();
    return (
        <>
            <Skeleton
                variant="rect"
                animation="wave"
                height={100}
                width="100%"
                classes={{ root: classes.filterSkeleton }}
            />
            <Skeleton
                variant="rect"
                animation="wave"
                height={300}
                width="100%"
            />
        </>
    );
};

const VICEAdminTabs = ({ data = {} }) => {
    const classes = useStyles();
    const { t } = useTranslation("vice-admin");

    const [value, setValue] = useState("0");

    const tabID = (name) => id(ids.ROOT, "admin", "tabs", name);
    const tabPanelID = (name) => id(ids.ROOT, "admin", "tab-panels", name);

    const [mutantExit] = useMutation(exit, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const [mutantSaveAndExit] = useMutation(saveAndExit, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const [mutantExtendTimeLimit] = useMutation(extendTimeLimit, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const [mutantUploadOutputs] = useMutation(saveOutputFiles, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const [mutantDownloadInputs] = useMutation(downloadInputFiles, {
        onSuccess: () => queryCache.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });

    const [analysisRows, setAnalysisRows] = useState([]);

    useEffect(() => {
        setAnalysisRows(getAnalyses(data));
    }, [data]);

    const orderOfTabs = [
        "analyses",
        "deployments",
        "services",
        "pods",
        "configMaps",
        "ingresses",
    ];

    return (
        <TabContext value={value}>
            <AppBar
                position="static"
                color="primary"
                classes={{ colorPrimary: classes.tabAppBarColorPrimary }}
            >
                <TabList
                    onChange={(_, newValue) => setValue(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="secondary"
                >
                    {orderOfTabs.map((tabName, index) => (
                        <Tab
                            label={t(tabName)}
                            id={tabID(tabName)}
                            key={tabID(tabName)}
                            value={`${index}`}
                            aria-controls={tabPanelID(tabName)}
                            classes={{
                                root: classes.tabRoot,
                                selected: classes.tabSelected,
                            }}
                        />
                    ))}
                </TabList>
            </AppBar>

            {orderOfTabs.map((tabName, index) => (
                <TabPanel
                    value={`${index}`}
                    id={tabPanelID(tabName)}
                    key={tabPanelID(tabName)}
                    classes={{ root: classes.tabPanelRoot }}
                >
                    <CollapsibleTable
                        data={analysisRows}
                        columns={columns[tabName]}
                        title={t(tabName)}
                        showActions={tabName === "analyses"}
                        handleExit={async (analysisID, externalID) => {
                            const data = await mutantExit({ analysisID });
                            setAnalysisRows(
                                analysisRows.filter(
                                    (obj) => obj.externalID !== externalID
                                )
                            );
                            return data;
                        }}
                        handleSaveAndExit={async (analysisID, externalID) => {
                            const data = await mutantSaveAndExit({
                                analysisID,
                            });
                            setAnalysisRows(
                                analysisRows.filter(
                                    (obj) => obj.externalID !== externalID
                                )
                            );
                            return data;
                        }}
                        handleExtendTimeLimit={async (
                            analysisID,
                            externalID
                        ) => {
                            const data = await mutantExtendTimeLimit({
                                analysisID,
                            });
                            return data;
                        }}
                        handleUploadOutputs={async (analysisID, externalID) => {
                            const data = await mutantUploadOutputs({
                                analysisID,
                            });
                            return data;
                        }}
                        handleDownloadInputs={async (
                            analysisID,
                            externalID
                        ) => {
                            const data = await mutantDownloadInputs({
                                analysisID,
                            });
                            return data;
                        }}
                    />
                </TabPanel>
            ))}
        </TabContext>
    );
};

const VICEAdmin = () => {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(TABS.quotaRequests);
    const { t } = useTranslation("vice-admin");

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const { isError: hasErrored, isLoading, data, error } = useQuery(
        VICE_ADMIN_QUERY_KEY,
        getData
    );

    const [filters, setFilters] = useState({});

    const addToFilters = (key, value) =>
        setFilters({ ...filters, [key]: value });

    const deleteFromFilters = (key) => {
        const { [key]: _, ...deletedFrom } = filters;
        setFilters(deletedFrom);
    };

    const filteredData = Object.entries(filters).reduce(
        (acc, [mappingSelector, value]) => {
            // grab the correct ExtractFilterCompare instance from the efcs
            // mapping.
            const result = JSONPath({
                path: mappingSelector,
                json: efcs,
            });
            if (result.length > 0) {
                // Use the EFC to filter for the value. Return it as the new value
                // of the accumulator.
                return result[0].filterIt(acc, value);
            }
            return acc;
        },
        data
    );

    return (
        <div id={id(ids.ROOT)} className={classes.root}>
            <Tabs
                value={selectedTab}
                onChange={onTabSelectionChange}
                classes={{ indicator: classes.tabIndicator }}
            >
                <Tab
                    value={TABS.quotaRequests}
                    label={t("requestLimitTabLabel")}
                    id={id(ids.REQUEST_LIMIT_TAB)}
                    classes={{ selected: classes.tabSelected }}
                />
                <Tab
                    value={TABS.analyses}
                    label={t("analysesTabLabel")}
                    id={id(ids.USER_ANALYSES_TAB)}
                    classes={{ selected: classes.tabSelected }}
                />
            </Tabs>
            <DETabPanel
                tabId={id(ids.REQUEST_LIMIT_TAB)}
                value={TABS.quotaRequests}
                selectedTab={selectedTab}
            >
                <JobLimits />
                <Listing />
            </DETabPanel>
            <DETabPanel
                tabId={id(ids.USER_ANALYSES_TAB)}
                value={TABS.analyses}
                selectedTab={selectedTab}
            >
                {isLoading ? (
                    <VICEAdminSkeleton />
                ) : hasErrored ? (
                    <WrappedErrorHandler errorObject={error} baseId={BASE_ID} />
                ) : (
                    <>
                        <RowFilter
                            filters={filters}
                            addToFilters={addToFilters}
                            deleteFromFilters={deleteFromFilters}
                        />

                        <VICEAdminTabs data={filteredData} />
                    </>
                )}
            </DETabPanel>
        </div>
    );
};

export default VICEAdmin;
