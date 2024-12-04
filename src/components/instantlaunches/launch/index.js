/**
 * @author mian
 *
 * The component that launches a provided instant launch, immediately.
 */
import React, { useState, useEffect } from "react";

import { useQuery } from "react-query";

import { useRouter } from "next/router";

import {
    GET_INSTANT_LAUNCH_FULL_KEY,
    getFullInstantLaunch,
} from "serviceFacades/instantlaunches";
import {
    getResourceUsageSummary,
    RESOURCE_USAGE_QUERY_KEY,
} from "serviceFacades/dashboard";
import { useDataDetails } from "serviceFacades/filesystem";
import { getUserQuota } from "common/resourceUsage";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import globalConstants from "../../../constants";
import { useTranslation } from "i18n";
import isQueryLoading from "components/utils/isQueryLoading";
import InstantLaunchButtonWrapper from "components/instantlaunches/InstantLaunchButtonWrapper";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import LoadingAnimation from "components/vice/loading/LoadingAnimation";

import DEErrorDialog from "components/error/DEErrorDialog";

const InstantLaunchStandalone = (props) => {
    const {
        id: instant_launch_id,
        resource: resource_path,
        showErrorAnnouncer,
    } = props;
    const [config] = useConfig();
    const [userProfile] = useUserProfile();
    const [computeLimitExceeded, setComputeLimitExceeded] = useState(
        !!config?.subscriptions?.enforce
    );
    const [resource, setResource] = useState(null);
    const [errDialogOpen, setErrDialogOpen] = useState(false);
    const [dialogError, setDialogError] = useState(null);

    const router = useRouter();
    const { t } = useTranslation(["instantlaunches", "common"]);

    const { data, status, error } = useQuery(
        [GET_INSTANT_LAUNCH_FULL_KEY, instant_launch_id],
        () => getFullInstantLaunch(instant_launch_id)
    );

    const { isFetching: isFetchingUsageSummary } = useQuery({
        queryKey: [RESOURCE_USAGE_QUERY_KEY],
        queryFn: getResourceUsageSummary,
        enabled: !!config?.subscriptions?.enforce && !!userProfile?.id,
        onSuccess: (respData) => {
            const computeUsage = respData?.cpu_usage?.total || 0;
            const subscription = respData?.subscription;
            const computeQuota = getUserQuota(
                globalConstants.CPU_HOURS_RESOURCE_NAME,
                subscription
            );
            setComputeLimitExceeded(computeUsage >= computeQuota);
        },
        onError: (e) => {
            showErrorAnnouncer(t("common:usageSummaryError"), e);
        },
    });

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

    useEffect(() => {
        if (error || resourceError) {
            setDialogError(error || resourceError);
            setErrDialogOpen(true);
        }
    }, [error, resourceError, setErrDialogOpen, setDialogError]);

    if (isLoading) {
        return <LoadingAnimation />;
    } else if (error || resourceError) {
        return (
            <DEErrorDialog
                open={errDialogOpen}
                errorObject={dialogError}
                handleClose={() => {
                    setErrDialogOpen(false);
                    router.push("/");
                }}
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
