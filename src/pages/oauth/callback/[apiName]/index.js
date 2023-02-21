/**
 * @author sarahr
 */
import React from "react";

import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { RequiredNamespaces } from "i18n";

import OAuthCodeHandler from "components/oauth/OAuthCodeHandler";
import OAuthErrorHandler from "components/oauth/OAuthErrorHandler";

const ERR_MISSING_AUTH_CODE = "no_auth_code_provided";
const ERR_MISSING_STATE = "no_state_id_provided";

/**
 * Determines the appropriate error code for the given query object. Most error
 * codes come from the OAuth server, but we also check for conditions where
 * required information is missing from the query string of the redirect URL.
 *
 * @param {} query
 * @returns the error code to use or null if there is no error in the request.
 */
function determineErrorCode(query) {
    return query.error_code
        ? query.error_code
        : !query.code
        ? ERR_MISSING_AUTH_CODE
        : !query.state
        ? ERR_MISSING_STATE
        : null;
}

function OAuthCallbackHandler() {
    const router = useRouter();
    const query = router.query;
    const baseId = "oauth";

    // We can't proceed if an error occurred or the configuration is invalid.
    const errorCode = determineErrorCode(query);
    if (errorCode) {
        return <OAuthErrorHandler errorCode={errorCode} baseId={baseId} />;
    }

    return (
        <OAuthCodeHandler
            baseId={baseId}
            apiName={query.apiName}
            code={query.code}
            stateId={query.state}
        />
    );
}

export async function getServerSideProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                "oauth",
                ...RequiredNamespaces,
            ])),
        },
    };
}

export default OAuthCallbackHandler;
