/**
 * @author sriram
 *
 * A component that renders user menu
 *
 *
 */
import React from "react";
import { useTranslation } from "i18n";

import ExternalLink from "components/utils/ExternalLink";

import {
    Avatar,
    Button,
    Divider,
    Grid,
    Paper,
    Typography,
    useTheme,
} from "@material-ui/core";

export default function UserMenu(props) {
    const {
        profile: {
            id,
            attributes: { email, name },
        },
        onLogoutClick,
        onManageAccountClick,
    } = props;
    const { t } = useTranslation(["common"]);
    const theme = useTheme();
    return (
        <Paper style={{ padding: theme.spacing(1) }}>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Avatar
                    style={{
                        color: theme.palette.success.contrastText,
                        backgroundColor: theme.palette.success.main,
                    }}
                >
                    {id.charAt(0).toUpperCase()}
                </Avatar>
                <Grid item>
                    <Typography
                        variant="caption"
                        style={{ color: theme.palette.info.main }}
                    >
                        {name}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="caption"
                        style={{ color: theme.palette.info.main }}
                    >
                        Username: {id}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="caption"
                        style={{ color: theme.palette.info.main }}
                    >
                        Email: {email}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        style={{ color: theme.palette.primary.main }}
                        onClick={onManageAccountClick}
                    >
                        Manage your Cyverse Account
                    </Button>
                </Grid>
            </Grid>
            <Divider style={{ margin: theme.spacing(1) }} />
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Grid item>
                    <Button
                        variant="outlined"
                        style={{ color: theme.palette.primary.main }}
                        onClick={onLogoutClick}
                    >
                        Logout
                    </Button>
                </Grid>
            </Grid>
            <Divider style={{ margin: theme.spacing(1) }} />
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                spacing={1}
            >
                <Grid item>
                    <ExternalLink href="https://cyverse.org/policies">
                        <Typography variant="caption">Polices</Typography>
                    </ExternalLink>
                </Grid>
                <Grid item>
                    <Typography variant="caption">.</Typography>
                </Grid>
                <Grid item>
                    <ExternalLink href="https://cyverse.org/about">
                        <Typography variant="caption">About</Typography>
                    </ExternalLink>
                </Grid>
            </Grid>
        </Paper>
    );
}
