import React from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography,
    useTheme,
} from "@material-ui/core";
import { NewReleases } from "@material-ui/icons";

import ids from "../ids";
import { Trans, useTranslation } from "i18n";
import useStyles from "./styles";
import { USER_SURVEY, PHX_BIO_URL } from "../constants";
import ExternalLink from "components/utils/ExternalLink";

function UserSurvey(props) {
    const { parentId } = props;

    const theme = useTheme();

    const baseId = buildID(parentId, ids.LEGACY_CARD);
    const classes = useStyles();

    const { t } = useTranslation("dashboard");

    return (
        <Card id={baseId} classes={{ root: classes.legacyCard }}>
            <CardHeader
                style={{ backgroundColor: theme.palette.secondary.main }}
                avatar={
                    <NewReleases
                        style={{ color: theme.palette.gold }}
                        fontSize="large"
                    />
                }
                title={
                    <Typography variant="subtitle2">
                        {t("cyverseTransition")}
                    </Typography>
                }
            />
            <CardContent>
                <Typography variant="body2" gutterBottom>
                    <Trans
                        t={t}
                        i18nKey="transitionMessage"
                        components={{
                            bio: <ExternalLink href={PHX_BIO_URL} />,
                        }}
                    />
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    id={buildID(baseId, ids.DISMISS_BTN)}
                    size="small"
                    onClick={() => window.open(USER_SURVEY, "_blank")}
                    variant="contained"
                    color="primary"
                >
                    {t("takeSurvey")}
                </Button>
            </CardActions>
        </Card>
    );
}

export default UserSurvey;
