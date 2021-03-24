/**
 * @author sarahr
 */
import React from "react";
import { useRouter } from "next/router";

import OAuthErrorHandler from "components/oauth/OAuthErrorHandler";

function OAuthCallbackHandler() {
    const router = useRouter();
    const query = router.query;
    const baseId = "OAuthCallbackHandler";

    return <OAuthErrorHandler errorCode={query.error_code} baseId={baseId} />;
}

export default OAuthCallbackHandler;
