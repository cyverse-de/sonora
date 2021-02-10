/**
 * @author aramsey
 *
 * A dialog that allows users to request to join a team with an optional
 * message to send to the team admin
 */
import React, { useState } from "react";

import { build, FormMultilineTextField } from "@cyverse-de/ui-lib";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Field, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import ids from "../ids";
import isQueryLoading from "components/utils/isQueryLoading";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles";
import { requestJoinTeam } from "serviceFacades/groups";
import ErrorTypographyWithDialog from "../../utils/error/ErrorTypographyWithDialog";
import { groupShortName } from "../util";

const useStyles = makeStyles(styles);

function JoinTeamDialog(props) {
    const { teamName, open, onClose } = props;
    const { t } = useTranslation(["teams", "common"]);
    const classes = useStyles();

    const [joinError, setJoinError] = useState(null);

    const baseId = ids.JOIN_TEAM.DIALOG;
    const teamShortName = groupShortName(teamName);

    const [requestJoinTeamMutation, { status: joinTeamStatus }] = useMutation(
        requestJoinTeam,
        {
            onSuccess: (data, { resetForm }) => {
                resetForm();
                onClose();
            },
            onError: (error) => {
                setJoinError({ message: t("joinTeamError"), object: error });
            },
        }
    );

    const handleSubmit = ({ message }, { resetForm }) => {
        setJoinError(null);
        requestJoinTeamMutation({ name: teamName, message, resetForm });
    };

    const isLoading = isQueryLoading(joinTeamStatus);

    return (
        <Formik initialValues={{ message: "" }} onSubmit={handleSubmit}>
            {({ handleSubmit }) => {
                return (
                    <Dialog
                        open={open}
                        onClose={onClose}
                        maxWidth="sm"
                        fullWidth
                    >
                        <DialogTitle>
                            {t("joinDlgTitle", { name: teamShortName })}
                            <IconButton
                                aria-label={t("common:cancel")}
                                onClick={onClose}
                                size="small"
                                edge="end"
                                classes={{ root: classes.closeButton }}
                            >
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Typography
                                classes={{ root: classes.bottomPadding }}
                            >
                                {t("joinDlgInfo", { name: teamShortName })}
                            </Typography>
                            <Field
                                id={build(baseId, ids.JOIN_MSG)}
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
                                                        id={build(
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
                        </DialogContent>

                        <DialogActions>
                            <Button
                                id={build(baseId, ids.BUTTONS.CANCEL_BTN)}
                                onClick={onClose}
                            >
                                {t("common:cancel")}
                            </Button>
                            <Button
                                id={build(baseId, ids.BUTTONS.JOIN_BTN)}
                                color="primary"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                {t("join")}
                            </Button>
                        </DialogActions>
                    </Dialog>
                );
            }}
        </Formik>
    );
}

export default JoinTeamDialog;
