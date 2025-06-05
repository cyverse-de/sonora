/**
 * A hook to fetch a user's resource usage summary,
 * along with convenience flags and parsed values.
 *
 * @author psarando
 */
import { useQuery } from "react-query";

import constants from "../constants";
import { useTranslation } from "i18n";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import {
    getResourceUsageSummary,
    RESOURCE_USAGE_QUERY_KEY,
} from "serviceFacades/dashboard";

import { getUserQuota } from "./resourceUsage";

/**
 * A hook to fetch a user's resource usage summary.
 *
 * @param {function} showErrorAnnouncer - Function to show error announcements.
 * @param {string} [queryKey=RESOURCE_USAGE_QUERY_KEY] - Optional query key for
 *                  fetching the resource usage summary.
 *
 * @returns {object} An object containing the resource usage summary
 *                   along with convenience flags and parsed values.
 */
function useResourceUsageSummary(
    showErrorAnnouncer,
    queryKey = RESOURCE_USAGE_QUERY_KEY
) {
    const { t } = useTranslation("common");
    const [config] = useConfig();
    const [userProfile] = useUserProfile();

    const enforceSubscriptions = config?.subscriptions?.enforce;

    const {
        isFetching: isFetchingUsageSummary,
        data: resourceUsageSummary,
        error: resourceUsageError,
    } = useQuery({
        queryKey: [queryKey, userProfile?.id],
        queryFn: getResourceUsageSummary,
        enabled: !!(enforceSubscriptions && userProfile?.id),
        onError: (e) => {
            showErrorAnnouncer(t("usageSummaryError"), e);
        },
    });

    const dataUsage = resourceUsageSummary?.data_usage?.total || 0;
    const computeUsage = resourceUsageSummary?.cpu_usage?.total || 0;
    const subscription = resourceUsageSummary?.subscription;

    const storageQuota = getUserQuota(
        constants.DATA_STORAGE_RESOURCE_NAME,
        subscription
    );
    const computeQuota = getUserQuota(
        constants.CPU_HOURS_RESOURCE_NAME,
        subscription
    );

    const planName = subscription?.plan?.name || constants.PLAN_NAME_BASIC;
    const hasAddons = subscription?.addons?.length > 0;
    const hasDataAddon = !!subscription?.addons?.find(
        ({ addon }) =>
            addon.resource_type.name === constants.DATA_STORAGE_RESOURCE_NAME
    );
    const hasCPUAddon = !!subscription?.addons?.find(
        ({ addon }) =>
            addon.resource_type.name === constants.CPU_HOURS_RESOURCE_NAME
    );

    const dataLimitExceeded = enforceSubscriptions && dataUsage >= storageQuota;
    const computeLimitExceeded =
        enforceSubscriptions && computeUsage >= computeQuota;

    const planCanShare =
        !enforceSubscriptions ||
        planName !== constants.PLAN_NAME_BASIC ||
        hasAddons;

    return {
        isFetchingUsageSummary,
        resourceUsageSummary,
        resourceUsageError,
        planName,
        computeUsage,
        computeQuota,
        dataUsage,
        storageQuota,
        hasAddons,
        hasDataAddon,
        hasCPUAddon,
        computeLimitExceeded,
        dataLimitExceeded,
        planCanShare,
    };
}

export default useResourceUsageSummary;
