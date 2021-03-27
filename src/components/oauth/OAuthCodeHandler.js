/**
 * @author sarahr
 */

import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { build } from "@cyverse-de/ui-lib";

import { Card, CardHeader, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

import NavigationConstants from "common/NavigationConstants";
import {
    OAUTH_CALLBACK_QUERY_KEY,
    doOAuthCallback,
} from "serviceFacades/oauth";

import OAuthErrorHandler from "./OAuthErrorHandler";
import ids from "./ids";

const ERR_SERVICE = "general_service_error";

function OAuthCodeHandler(props) {
    const { baseId, apiName, code, stateId } = props;
    const handlerId = build(baseId, ids.OAUTH_CODE_HANDLER);
    const router = useRouter();

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

    if (isFetching) {
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

    router.push(`/${NavigationConstants.APPS}`);
}

export default OAuthCodeHandler;
