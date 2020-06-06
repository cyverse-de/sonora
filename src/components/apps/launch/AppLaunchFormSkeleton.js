/**
 * @author psarando
 *
 * A Loading Mask for the App Launch Form.
 */
import React from "react";

import {
    BottomNavigation,
    BottomNavigationAction,
    Container,
    Step,
    Stepper,
    StepButton,
    TextField,
    Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export default () => (
    <>
        <Skeleton variant="rect" width="100%">
            <Stepper alternativeLabel nonLinear>
                <Step>
                    <StepButton>&nbsp;</StepButton>
                </Step>
            </Stepper>
        </Skeleton>
        <Container component="fieldset" maxWidth="md">
            <Typography variant="h3" gutterBottom>
                <Skeleton variant="text" />
            </Typography>
            <Typography variant="h3" gutterBottom>
                <Skeleton variant="rect" width="100%">
                    <TextField fullWidth rows={3} />
                </Skeleton>
            </Typography>
            <Typography variant="h3" gutterBottom>
                <Skeleton variant="text" />
            </Typography>
            <Typography variant="h3" gutterBottom>
                <Skeleton variant="text" />
            </Typography>
        </Container>
        <Skeleton variant="rect" width="100%">
            <BottomNavigation>
                <BottomNavigationAction />
            </BottomNavigation>
        </Skeleton>
    </>
);
