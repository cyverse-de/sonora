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
import { useDataDetails } from "serviceFacades/filesystem";
import useResourceUsageSummary from "common/useResourceUsageSummary";
import ids from "components/instantlaunches/ids";
import isQueryLoading from "components/utils/isQueryLoading";
import InstantLaunchButtonWrapper from "components/instantlaunches/InstantLaunchButtonWrapper";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import LoadingAnimation from "components/vice/loading/LoadingAnimation";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";

const InstantLaunchStandalone = (props) => {
    const {
        id: instant_launch_id,
        resource: resource_path,
        showErrorAnnouncer,
    } = props;
    const [resource, setResource] = useState(null);

    const { data, status, error } = useQuery(
        [GET_INSTANT_LAUNCH_FULL_KEY, instant_launch_id],
        () => getFullInstantLaunch(instant_launch_id)
    );

    const { isFetchingUsageSummary, computeLimitExceeded } =
        useResourceUsageSummary(showErrorAnnouncer);

    const { isFetching: isLoadingResource, error: resourceError } =
        useDataDetails({
            paths: [resource_path],
            enabled: !!resource_path,
            onSuccess: (resp) => {
                setResource(resp?.paths[resource_path]);
            },
        });

    const isLoading = isQueryLoading([
        status,
        isLoadingResource,
        isFetchingUsageSummary,
    ]);

    if (isLoading) {
        return <LoadingAnimation />;
    } else if (error || resourceError) {
        return (
            <WrappedErrorHandler
                baseId={ids.BASE}
                errorObject={error || resourceError}
            />
        );
    } else {
        return (
            <InstantLaunchButtonWrapper
                instantLaunch={data}
                resource={resource}
                computeLimitExceeded={computeLimitExceeded}
                autolaunch={true}
            />
        );
    }
};

export default withErrorAnnouncer(InstantLaunchStandalone);
