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
} from "@mui/material";
import { Skeleton } from "@mui/material";

const AppStepperFormSkeleton = (props) => {
    const { baseId, header } = props;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                    <TextField
                        variant="standard"
                        fullWidth
                        label="..."
                        helperText="..."
                    />
                </Skeleton>
                <Skeleton variant="rectangular" width="100%">
                    <TextField
                        variant="standard"
                        fullWidth
                        rows={3}
                        multiline
                        label="..."
                        helperText="..."
                    />
                </Skeleton>
                <Skeleton variant="text" width="100%">
                    <TextField
                        variant="standard"
                        fullWidth
                        label="..."
                        helperText="..."
                    />
                </Skeleton>
            </AppStepDisplay>
        </Paper>
    );
};

export default AppStepperFormSkeleton;
