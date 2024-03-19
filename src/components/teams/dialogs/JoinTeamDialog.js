/**
 * @author aramsey
 *
 * A dialog that allows users to request to join a team with an optional
 * message to send to the team admin
 */
import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import FormMultilineTextField from "components/forms/FormMultilineTextField";
import {
    Button,
    CircularProgress,
    InputAdornment,
    Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { Field, Formik } from "formik";
import { useTranslation } from "i18n";
import { useMutation } from "react-query";

import DEDialog from "components/utils/DEDialog";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import isQueryLoading from "components/utils/isQueryLoading";
import ids from "../ids";
import { requestJoinTeam } from "serviceFacades/groups";
import styles from "../styles";
import { groupShortName } from "../util";
import { trackIntercomEvent, IntercomEvents } from "common/intercom";

const useStyles = makeStyles()(styles);

function JoinTeamDialog(props) {
    const { teamName, open, onClose } = props;
    const { t } = useTranslation(["teams", "common"]);
    const { classes } = useStyles();

    const [joinError, setJoinError] = useState(null);

    const baseId = ids.JOIN_TEAM.DIALOG;
    const teamShortName = groupShortName(teamName);

    const { mutate: requestJoinTeamMutation, status: joinTeamStatus } =
        useMutation(requestJoinTeam, {
            onSuccess: (data, { resetForm }) => {
                trackIntercomEvent(IntercomEvents.REQUESTED_JOIN_TEAM, data);
                resetForm();
                onClose();
            },
            onError: (error) => {
                setJoinError({ message: t("joinTeamError"), object: error });
            },
        });

    const handleSubmit = ({ message }, { resetForm }) => {
        setJoinError(null);
        requestJoinTeamMutation({ name: teamName, message, resetForm });
    };

    const isLoading = isQueryLoading(joinTeamStatus);

    return (
        <Formik initialValues={{ message: "" }} onSubmit={handleSubmit}>
            {({ handleSubmit }) => {
                return (
                    <DEDialog
                        baseId={baseId}
                        open={open}
                        onClose={onClose}
                        title={t("joinDlgTitle", { name: teamShortName })}
                        actions={
                            <>
                                <Button
                                    id={buildID(baseId, ids.BUTTONS.CANCEL_BTN)}
                                    onClick={onClose}
                                >
                                    {t("common:cancel")}
                                </Button>
                                <Button
                                    id={buildID(baseId, ids.BUTTONS.JOIN_BTN)}
                                    variant="contained"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    {t("join")}
                                </Button>
                            </>
                        }
                    >
                        <Typography classes={{ root: classes.bottomPadding }}>
                            {t("joinDlgInfo", { name: teamShortName })}
                        </Typography>
                        <Field
                            id={buildID(baseId, ids.JOIN_MSG)}
                            name="message"
                            label={t("joinDlgLabel")}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                            InputProps={{
                                readOnly: isLoading,
                                endAdornment: (
                                    <>
                                        {isLoading && (
                                            <InputAdornment position="start">
                                                <CircularProgress
                                                    id={buildID(
                                                        baseId,
                                                        ids.JOIN_MSG,
                                                        ids.LOADING_SKELETON
                                                    )}
                                                    color="inherit"
                                                    size={20}
                                                />
                                            </InputAdornment>
                                        )}
                                    </>
                                ),
                            }}
                            component={FormMultilineTextField}
                        />
                        {joinError && (
                            <ErrorTypographyWithDialog
                                errorMessage={joinError?.message}
                                errorObject={joinError?.object}
                            />
                        )}
                    </DEDialog>
                );
            }}
        </Formik>
    );
}

export default JoinTeamDialog;
