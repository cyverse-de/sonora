import React from "react";
import OAuthErrorHandler from "../src/components/oauth/OAuthErrorHandler";

export default { title: "OAuth" };

export const InvalidRequest = () => (
    <OAuthErrorHandler errorCode="invalid_request" baseId="someBaseId" />
);
