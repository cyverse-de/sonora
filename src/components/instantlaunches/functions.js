/**
 * Removes a suffix from the username. Everything after the last '@' will be removed.
 *
 * @param {string} username - The username that will be shortened
 * @returns {string} - The shortened username
 */
export const shortenUsername = (username) => {
    const atIndex = username.lastIndexOf("@");
    if (atIndex > -1) {
        return username.slice(0, atIndex);
    }
    return username;
};
