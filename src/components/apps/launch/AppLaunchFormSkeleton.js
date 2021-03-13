/**
 * @author psarando, sriram
 *
 * A Loading Mask for the App Launch Form.
 */
import React from "react";

import styles from "./styles";

import { StepperSkeleton } from "../AppStepper";
import { BottomNavigationSkeleton } from "../AppStepDisplay";

import {
    Box,
    Container,
    TextField,
    Typography,
    makeStyles,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(styles);

export default ({ baseId }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    return (
        <>
            <StepperSkeleton baseId={baseId} />
            <Box component="div" className={classes.stepContainer}>
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
            </Box>
            {!isMobile && <BottomNavigationSkeleton />}
        </>
    );
};
