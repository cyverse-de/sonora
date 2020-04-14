import callApi from "../common/callApi";

/**
 * Get tag suggestions based on a search term
 * @param searchTerm A string value
 * @param searchLimit The max number of suggestions to return
 * @returns {Promise<any>}
 */
export const getTagSuggestions = ({ searchTerm, searchLimit = 10 }) => {
    return callApi({
        endpoint: `/api/tags/suggestions?contains=${searchTerm}&limit=${searchLimit}`,
    });
};

/**
 * Get the tags currently attached to a resource
 * @param key - Query key for react-query
 * @param resourceId The UUID of a resource
 * @returns {Promise<any>}
 */
export const getTagsForResource = (key, { resourceId }) => {
    return callApi({
        endpoint: `/api/filesystem/entry/${resourceId}/tags`,
    });
};

/**
 * Create a tag for the user
 * @param value A string value for the tag
 * @returns {Promise<any>}
 */
export const createUserTag = ({ value }) => {
    const body = {
        value,
    };

    return callApi({
        endpoint: `/api/tags/user`,
        method: "POST",
        body,
    });
};

/**
 * Attach a tag to a resource
 * @param tagIds An array of tag UUIDs
 * @param resourceId The UUID of a resource
 * @returns {Promise<any>}
 */
export const attachTagsToResource = ({ tagIds, resourceId }) => {
    const body = {
        tags: tagIds,
    };

    return callApi({
        endpoint: `/api/filesystem/entry/${resourceId}/tags?type=attach`,
        method: "PATCH",
        body,
    });
};

/**
 * Remove a tag attached to a resource
 * @param tagIds An array of tag UUIDs
 * @param resourceId The UUID of a resource
 * @returns {Promise<any>}
 */
export const detachTagsFromResource = ({ tagIds, resourceId }) => {
    const body = {
        tags: tagIds,
    };

    return callApi({
        endpoint: `/api/filesystem/entry/${resourceId}/tags?type=detach`,
        method: "PATCH",
        body,
    });
};
