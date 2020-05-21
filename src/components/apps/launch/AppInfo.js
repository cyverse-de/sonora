/**
 * @author psarando
 *
 * The App Launch Wizard header that displays the app name and description.
 */
import React from "react";

import { intercomShow } from "../../../common/intercom";

import ids from "./ids";

import { build as buildDebugId, getMessage } from "@cyverse-de/ui-lib";

import { Box, Link, Paper, Toolbar, Typography } from "@material-ui/core";

const AppInfo = ({ app, baseId, hasDeprecatedParams }) => {
    const unavailableMsgKey = app?.deleted
        ? "appDeprecated"
        : app?.disabled
        ? "appUnavailable"
        : hasDeprecatedParams
        ? "appParamsDeprecated"
        : null;

    return (
        <>
            <Toolbar component={Paper}>
                <Typography variant="h6">{app?.name}</Typography>
            </Toolbar>

            <Box m={2}>
                <Typography variant="body2" gutterBottom>
                    {app?.description}
                </Typography>

                {(app?.deleted || app?.disabled || hasDeprecatedParams) && (
                    <Typography color="error" variant="body1" gutterBottom>
                        {getMessage(unavailableMsgKey, {
                            values: {
                                support: (...chunks) => (
                                    <Link
                                        id={buildDebugId(
                                            baseId,
                                            ids.BUTTONS.CONTACT_SUPPORT
                                        )}
                                        component="button"
                                        variant="body1"
                                        onClick={intercomShow}
                                    >
                                        {chunks}
                                    </Link>
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
