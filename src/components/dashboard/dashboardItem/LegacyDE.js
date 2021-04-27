import React from "react";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Typography,
} from "@material-ui/core";
import { FiberNew } from "@material-ui/icons";

import DELink from "components/utils/DELink";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import ids from "../ids";
import { Trans, useTranslation } from "i18n";
import useStyles from "./styles";

function LegacyDE(props) {
    const { parentId, onDismiss } = props;
    const [userProfile] = useUserProfile();
    const [config] = useConfig();
    const baseId = build(parentId, ids.LEGACY_CARD);
    const classes = useStyles();

    const legacyLink = config?.legacyDeUrl;

    const { t } = useTranslation("dashboard");

    return (
        <Card id={baseId} classes={{ root: classes.legacyCard }}>
            <CardHeader
                avatar={<FiberNew color="primary" />}
                title={
                    <Typography variant="subtitle2">
                        {t("legacyDeTitle")}
                    </Typography>
                }
            />
            <CardContent>
                <Typography variant="body2" gutterBottom>
                    <Trans
                        t={t}
                        i18nKey="legacyDeMessage"
                        tOptions={{
                            context: userProfile?.id ? "loggedIn" : "loggedOut",
                        }}
                        components={{
                            legacyLink: (
                                <DELink
                                    text={t("legacyDeName")}
                                    href={legacyLink}
                                />
                            ),
                            break: <br />,
                            bold: <strong />,
                        }}
                    />
                </Typography>
            </CardContent>
            {userProfile?.id && (
                <CardActions>
                    <Button
                        id={build(baseId, ids.DISMISS_BTN)}
                        size="small"
                        onClick={onDismiss}
                    >
                        {t("dismiss")}
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

export default LegacyDE;
