/**
 * @author psarando, sriram
 *
 * A button that uses the next/router to navigate back to the previous page in
 * the browser's history.
 */
import React from "react";

import { useRouter } from "next/router";
import { useTranslation } from "i18n";

import { Button, Hidden, useMediaQuery, useTheme } from "@material-ui/core";

import { ArrowBack } from "@material-ui/icons";

export default function BackButton(props) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("common");

    return (
        <Button
            color="primary"
            variant={isMobile ? "text" : "contained"}
            size="small"
            startIcon={<ArrowBack fontSize="small" />}
            onClick={() => router && router.back()}
            {...props}
        >
            <Hidden xsDown>{t("back")}</Hidden>
        </Button>
    );
}
