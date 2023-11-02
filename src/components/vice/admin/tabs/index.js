import React, { useState, useEffect } from "react";

import { useMutation, useQueryClient } from "react-query";

import { useTranslation } from "i18n";

import { AppBar, Tab } from "@mui/material";

import { TabContext, TabList, TabPanel } from "@mui/lab";

import { makeStyles, useTheme } from "@mui/styles";

import buildID from "components/utils/DebugIDUtil";

import CollapsibleTable from "components/vice/admin/table";

import {
    saveOutputFiles,
    downloadInputFiles,
    extendTimeLimit,
    saveAndExit,
    exit,
    VICE_ADMIN_QUERY_KEY,
} from "serviceFacades/vice/admin";

import columns from "./columns";
import ids from "components/vice/admin/ids";

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

const useStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(3),
        [theme.breakpoints.down("md")]: {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: theme.spacing(1),
        },
        [theme.breakpoints.down("sm")]: {
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

        [theme.breakpoints.down("md")]: {
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

const VICEAdminTabs = ({ data = {} }) => {
    const classes = useStyles();
    const { t } = useTranslation("vice-admin");
    const theme = useTheme();

    const [value, setValue] = useState("0");

    const tabID = (name) => buildID(ids.ROOT, "admin", "tabs", name);
    const tabPanelID = (name) => buildID(ids.ROOT, "admin", "tab-panels", name);

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const { mutate: mutantExit } = useMutation(exit, {
        onSuccess: () => queryClient.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const { mutate: mutantSaveAndExit } = useMutation(saveAndExit, {
        onSuccess: () => queryClient.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const { mutate: mutantExtendTimeLimit } = useMutation(extendTimeLimit, {
        onSuccess: () => queryClient.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const { mutate: mutantUploadOutputs } = useMutation(saveOutputFiles, {
        onSuccess: () => queryClient.invalidateQueries(VICE_ADMIN_QUERY_KEY),
    });
    const { mutate: mutantDownloadInputs } = useMutation(downloadInputFiles, {
        onSuccess: () => queryClient.invalidateQueries(VICE_ADMIN_QUERY_KEY),
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
                            sx={{
                                "&.Mui-selected": {
                                    backgroundColor: theme.palette.primary.main,
                                    color: theme.palette.primary.contrastText,
                                },
                            }}
                            label={t(tabName)}
                            buildID={tabID(tabName)}
                            key={tabID(tabName)}
                            value={`${index}`}
                            aria-controls={tabPanelID(tabName)}
                            classes={{
                                root: classes.tabRoot,
                            }}
                        />
                    ))}
                </TabList>
            </AppBar>

            {orderOfTabs.map((tabName, index) => (
                <TabPanel
                    value={`${index}`}
                    buildID={tabPanelID(tabName)}
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

export default VICEAdminTabs;
