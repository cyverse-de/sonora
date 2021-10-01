/**
 * @author aramsey
 *
 * A custom hook to fetch any instant launches that are considered "first class"
 * and should be shown in the navigation drawer
 */
import { useQuery } from "react-query";
import {
    LIST_INSTANT_LAUNCHES_BY_METADATA_KEY,
    listInstantLaunchesByMetadata,
} from "serviceFacades/instantlaunches";
import constants from "constants.js";

function useFirstClassInstantLaunch() {
    const instantLaunchLocationAttr =
        constants.METADATA.INSTANT_LAUNCH_LOCATION_ATTR;
    const instantLaunchNavDrawer = constants.METADATA.INSTANT_LAUNCH_NAV_DRAWER;

    const { data, error } = useQuery({
        queryKey: [
            LIST_INSTANT_LAUNCHES_BY_METADATA_KEY,
            instantLaunchLocationAttr,
            instantLaunchNavDrawer,
        ],
        queryFn: () =>
            listInstantLaunchesByMetadata({
                attribute: instantLaunchLocationAttr,
                value: instantLaunchNavDrawer,
            }),
        enabled: !!(instantLaunchLocationAttr && instantLaunchNavDrawer),
    });

    return { instantLaunches: data?.instant_launches, error };
}

export default useFirstClassInstantLaunch;
