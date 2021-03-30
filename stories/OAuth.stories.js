import OAuthLinkingMessage from "components/oauth/OAuthLinkingMessage";
import React from "react";
import OAuthErrorHandler from "../src/components/oauth/OAuthErrorHandler";

export default { title: "OAuth" };

const OAuthErrorTemplate = (args) => (
    <OAuthErrorHandler baseId="someBaseId" {...args} />
);

export const InvalidRequest = OAuthErrorTemplate.bind({});
InvalidRequest.args = {
    errorCode: "invalid_request",
};

export const UnauthorizedClient = OAuthErrorTemplate.bind({});
UnauthorizedClient.args = {
    errorCode: "unauthorized_client",
};

export const AccessDenied = OAuthErrorTemplate.bind({});
AccessDenied.args = {
    errorCode: "access_denied",
};

export const UnsupportedResponseType = OAuthErrorTemplate.bind({});
UnsupportedResponseType.args = {
    errorCode: "unsupported_response_type",
};

export const InvalidScope = OAuthErrorTemplate.bind({});
InvalidScope.args = {
    errorCode: "invalid_scope",
};

export const ServerError = OAuthErrorTemplate.bind({});
ServerError.args = {
    errorCode: "server_error",
};

export const TemporarilyUnavailable = OAuthErrorTemplate.bind({});
TemporarilyUnavailable.args = {
    errorCode: "temporarily_unavailable",
};

export const NoAuthCodeProvided = OAuthErrorTemplate.bind({});
NoAuthCodeProvided.args = {
    errorCode: "no_auth_code_provided",
};

export const NoStateIdProvided = OAuthErrorTemplate.bind({});
NoStateIdProvided.args = {
    errorCode: "no_state_id_provided",
};

export const GeneralServiceError = OAuthErrorTemplate.bind({});
GeneralServiceError.args = {
    errorCode: "general_service_error",
};

export function OAuthLinkingMessageTest() {
    return <OAuthLinkingMessage baseId="baseId" />;
}
OAuthLinkingMessageTest.storyName = "OAuth Linking Message Test";
