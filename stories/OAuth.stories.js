import React from "react";
import OAuthErrorHandler from "../src/components/oauth/OAuthErrorHandler";

export default { title: "OAuth" };

const Template = (args) => <OAuthErrorHandler baseId="someBaseId" {...args} />;

export const InvalidRequest = Template.bind({});
InvalidRequest.args = {
    errorCode: "invalid_request",
};

export const UnauthorizedClient = Template.bind({});
UnauthorizedClient.args = {
    errorCode: "unauthorized_client",
};

export const AccessDenied = Template.bind({});
AccessDenied.args = {
    errorCode: "access_denied",
};

export const UnsupportedResponseType = Template.bind({});
UnsupportedResponseType.args = {
    errorCode: "unsupported_response_type",
};

export const InvalidScope = Template.bind({});
InvalidScope.args = {
    errorCode: "invalid_scope",
};

export const ServerError = Template.bind({});
ServerError.args = {
    errorCode: "server_error",
};

export const TemporarilyUnavailable = Template.bind({});
TemporarilyUnavailable.args = {
    errorCode: "temporarily_unavailable",
};

export const InvalidOAuthConfig = Template.bind({});
InvalidOAuthConfig.args = {
    errorCode: "invalid_oauth_config",
};
InvalidOAuthConfig.storyName = "Invalid OAuth Config";

export const NoAuthCodeProvided = Template.bind({});
NoAuthCodeProvided.args = {
    errorCode: "no_auth_code_provided",
};

export const NoStateIdProvided = Template.bind({});
NoStateIdProvided.args = {
    errorCode: "no_state_id_provided",
};

export const GeneralServiceError = Template.bind({});
GeneralServiceError.args = {
    errorCode: "general_service_error",
};
