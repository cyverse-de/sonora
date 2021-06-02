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
import { Button, IconButton, useMediaQuery, useTheme } from "@material-ui/core";

import { ArrowBack } from "@material-ui/icons";

export default function BackButton(props) {
    const { dirty = false } = props;
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const { t } = useTranslation("common");

    const [showConfirmationDialog, setShowConfirmationDialog] =
        React.useState(false);

    const onClick = () => router && router.back();

    return isMobile ? (
        <>
            <IconButton
                color="primary"
                edge="start"
                aria-label={t("back")}
                onClick={() => {
                    if (dirty) {
                        setShowConfirmationDialog(true);
                    } else {
                        onClick();
                    }
                }}
                {...props}
            >
                <ArrowBack />
            </IconButton>
            <ConfirmationDialog
                open={showConfirmationDialog}
                title={t("confirmDiscardChangesDialogHeader")}
                contentText={t("confirmDiscardChangesDialogMsg")}
                confirmButtonText={t("common:discard")}
                onConfirm={onClick}
                onClose={() => setShowConfirmationDialog(false)}
            />
        </>
    ) : (
        <>
            <Button
                color="primary"
                variant={"contained"}
                size="small"
                startIcon={<ArrowBack fontSize="small" />}
                onClick={() => {
                    if (dirty) {
                        setShowConfirmationDialog(true);
                    } else {
                        onClick();
                    }
                }}
                {...props}
            >
                {t("back")}
            </Button>
            <ConfirmationDialog
                open={showConfirmationDialog}
                title={t("confirmDiscardChangesDialogHeader")}
                contentText={t("confirmDiscardChangesDialogMsg")}
                confirmButtonText={t("common:discard")}
                onConfirm={onClick}
                onClose={() => setShowConfirmationDialog(false)}
            />
        </>
    );
}
