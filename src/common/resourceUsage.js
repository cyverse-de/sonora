/**
 * @module components/utils/util
 *
 * @description utility functions for use in multiple dashboard item components.
 */
import constants from "../constants";

// A map from resource type name to default storage limit. The default values should never be used, but it's
// helpful to have them in case we encounter a case where the user plan information doesn't contain a quota for
// a given resource type.
const defaultQuotaFor = {
    [constants.CPU_HOURS_RESOURCE_NAME]:
        constants.CPU_HOURS_QUOTA_LIMIT_DEFAULT,
    [constants.DATA_STORAGE_RESOURCE_NAME]:
        constants.DATA_STORAGE_QUOTA_LIMIT_DEFAULT,
};

/**
 * Determines the quota to use for given resource type name and subscription. If the subscription doesn't contain
 * any quotas for the given resource type name, the default quota value for the resource type is returned. If there
 * is no known default then zero is returned.
 *
 * @param {string} resourceTypeName
 * @param {object} subscription
 * @returns {number} the quota value to use.
 */
export const getUserQuota = (resourceTypeName, subscription) => {
    const quotas = subscription?.quotas;
    const defaultQuotaValue = defaultQuotaFor[resourceTypeName] || 0;

    // Search for the quota with the given resource type name.
    if (quotas) {
        for (const quota of quotas) {
            const currentResourceTypeName = quota?.resource_type?.name;
            if (currentResourceTypeName === resourceTypeName) {
                return quota?.quota || defaultQuotaValue;
            }
        }
    }

    // If execution gets here, we didn't find any quotas with a matching resource type name.
    return defaultQuotaValue;
};
