import React, { useState } from "react";

import { useUserProfile } from "contexts/userProfile";
import NotAuthorized from "components/error/NotAuthorized";

import { RequiredNamespaces, useTranslation } from "i18n";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useQuery } from "react-query";

import { makeStyles } from "@material-ui/styles";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";

import buildID from "components/utils/DebugIDUtil";

import getData, { VICE_ADMIN_QUERY_KEY } from "serviceFacades/vice/admin";
import { DETabPanel, DETabs, DETab } from "components/utils/DETabs";

import RowFilter from "components/vice/admin/filter";
import JobLimits from "components/vice/admin/joblimits";
import efcs from "components/vice/admin/filter/efcs";

import ids from "components/vice/admin/ids";
import { BASE_ID } from "components/vice/admin/constants";

import { Skeleton } from "@material-ui/lab";

import { JSONPath } from "jsonpath-plus";

import Listing from "components/vice/admin/accessRequests/Listing";
import InstantLaunchList from "components/instantlaunches/admin/InstantLaunchList";
import InstantLaunchMapping from "components/instantlaunches/admin/InstantLaunchMapping";
import VICEAdminTabs from "components/vice/admin/tabs";

const id = (...values) => buildID(ids.ROOT, ...values);
const TABS = {
    quotaRequests: "QUOTA REQUESTS",
    analyses: "ANALYSES",
    instantLaunches: "INSTANT LAUNCHES",
    dataMapping: "DATA MAPPING",
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
                id="vice-admin-skeleton-0"
                classes={{ root: classes.filterSkeleton }}
            />
            <Skeleton
                variant="rect"
                animation="wave"
                height={300}
                width="100%"
                id="vice-admin-skeleton-1"
            />
        </>
    );
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
}));

export const VICEAdmin = () => {
    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(TABS.quotaRequests);
    const { t } = useTranslation("vice-admin");

    const onTabSelectionChange = (event, selectedTab) => {
        setSelectedTab(selectedTab);
    };

    const {
        isError: hasErrored,
        isLoading,
        data,
        error,
    } = useQuery(VICE_ADMIN_QUERY_KEY, getData);

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
            <DETabs value={selectedTab} onChange={onTabSelectionChange}>
                <DETab
                    value={TABS.quotaRequests}
                    label={t("requestLimitTabLabel")}
                    id={id(ids.REQUEST_LIMIT_TAB)}
                />

                <DETab
                    value={TABS.analyses}
                    label={t("analysesTabLabel")}
                    id={id(ids.USER_ANALYSES_TAB)}
                />

                <DETab
                    value={TABS.instantLaunches}
                    label={t("instantLaunchesTabLabel")}
                    id={id(ids.INSTANT_LAUNCHES_TAB)}
                />

                <DETab
                    value={TABS.dataMapping}
                    label={t("dataMappingTabLabel")}
                    id={id(ids.DATA_MAPPING_TAB)}
                />
            </DETabs>

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
                showDivider={false}
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

            <DETabPanel
                tabID={id(ids.INSTANT_LAUNCHES_TAB)}
                value={TABS.instantLaunches}
                selectedTab={selectedTab}
                showDivider={false}
            >
                <InstantLaunchList />
            </DETabPanel>

            <DETabPanel
                tabId={id(ids.DATA_MAPPING_TAB)}
                value={TABS.dataMapping}
                selectedTab={selectedTab}
                showDivider={false}
            >
                <InstantLaunchMapping />
            </DETabPanel>
        </div>
    );
};

export default function VICEAdminPage() {
    const profile = useUserProfile()[0];
    if (!profile?.admin) {
        return <NotAuthorized />;
    } else {
        return <VICEAdmin />;
    }
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "vice-admin",
                ...RequiredNamespaces,
            ])),
        },
    };
}
