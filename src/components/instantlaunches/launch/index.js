/**
 * @author mian
 *
 * The component that launches a provided instant launch, immediately.
 */
import React, { useState } from "react";

import { useQuery } from "react-query";

import {
    GET_INSTANT_LAUNCH_FULL_KEY,
    getFullInstantLaunch,
} from "serviceFacades/instantlaunches";
import {
    getResourceUsageSummary,
    RESOURCE_USAGE_QUERY_KEY,
} from "serviceFacades/dashboard";
import { getUserQuota } from "common/resourceUsage";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import globalConstants from "../../../constants";
import { useTranslation } from "i18n";
import isQueryLoading from "components/utils/isQueryLoading";
import InstantLaunchButtonWrapper from "components/instantlaunches/InstantLaunchButtonWrapper";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import LoadingAnimation from "components/vice/loading/LoadingAnimation";

const InstantLaunchStandalone = (props) => {
    const { id: instant_launch_id, showErrorAnnouncer } = props;
    const [config] = useConfig();
    const [userProfile] = useUserProfile();
    const [computeLimitExceeded, setComputeLimitExceeded] = useState(
        !!config?.subscriptions?.enforce
    );
    const { t } = useTranslation(["instantlaunches", "common"]);

    const { data, status, error } = useQuery(
        [GET_INSTANT_LAUNCH_FULL_KEY, instant_launch_id],
        () => getFullInstantLaunch(instant_launch_id)
    );

    const { isFetching: isFetchingUsageSummary } = useQuery({
        queryKey: [RESOURCE_USAGE_QUERY_KEY],
        queryFn: getResourceUsageSummary,
        enabled: !!config?.subscriptions?.enforce && !!userProfile?.id,
        onSuccess: (respData) => {
            const computeUsage = respData?.cpu_usage?.total || 0;
            const subscription = respData?.subscription;
            const computeQuota = getUserQuota(
                globalConstants.CPU_HOURS_RESOURCE_NAME,
                subscription
            );
            setComputeLimitExceeded(computeUsage >= computeQuota);
        },
        onError: (e) => {
            showErrorAnnouncer(t("common:usageSummaryError"), e);
        },
    });

    const isLoading = isQueryLoading([status, isFetchingUsageSummary]);

    if (isLoading) {
        return <LoadingAnimation />;
    } else if (error) {
        return (
            <p>
                error{" "}
                {error?.response?.status === 404 ? "not found" : "unsure why"}
            </p>
        );
    } else {
        return (
            <InstantLaunchButtonWrapper
                instantLaunch={data}
                computeLimitExceeded={computeLimitExceeded}
                autolaunch={true}
            />
        );
    }
};

export default withErrorAnnouncer(InstantLaunchStandalone);
