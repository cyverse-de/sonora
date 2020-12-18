/**
 * @author psarando, sriram
 *
 * A button that uses the next/router to navigate back to the previous page in
 * the browser's history.
 */
import React from "react";

import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import { Button, IconButton, useMediaQuery, useTheme } from "@material-ui/core";

import { ArrowBack } from "@material-ui/icons";

export default function BackButton(props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("common");

    const onClick = () => router && router.back();

    return isMobile ? (
        <IconButton
            color="primary"
            edge="start"
            aria-label={t("back")}
            onClick={onClick}
            {...props}
        >
            <ArrowBack />
        </IconButton>
    ) : (
        <Button
            color="primary"
            variant={"contained"}
            size="small"
            startIcon={<ArrowBack fontSize="small" />}
            onClick={onClick}
            {...props}
        >
            {t("back")}
        </Button>
    );
}
