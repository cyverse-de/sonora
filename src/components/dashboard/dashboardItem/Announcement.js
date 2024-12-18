/**
 * A dashboard item for displaying important announcements.
 *
 * @author psarando
 */
import React from "react";

import { useTranslation, Trans } from "i18n";

import { QUOTA_ENFORCE_URL } from "../constants";
import ExternalLink from "components/utils/ExternalLink";

import {
    Card,
    CardHeader,
    CardContent,
    Typography,
    useTheme,
} from "@mui/material";

import AnnounceIcon from "@mui/icons-material/Warning";

export default function Announcement() {
    const theme = useTheme();
    const { t } = useTranslation("dashboard");

    return (
        <Card
            style={{
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2),
            }}
        >
            <CardHeader
                avatar={
                    <AnnounceIcon
                        style={{ color: theme.palette.gold }}
                        fontSize="large"
                    />
                }
                title={
                    <Typography variant="subtitle2">
                        {t("dataStorageLimits")}
                    </Typography>
                }
                style={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                }}
            />
            <CardContent>
                <Typography variant="body2" gutterBottom>
                    <Trans
                        t={t}
                        i18nKey="quotaEnforceAnnouncement"
                        components={{
                            infoLink: <ExternalLink href={QUOTA_ENFORCE_URL} />,
                        }}
                    />
                </Typography>
            </CardContent>
        </Card>
    );
}
