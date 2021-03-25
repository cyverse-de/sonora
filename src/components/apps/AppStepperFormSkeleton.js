/**
 * A Loading Mask for the App Editor and Launch Forms.
 *
 * @author psarando
 */
import React from "react";

import { StepperSkeleton } from "./AppStepper";
import AppStepDisplay, { BottomNavigationSkeleton } from "./AppStepDisplay";

import {
    Button,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export default (props) => {
    const { baseId, header } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    return (
        <Paper>
            {header && (
                <Skeleton variant="text" width="40%">
                    <Typography variant="h6">&nbsp;</Typography>
                    <Button />
                </Skeleton>
            )}
            <StepperSkeleton baseId={baseId} />
            <AppStepDisplay
                step={1}
                label="..."
                bottomNavigation={!isMobile && <BottomNavigationSkeleton />}
            >
                <Skeleton variant="text" width="100%">
                    <TextField fullWidth label="..." helperText="..." />
                </Skeleton>
                <Skeleton variant="rect" width="100%">
                    <TextField
                        fullWidth
                        rows={3}
                        multiline
                        label="..."
                        helperText="..."
                    />
                </Skeleton>
                <Skeleton variant="text" width="100%">
                    <TextField fullWidth label="..." helperText="..." />
                </Skeleton>
            </AppStepDisplay>
        </Paper>
    );
};
