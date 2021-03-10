/**
 * @author aramsey
 *
 * A dialog that contains a form users can fill out to send an email to support
 * regarding their VICE instance if it encountered an error while launching
 * or is taking too long to launch.
 *
 * Users can add a comment and k8s details will automatically be included
 * in the email.
 */
import React, { useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import { Button, TextField, Typography } from "@material-ui/core";
import { useMutation } from "react-query";

import DEDialog from "components/utils/DEDialog";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import GridLoading from "components/utils/GridLoading";
import { useConfig } from "contexts/config";
import { useUserProfile } from "contexts/userProfile";
import DetailsContent from "./DetailsContent";
import { useTranslation } from "i18n";
import ids from "./ids";
import { sendSupportEmail } from "serviceFacades/support";
import { findContainerStatus } from "./util";

function ContactSupportDialog(props) {
    const {
        baseId,
        open,
        onClose,
        deployments,
        configMaps,
        services,
        ingresses,
        pods,
        ready,
        progressMessage,
    } = props;
    const { t } = useTranslation(["vice-loading", "common"]);
    const [config] = useConfig();

    const [comment, setComment] = useState("");
    const [supportEmailError, setSupportEmailError] = useState(null);
    const [userProfile] = useUserProfile();
    const deployment = deployments?.[0];
    const appName = deployment?.appName;

    const onCommentChange = (event) => {
        setComment(event.target.value);
    };

    const [sendSupportEmailMutation, { isLoading }] = useMutation(
        sendSupportEmail,
        {
            onSuccess: onClose,
            onError: (error) => {
                setSupportEmailError({
                    error: error,
                    message: t("sendSupportEmailError"),
                });
            },
        }
    );

    const onContactSupport = () => {
        setSupportEmailError(null);

        const pod = pods?.[0];
        const [initContainerStatus] = findContainerStatus(
            pod,
            config?.vice?.initContainerName
        );
        const [viceProxyStatus] = findContainerStatus(
            pod,
            config?.vice?.viceProxyContainerName
        );
        const [inputFilesStatus] = findContainerStatus(
            pod,
            config?.vice?.inputFilesContainerName
        );
        const [analysisStatus] = findContainerStatus(
            pod,
            config?.vice?.analysisContainerName
        );

        const supportRequest = {
            email: userProfile?.attributes.email,
            subject: t("viceSupportEmailSubject", {
                userId: userProfile?.id,
                appName,
            }),
            fields: {
                comment,
                ...deployment,
                initContainer: initContainerStatus?.state,
                podViceProxy: viceProxyStatus?.state,
                podInputFiles: inputFilesStatus?.state,
                podAnalysis: analysisStatus?.state,
                configMapsDone: configMaps?.length > 1,
                ingressDone: ingresses?.length > 0,
                serviceDone: services?.length > 0,
                urlReady: ready,
                displayMessage: progressMessage,
            },
        };

        sendSupportEmailMutation({ supportRequest });
    };

    return (
        <DEDialog
            baseId={baseId}
            open={open}
            onClose={onClose}
            title={t("viceContactSupportTitle")}
            actions={
                <>
                    <Button
                        id={build(baseId, ids.CANCEL_BTN)}
                        onClick={onClose}
                    >
                        {t("common:cancel")}
                    </Button>
                    <Button
                        color="primary"
                        id={build(baseId, ids.CONTACT_SUPPORT_BTN)}
                        onClick={onContactSupport}
                    >
                        {t("common:submit")}
                    </Button>
                </>
            }
        >
            {isLoading && (
                <GridLoading
                    rows={10}
                    baseId={build(baseId, ids.LOADING_SKELETON)}
                />
            )}
            {!isLoading && (
                <>
                    {supportEmailError && (
                        <ErrorTypographyWithDialog
                            baseId={build(baseId, ids.SUPPORT_EMAIL_ERROR)}
                            errorObject={supportEmailError.error}
                            errorMessage={supportEmailError.message}
                        />
                    )}
                    <Typography gutterBottom>
                        {t("optionalCommentHelpText", { appName })}
                    </Typography>
                    <TextField
                        id={build(baseId, ids.SUPPORT_EMAIL_COMMENT)}
                        multiline
                        rows={3}
                        variant="outlined"
                        value={comment}
                        onChange={onCommentChange}
                        label={t("optionalComment")}
                        fullWidth
                    />
                    <DetailsContent
                        deployments={deployments}
                        configMaps={configMaps}
                        services={services}
                        ingresses={ingresses}
                        pods={pods}
                    />
                    {supportEmailError && (
                        <ErrorTypographyWithDialog
                            baseId={build(baseId, ids.SUPPORT_EMAIL_ERROR)}
                            errorObject={supportEmailError.error}
                            errorMessage={supportEmailError.message}
                        />
                    )}
                </>
            )}
        </DEDialog>
    );
}

export default ContactSupportDialog;
