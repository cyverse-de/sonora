import callApi from "../common/callApi";
import micromatch from "micromatch";

export const DEFAULTS_MAPPING_QUERY_KEY = "fetchDefaultsMappings";

export const getDefaultsMapping = () =>
    callApi({
        endpoint: `/api/instantlaunches/defaults/mappings/latest`,
        method: "GET",
    });

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
