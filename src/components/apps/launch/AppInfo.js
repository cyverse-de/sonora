/**
 * @author psarando
 *
 * The App Launch Wizard header that displays the app name and description.
 */
import React from "react";

import { injectIntl } from "react-intl";

import { formatMessage } from "@cyverse-de/ui-lib";

import { AppBar, Toolbar, Typography } from "@material-ui/core";

const AppInfo = injectIntl(({ intl, app, hasDeprecatedParams }) => {
    const unavailableMsgKey = app?.deleted
        ? "appDeprecated"
        : app?.disabled
        ? "appUnavailable"
        : hasDeprecatedParams
        ? "appParamsDeprecated"
        : null;

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">{app?.name}</Typography>
                </Toolbar>
            </AppBar>

            <Typography variant="body1" gutterBottom>
                {app?.description}
            </Typography>

            {(app?.deleted || app?.disabled || hasDeprecatedParams) && (
                <Typography
                    variant="body2"
                    gutterBottom
                    dangerouslySetInnerHTML={{
                        __html: formatMessage(intl, unavailableMsgKey),
                    }}
                />
            )}
        </>
    );
});

export default AppInfo;
