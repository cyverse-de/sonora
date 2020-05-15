/**
 * @author psarando
 *
 * The App Launch Wizard header that displays the app name and description.
 */
import React from "react";

import { getMessage } from "@cyverse-de/ui-lib";

import { AppBar, Box, Toolbar, Typography } from "@material-ui/core";

const AppInfo = ({ app, hasDeprecatedParams }) => {
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

            <Box m={2}>
                <Typography variant="body2" gutterBottom>
                    {app?.description}
                </Typography>

                {(app?.deleted || app?.disabled || hasDeprecatedParams) && (
                    <Typography variant="body1" gutterBottom>
                        {getMessage(unavailableMsgKey, {
                            values: {
                                support: (...chunks) => (
                                    <a href="mailto:support@cyverse.org">
                                        {chunks}
                                    </a>
                                ),
                            },
                        })}
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default AppInfo;
