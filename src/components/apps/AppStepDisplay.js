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
    makeStyles,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    cardContent: {
        overflow: "auto",
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(1),
        },
    },
    cardActions: {
        justifyContent: "flex-end",
    },
}));

export const BottomNavigationSkeleton = React.forwardRef((props, ref) => (
    <Skeleton variant="rect" width="100%" ref={ref}>
        <ButtonGroup>
            <Button>&nbsp;</Button>
            <Button>&nbsp;</Button>
        </ButtonGroup>
    </Skeleton>
));

const AppStepDisplay = (props) => {
    const {
        step,
        label,
        helpText,
        children,
        actions,
        bottomNavigation,
        bottomOffset,
    } = props;

    const { t } = useTranslation("launch");
    const classes = useStyles();

    return (
        <Card style={{ marginBottom: bottomOffset && `${bottomOffset}px` }}>
            <CardHeader
                title={t("stepLabel", { step, label })}
                titleTypographyProps={{
                    variant: "subtitle1",
                    color: "primary",
                }}
                subheader={helpText}
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
