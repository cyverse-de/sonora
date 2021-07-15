/**
 * @author sriram
 *
 * A component that renders user menu
 *
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import ids from "./ids";
import constants from "../../constants";

import ExternalLink from "components/utils/ExternalLink";
import { build } from "@cyverse-de/ui-lib";

import {
    Avatar,
    Button,
    Divider,
    Grid,
    Paper,
    Typography,
    useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(0.2),
            backgroundColor: theme.palette.main_sidebar,
        },
    },

    typography: {
        color: theme.palette.main_sidebar,
        [theme.breakpoints.down("xs")]: {
            color: theme.palette.info.contrastText,
        },
    },

    divider: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(0.5),
        },
    },

    button: {
        color: theme.palette.primary.main,
        [theme.breakpoints.down("xs")]: {
            color: theme.palette.info.contrastText,
        },
    },
}));
export default function UserMenu(props) {
    const {
        profile: {
            id,
            attributes: { email, name },
        },
        onLogoutClick,
        onManageAccountClick,
        baseId,
    } = props;
    const { t } = useTranslation(["common"]);
    const theme = useTheme();
    const classes = useStyles();
    return (
        <Paper className={classes.paper}>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Avatar
                    id={build(baseId, ids.AVATAR)}
                    style={{
                        color: theme.palette.success.contrastText,
                        backgroundColor: theme.palette.success.main,
                    }}
                >
                    {id.charAt(0).toUpperCase()}
                </Avatar>
                <Grid item>
                    <Typography
                        id={build(baseId, ids.NAME_LBL)}
                        variant="caption"
                        className={classes.typography}
                    >
                        {name}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        id={build(baseId, ids.USERNAME_LBL)}
                        variant="caption"
                        className={classes.typography}
                    >
                        {t("username")}: {id}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        id={build(baseId, ids.EMAIL_LBL)}
                        variant="caption"
                        className={classes.typography}
                    >
                        {email}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        id={build(baseId, ids.MANAGE_ACCOUNT_BTN)}
                        variant="outlined"
                        className={classes.button}
                        onClick={onManageAccountClick}
                        size="small"
                    >
                        {t("manageAccount")}
                    </Button>
                </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Grid item>
                    <Button
                        id={build(baseId, ids.LOGOUT_BUTTON)}
                        variant="outlined"
                        className={classes.button}
                        onClick={onLogoutClick}
                        size="small"
                    >
                        {t("logout")}
                    </Button>
                </Grid>
            </Grid>
            <Divider className={classes.divider} />
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Grid item>
                    <ExternalLink
                        id={build(baseId, ids.POLICY_LINK)}
                        href={constants.CYVERSE_POLICY_URL}
                    >
                        <Typography
                            variant="caption"
                            className={classes.typography}
                        >
                            {t("policies")}
                        </Typography>
                    </ExternalLink>
                </Grid>
                <Grid item>
                    <Typography variant="caption">•</Typography>
                </Grid>
                <Grid item>
                    <ExternalLink
                        id={build(baseId, ids.ABOUT_LINK)}
                        href={constants.CYVERSE_ABOUT_URL}
                    >
                        <Typography
                            variant="caption"
                            className={classes.typography}
                        >
                            {t("about")}
                        </Typography>
                    </ExternalLink>
                </Grid>
            </Grid>
        </Paper>
    );
}
