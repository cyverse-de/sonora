/**
 * @author psarando
 *
 * An App Launch Wizard for collecting and validating user input of app
 * parameters and resource requirements as an alaysis submission.
 */
import React from "react";

import constants from "./constants";
import messages from "./messages";

import AppInfo from "./AppInfo";
import AppLaunchForm from "./AppLaunchForm";

import { withI18N } from "@cyverse-de/ui-lib";

const deprecatedParamTypes = Object.values(constants.DEPRECATED_PARAM_TYPE);

function AppLaunchWizard(props) {
    const { app } = props;

    const hasDeprecatedParams = app?.groups?.find((group) =>
        group.parameters?.find((param) =>
            deprecatedParamTypes.includes(param.type)
        )
    );

    return (
        <>
            <AppInfo app={app} hasDeprecatedParams={hasDeprecatedParams} />

            {app && !(app.deleted || app.disabled || hasDeprecatedParams) && (
                <AppLaunchForm {...props} />
            )}
        </>
    );
}

export default withI18N(AppLaunchWizard, messages);
