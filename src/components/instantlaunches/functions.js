/**
 * Removes a suffix from the username. Everything starting from the first '@' will be removed.
 *
 * @param {string} username - The username that will be shortened
 * @returns {string} - The shortened username
 */
export const shortenUsername = (username) => {
    const atIndex = username.indexOf("@");
    if (atIndex > -1) {
        return username.slice(0, atIndex);
    }
    return username;
};

export const isInInstantLaunch = (savedLaunchId, instantlaunches) => {
    const ilIDs = instantlaunches.map((il) => il.quick_launch_id);
    return ilIDs.includes(savedLaunchId);
};
