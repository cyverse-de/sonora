/**
 * @author sarahr
 */

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { build } from "@cyverse-de/ui-lib";

import { Card, CardHeader, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

import {
    APP_CATEGORIES_QUERY_KEY,
    getPrivateCategories,
} from "serviceFacades/apps";
import {
    OAUTH_CALLBACK_QUERY_KEY,
    doOAuthCallback,
} from "serviceFacades/oauth";

import OAuthErrorHandler from "./OAuthErrorHandler";
import ids from "./ids";
import { getListingPath } from "../apps/utils";
import systemId from "components/models/systemId";
import { useUserProfile } from "contexts/userProfile";

const ERR_SERVICE = "general_service_error";

function OAuthCodeHandler(props) {
    const { baseId, apiName, code, stateId } = props;
    const handlerId = build(baseId, ids.OAUTH_CODE_HANDLER);
    const router = useRouter();
    const [userProfile] = useUserProfile();
    const [categoryQueryKey, setCategoryQueryKey] = useState([
        APP_CATEGORIES_QUERY_KEY,
        userProfile?.id,
    ]);
    const [listingUrl, setListingUrl] = useState(null);

    const determineListingUrl = useCallback(
        (data) => {
            const hpcCategory = data.categories.find(
                (cat) => cat.system_id === systemId.agave
            );
            setListingUrl(
                getListingPath(
                    null,
                    null,
                    null,
                    null,
                    null,
                    JSON.stringify(hpcCategory),
                    false
                )
            );
        },
        [setListingUrl]
    );

    const { isFetching: isFetchingCategories } = useQuery({
        queryKey: categoryQueryKey,
        queryFn: getPrivateCategories,
        config: {
            onSuccess: determineListingUrl,
            staleTime: Infinity,
            cacheTime: Infinity,
        },
    });

    useEffect(() => {
        setCategoryQueryKey([APP_CATEGORIES_QUERY_KEY, userProfile?.id]);
    }, [userProfile]);

    // Call the API's callback endpoint.
    const { isFetching, error } = useQuery({
        queryKey: [
            OAUTH_CALLBACK_QUERY_KEY,
            {
                apiName,
                code,
                stateId,
            },
        ],
        queryFn: doOAuthCallback,
    });

    if (isFetching || isFetchingCategories) {
        const avatar = <InfoIcon fontSize="large" color="primary" />;
        const title = (
            <Typography color="primary" variant="h6">
                Just a moment...
            </Typography>
        );
        const subheader = (
            <Typography color="primary">Linking the DE to the API.</Typography>
        );
        return (
            <Card id={baseId}>
                <CardHeader
                    avatar={avatar}
                    title={title}
                    subheader={subheader}
                />
            </Card>
        );
    }

    if (error) {
        return <OAuthErrorHandler errorCode={ERR_SERVICE} baseId={handlerId} />;
    }

    router.push(listingUrl);
    return null;
}

export default OAuthCodeHandler;
