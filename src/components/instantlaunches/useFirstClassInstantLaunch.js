/**
 * @author aramsey
 *
 * A custom hook to fetch any instant launches that are considered "first class"
 * and should be shown in the navigation drawer
 */
import { useConfig } from "contexts/config";
import { useQuery } from "react-query";
import {
    LIST_INSTANT_LAUNCHES_BY_METADATA_KEY,
    listInstantLaunchesByMetadata,
} from "serviceFacades/instantlaunches";

function useFirstClassInstantLaunch() {
    const [config] = useConfig();

    const instantLaunchLocationAttr =
        config?.metadata?.instantLaunchLocationAttr;
    const instantLaunchNavDrawer = config?.metadata?.instantLaunchNavDrawer;

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
