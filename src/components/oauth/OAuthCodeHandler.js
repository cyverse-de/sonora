/**
 * @author sarahr
 */

import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import buildID from "components/utils/DebugIDUtil";

import {
    APP_CATEGORIES_QUERY_KEY,
    getPrivateCategories,
} from "serviceFacades/apps";
import {
    OAUTH_CALLBACK_QUERY_KEY,
    doOAuthCallback,
} from "serviceFacades/oauth";

import OAuthErrorHandler from "./OAuthErrorHandler";
import OAuthLinkingMessage from "./OAuthLinkingMessage";
import ids from "./ids";
import { getListingPath } from "components/apps/utils";
import systemId from "components/models/systemId";
import { useUserProfile } from "contexts/userProfile";

const ERR_SERVICE = "general_service_error";

function OAuthCodeHandler(props) {
    const { baseId, apiName, code, stateId } = props;
    const handlerId = buildID(baseId, ids.OAUTH_CODE_HANDLER);
    const router = useRouter();
    const [userProfile] = useUserProfile();
    const [listingUrl, setListingUrl] = useState(
        getListingPath(null, null, null, null, null, null, false)
    );

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
        queryKey: [APP_CATEGORIES_QUERY_KEY, userProfile?.id],
        queryFn: getPrivateCategories,
        config: {
            enabled: userProfile?.id,
            onSuccess: determineListingUrl,
            staleTime: Infinity,
            cacheTime: Infinity,
        },
    });

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
        queryFn: () =>
            doOAuthCallback({
                apiName,
                code,
                stateId,
            }),
    });

    if (isFetching || isFetchingCategories) {
        return <OAuthLinkingMessage baseId={handlerId} />;
    }

    if (error) {
        return <OAuthErrorHandler errorCode={ERR_SERVICE} baseId={handlerId} />;
    }

    router.replace(listingUrl);
    return null;
}

export default OAuthCodeHandler;
