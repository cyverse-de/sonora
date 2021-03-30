import React from "react";

import { useTranslation } from "i18n";
import { Card, CardHeader, Typography } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

function OAuthLinkingMessage({ baseId }) {
    const { t } = useTranslation("oauth");
    const avatar = <InfoIcon fontSize="large" color="primary" />;
    const title = (
        <Typography color="primary" variant="h6">
            {t("just_a_moment")}
        </Typography>
    );
    const subheader = (
        <Typography color="primary">{t("processing_request")}</Typography>
    );
    return (
        <Card id={baseId}>
            <CardHeader avatar={avatar} title={title} subheader={subheader} />
        </Card>
    );
}

export default OAuthLinkingMessage;
