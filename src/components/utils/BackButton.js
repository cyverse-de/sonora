/**
 * @author psarando, sriram
 *
 * A button that uses the next/router to navigate back to the previous page in
 * the browser's history.
 */
import React from "react";

import { useRouter } from "next/router";
import { useTranslation } from "i18n";
import ConfirmationDialog from "components/utils/ConfirmationDialog";
import { Button, IconButton, useMediaQuery, useTheme } from "@mui/material";

import { ArrowBack } from "@mui/icons-material";

export default function BackButton({ dirty = false, ...props }) {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { t } = useTranslation("common");

    const [showConfirmationDialog, setShowConfirmationDialog] =
        React.useState(false);

    const onClick = () => {
        if (dirty) {
            setShowConfirmationDialog(true);
        } else {
            goBack();
        }
    };

    const goBack = () => {
        router && router.back();
    };

    const BackBtn = isMobile ? (
        <IconButton
            color="primary"
            edge="start"
            aria-label={t("back")}
            onClick={onClick}
            {...props}
            size="large"
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
    return (
        <>
            {BackBtn}
            <ConfirmationDialog
                open={showConfirmationDialog}
                title={t("confirmDiscardChangesDialogHeader")}
                contentText={t("confirmDiscardChangesDialogMsg")}
                confirmButtonText={t("common:discard")}
                onConfirm={goBack}
                onClose={() => setShowConfirmationDialog(false)}
            />
        </>
    );
}
