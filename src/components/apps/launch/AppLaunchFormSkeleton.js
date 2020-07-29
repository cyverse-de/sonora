/**
 * @author psarando
 *
 * A Loading Mask for the App Launch Form.
 */
import React from "react";

import ids from "./ids";

import styles from "./styles";

import { build as buildDebugId } from "@cyverse-de/ui-lib";

import {
    BottomNavigation,
    BottomNavigationAction,
    Container,
    Step,
    Stepper,
    StepButton,
    TextField,
    Typography,
    makeStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(styles);

export const StepperSkeleton = React.forwardRef(({ baseId }, ref) => (
    <Skeleton
        id={buildDebugId(baseId, ids.LOADING_SKELETON)}
        width="100%"
        ref={ref}
    >
        <Stepper alternativeLabel nonLinear>
            <Step>
                <StepButton>&nbsp;</StepButton>
            </Step>
        </Stepper>
    </Skeleton>
));

export const BottomNavigationSkeleton = React.forwardRef((props, ref) => (
    <Skeleton variant="rect" width="100%" ref={ref}>
        <BottomNavigation>
            <BottomNavigationAction />
        </BottomNavigation>
    </Skeleton>
));

export default ({ baseId }) => {
    const classes = useStyles();

    return (
        <>
            <StepperSkeleton baseId={baseId} />
            <Container
                component="div"
                className={classes.stepContent}
                maxWidth="md"
            >
                <Container component="fieldset">
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
            </Container>
            <BottomNavigationSkeleton />
        </>
    );
};
