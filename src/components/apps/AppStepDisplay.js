/**
 * App Step Content for the Launch and Editor forms.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation } from "i18n";

import {
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CardHeader,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import { Skeleton } from "@mui/material";

const useStyles = makeStyles()((theme) => ({
    cardContent: {
        overflow: "auto",
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
        },
    },
    cardActions: {
        justifyContent: "flex-end",
    },
}));

export const BottomNavigationSkeleton = React.forwardRef(
    function BottomNavigationSkeleton(_props, ref) {
        return (
            <Skeleton variant="rectangular" width="100%" ref={ref}>
                <ButtonGroup>
                    <Button>&nbsp;</Button>
                    <Button>&nbsp;</Button>
                </ButtonGroup>
            </Skeleton>
        );
    }
);

const AppStepDisplay = (props) => {
    const {
        step,
        label,
        helpText,
        errorText,
        children,
        actions,
        bottomNavigation,
        bottomOffset,
    } = props;

    const { t } = useTranslation("launch");
    const { classes } = useStyles();

    return (
        <Card style={{ marginBottom: bottomOffset && `${bottomOffset}px` }}>
            <CardHeader
                title={t("stepLabel", { step, label })}
                titleTypographyProps={{
                    variant: "subtitle1",
                    color: "primary",
                }}
                subheader={errorText || helpText}
                subheaderTypographyProps={{
                    color: errorText ? "error" : "textSecondary",
                }}
                action={actions}
            />
            <CardContent className={classes.cardContent}>
                {children}
            </CardContent>
            <CardActions disableSpacing className={classes.cardActions}>
                {bottomNavigation}
            </CardActions>
        </Card>
    );
};

export default AppStepDisplay;
