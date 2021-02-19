/**
 * @author psarando
 *
 * An App Launch Wizard for collecting and validating user input of app
 * parameters and resource requirements as an alaysis submission.
 */
import React from "react";

import AppInfo from "./AppInfo";
import AppLaunchForm from "./AppLaunchForm";
import AppLaunchFormSkeleton from "./AppLaunchFormSkeleton";

import { DeprecatedParamTypes } from "components/models/AppParamTypes";
import useComponentHeight from "components/utils/useComponentHeight";

import { Divider, Paper } from "@material-ui/core";

const deprecatedParamTypes = Object.values(DeprecatedParamTypes);

function AppLaunchWizard(props) {
    const { baseId, app, appError, loading } = props;

    const hasDeprecatedParams = app?.groups?.find((group) =>
        group.parameters?.find((param) =>
            deprecatedParamTypes.includes(param.type)
        )
    );
    const appInfoRef = React.useRef(null);
    const [appInfoHeight, setAppInfoRef] = useComponentHeight();

    React.useEffect(() => {
        setAppInfoRef(appInfoRef);
    }, [appInfoRef, setAppInfoRef]);

    return (
        <Paper>
            <AppInfo
                baseId={baseId}
                loading={loading}
                loadingError={appError}
                app={app}
                hasDeprecatedParams={hasDeprecatedParams}
                ref={appInfoRef}
            />
            <Divider />
            {loading ? (
                <AppLaunchFormSkeleton baseId={baseId} />
            ) : (
                app &&
                !(app.deleted || app.disabled || hasDeprecatedParams) && (
                    <AppLaunchForm {...props} appInfoHeight={appInfoHeight} />
                )
            )}
        </Paper>
    );
}

export default AppLaunchWizard;
