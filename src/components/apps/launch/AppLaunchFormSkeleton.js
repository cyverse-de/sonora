/**
 * @author psarando, sriram
 *
 * A Loading Mask for the App Launch Form.
 */
import React from "react";

import ids from "./ids";
import styles from "./styles";

import { build as buildDebugId } from "@cyverse-de/ui-lib";

import {
    Button,
    Container,
    MobileStepper,
    Step,
    Stepper,
    StepButton,
    TextField,
    Toolbar,
    Typography,
    makeStyles,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(styles);

export const StepperSkeleton = React.forwardRef(({ baseId }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    if (isMobile) {
        return (
            <Skeleton
                id={buildDebugId(baseId, ids.LOADING_SKELETON)}
                width="100%"
                ref={ref}
            >
                <MobileStepper
                    activeStep={0}
                    ref={ref}
                    steps={4}
                    position="bottom"
                    nextButton={<Button size="small">&nbsp;</Button>}
                    backButton={<Button size="small">&nbps;</Button>}
                />
            </Skeleton>
        );
    } else {
        return (
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
        );
    }
});

export const BottomNavigationSkeleton = React.forwardRef((props, ref) => (
    <Skeleton variant="rect" width="100%" ref={ref}>
        <Toolbar></Toolbar>
    </Skeleton>
));

export default ({ baseId }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <>
            <StepperSkeleton baseId={baseId} />
            <Container component="div" className={classes.stepContainer}>
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
                </Container>
            </Container>
            {!isMobile && <BottomNavigationSkeleton />}
        </>
    );
};
