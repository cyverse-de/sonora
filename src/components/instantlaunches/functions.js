import micromatch from "micromatch";

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

export const isInInstantLaunch = (qlID, instantlaunches) => {
    const ilIDs = instantlaunches.map((il) => il.quick_launch_id);
    return ilIDs.includes(qlID);
};

/**
 * Returns an Array tuple containing the instant launch object and the name of the
 * first pattern that the resource matched.
 *
 * @param {Object} defaults - The return value of serviceFacads/instantlaunches/getDefaultsMapping.
 * @param {Object} resource - Object representing a potential input. Needs at least label and infoType fields.
 */
export const defaultInstantLaunch = (defaults = {}, resource) => {
    const mappings = Object.entries(defaults);

    var instantLaunch;
    var patternName;

    for (const [matcherName, matcher] of mappings) {
        switch (matcher.kind) {
            case "glob":
                if (micromatch.isMatch(resource.label, matcher.pattern)) {
                    instantLaunch = matcher;
                    patternName = matcherName;
                }
                break;

            case "infoType":
                if (matcher.pattern === resource.infoType) {
                    instantLaunch = matcher;
                    patternName = matcherName;
                }
                break;

            default:
                break;
        }
    }

    return [instantLaunch, patternName];
};
