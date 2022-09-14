/**
 * @author aramsey
 *
 * A component that will display the list of 0-parameter instant launches.
 *
 * The list will be controlled by admins via the admin/vice page.
 */
import React, { useMemo, useState } from "react";

import { IconButton, Toolbar } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import { useQuery } from "react-query";

import Drawer from "components/apps/details/Drawer";
import WrappedErrorHandler from "components/error/WrappedErrorHandler";
import BasicTable from "components/table/BasicTable";
import BackButton from "components/utils/BackButton";
import buildID from "components/utils/DebugIDUtil";
import DELink from "components/utils/DELink";
import isQueryLoading from "components/utils/isQueryLoading";
import constants from "constants.js";
import { useTranslation } from "i18n";
import ids from "../ids";
import InstantLaunchButtonWrapper from "../InstantLaunchButtonWrapper";
import {
    LIST_INSTANT_LAUNCHES_BY_METADATA_KEY,
    listInstantLaunchesByMetadata,
} from "serviceFacades/instantlaunches";
import {
    getResourceUsageSummary,
    RESOURCE_USAGE_QUERY_KEY,
} from "serviceFacades/dashboard";
import { getUserQuota } from "common/resourceUsage";
import { useConfig } from "contexts/config";
import globalConstants from "../../../constants";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";

function Listing(props) {
    const { baseId, showErrorAnnouncer } = props;
    const [showAppDetails, setShowAppDetails] = useState(null);
    const [config] = useConfig();
    const [computeLimitExceeded, setComputeLimitExceeded] = useState(
        !!config?.subscriptions?.enforce
    );

    const { t } = useTranslation("instantlaunches");
    const instantLaunchLocationAttr =
        constants.METADATA.INSTANT_LAUNCH_LOCATION_ATTR;
    const instantLaunchListing = constants.METADATA.INSTANT_LAUNCH_LISTING;

    const { data, status, error } = useQuery(
        [
            LIST_INSTANT_LAUNCHES_BY_METADATA_KEY,
            instantLaunchLocationAttr,
            instantLaunchListing,
        ],
        () =>
            listInstantLaunchesByMetadata({
                attribute: instantLaunchLocationAttr,
                value: instantLaunchListing,
                unit: "",
            })
    );

    const { isFetching: isFetchingUsageSummary } = useQuery({
        queryKey: [RESOURCE_USAGE_QUERY_KEY],
        queryFn: getResourceUsageSummary,
        enabled: !!config?.subscriptions?.enforce,
        onSuccess: (respData) => {
            const computeUsage = respData?.cpu_usage?.total || 0;
            const userPlan = respData?.user_plan;
            const computeQuota = getUserQuota(
                globalConstants.CPU_HOURS_RESOURCE_NAME,
                userPlan
            );
            setComputeLimitExceeded(computeUsage >= computeQuota);
        },
        onError: (e) => {
            showErrorAnnouncer(t("usageSummaryError"), e);
        },
    });

    const columns = useMemo(() => {
        const listingId = buildID(baseId, ids.LISTING);
        return [
            {
                Header: t("name"),
                accessor: "quick_launch_name",
                Cell: ({ row }) => {
                    const instantLaunch = row.original;
                    return (
                        <InstantLaunchButtonWrapper
                            instantLaunch={instantLaunch}
                            computeLimitExceeded={computeLimitExceeded}
                            render={(onClick) => (
                                <DELink
                                    onClick={onClick}
                                    text={instantLaunch.quick_launch_name}
                                    title={instantLaunch.quick_launch_name}
                                    id={buildID(listingId, instantLaunch.id)}
                                />
                            )}
                        />
                    );
                },
            },
            {
                Header: t("app"),
                accessor: "app_name",
            },
            {
                Header: "",
                accessor: "id",
                Cell: ({ row }) => {
                    const instantLaunch = row.original;
                    const appId = instantLaunch.app_id;
                    return (
                        <IconButton
                            onClick={() =>
                                setShowAppDetails({
                                    app_id: appId,
                                    system_id:
                                        instantLaunch.submission.system_id,
                                })
                            }
                            size="small"
                            color="primary"
                            title={t("appDetails")}
                        >
                            <Info fontSize="small" />
                        </IconButton>
                    );
                },
            },
        ];
    }, [baseId, t, computeLimitExceeded]);

    const isLoading = isQueryLoading([status, isFetchingUsageSummary]);

    if (error) {
        return <WrappedErrorHandler errorObject={error} baseId={baseId} />;
    }

    return (
        <>
            <Toolbar>
                <BackButton />
            </Toolbar>
            <BasicTable
                columns={columns}
                data={data?.instant_launches || []}
                loading={isLoading}
                sortable={true}
            />
            <Drawer
                baseId={baseId}
                open={!!showAppDetails}
                appId={showAppDetails?.app_id}
                systemId={showAppDetails?.system_id}
                onClose={() => setShowAppDetails(null)}
            />
        </>
    );
}

export default withErrorAnnouncer(Listing);
