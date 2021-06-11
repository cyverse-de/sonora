/**
 * @author aramsey
 *
 * A dialog for team admins to review requests to join their team.
 *
 * They are given the option to approve or deny a request.
 */
import React, { useState } from "react";

import { build } from "@cyverse-de/ui-lib";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    FormControlLabel,
    Grid,
    makeStyles,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useMutation } from "react-query";

import Privilege, { MemberPrivileges } from "components/models/Privilege";
import DEDialog from "components/utils/DEDialog";
import GridLabelValue from "components/utils/GridLabelValue";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import isQueryLoading from "components/utils/isQueryLoading";
import ids from "../ids";
import { useTranslation } from "i18n";
import {
    approveRequestJoinTeam,
    denyRequestJoinTeam,
} from "serviceFacades/groups";
import styles from "../styles";
import { useNotifications } from "contexts/pushNotifications";

const useStyles = makeStyles(styles);

const REQUEST_CHOICES = {
    APPROVE: "approve",
    DENY: "deny",
};

// Selector for which privilege to give a user, `read` or `admin`, when
// approving that user's request to join a team
function ApproveAction(props) {
    const { baseId, privilege, setPrivilege } = props;
    const { t } = useTranslation("notifications");
    const classes = useStyles();

    return (
        <FormControl className={classes.formControl}>
            <Select
                id={build(baseId, ids.ADMIN_JOIN_TEAM.PRIVILEGE_SELECT)}
                value={privilege}
                onChange={(event) => {
                    setPrivilege(event.target.value);
                }}
            >
                {MemberPrivileges.map((privilegeType) => (
                    <MenuItem
                        value={privilegeType.value}
                        id={build(
                            baseId,
                            ids.ADMIN_JOIN_TEAM.PRIVILEGE_SELECT,
                            ids.ADMIN_JOIN_TEAM[
                                privilegeType.value.toUpperCase()
                            ]
                        )}
                        key={build(
                            baseId,
                            ids.ADMIN_JOIN_TEAM.PRIVILEGE_SELECT,
                            ids.ADMIN_JOIN_TEAM[
                                privilegeType.value.toUpperCase()
                            ]
                        )}
                    >
                        {t(privilegeType.value)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

// TextField to provide an optional message to send a user when denying their
// request to join a team
function DenyAction(props) {
    const { baseId, denyMessage, setDenyMessage, userFullName } = props;
    const { t } = useTranslation("notifications");

    const handleMsgChange = (event) => {
        setDenyMessage(event.target.value);
    };

    return (
        <TextField
            id={build(baseId, ids.ADMIN_JOIN_TEAM.DENY_MSG)}
            label={t("denyRequestLabel", { name: userFullName })}
            multiline
            rows={3}
            margin="dense"
            variant="outlined"
            fullWidth={true}
            onChange={handleMsgChange}
            value={denyMessage}
        />
    );
}

function DialogContent(props) {
    const {
        baseId,
        handleRequestChange,
        mutationError,
        requestChoice,
        privilege,
        setPrivilege,
        denyMessage,
        setDenyMessage,
        request: {
            requester_name,
            team_name,
            requester_email,
            requester_message,
        } = {},
    } = props;
    const { t } = useTranslation(["notifications", "common"]);
    const classes = useStyles();

    return (
        <>
            {mutationError && (
                <ErrorTypographyWithDialog
                    baseId={baseId}
                    errorMessage={mutationError?.message}
                    errorObject={mutationError?.object}
                />
            )}

            <Typography component="div">{t("joinRequestIntro")}</Typography>

            <Paper classes={{ root: classes.paper }}>
                <Grid container spacing={1}>
                    <GridLabelValue label={t("teamLabel")}>
                        <Typography>{team_name}</Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("name")}>
                        <Typography>{requester_name}</Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("email")}>
                        <Typography>{requester_email}</Typography>
                    </GridLabelValue>
                    <GridLabelValue label={t("message")}>
                        <Typography>{requester_message}</Typography>
                    </GridLabelValue>
                </Grid>
            </Paper>

            <FormControl component="fieldset">
                <RadioGroup
                    aria-label={t("arialApproveOrDeny")}
                    value={requestChoice}
                    onChange={handleRequestChange}
                >
                    <FormControlLabel
                        id={build(baseId, ids.ADMIN_JOIN_TEAM.APPROVE)}
                        value={REQUEST_CHOICES.APPROVE}
                        control={<Radio />}
                        label={t("approveBtnText")}
                    />
                    <FormControlLabel
                        id={build(baseId, ids.ADMIN_JOIN_TEAM.DENY)}
                        value={REQUEST_CHOICES.DENY}
                        control={<Radio />}
                        label={t("denyBtnText")}
                    />
                </RadioGroup>
            </FormControl>

            <Card classes={{ root: classes.card }}>
                <CardHeader
                    title={
                        requestChoice === REQUEST_CHOICES.APPROVE
                            ? t("setPrivilegesHeading")
                            : t("denyRequestHeader")
                    }
                    titleTypographyProps={{ variant: "h6" }}
                />
                <CardContent>
                    <Typography>
                        {requestChoice === REQUEST_CHOICES.APPROVE
                            ? t("setPrivilegesText", {
                                  name: requester_name,
                                  team: team_name,
                              })
                            : t("denyRequestMessage", {
                                  name: requester_name,
                                  team: team_name,
                              })}
                    </Typography>
                </CardContent>
                <CardActions>
                    {requestChoice === REQUEST_CHOICES.APPROVE ? (
                        <ApproveAction
                            baseId={baseId}
                            privilege={privilege}
                            setPrivilege={setPrivilege}
                        />
                    ) : (
                        <DenyAction
                            baseId={baseId}
                            denyMessage={denyMessage}
                            setDenyMessage={setDenyMessage}
                            userFullName={requester_name}
                        />
                    )}
                </CardActions>
            </Card>

            {mutationError && (
                <ErrorTypographyWithDialog
                    baseId={baseId}
                    errorMessage={mutationError?.message}
                    errorObject={mutationError?.object}
                />
            )}
        </>
    );
}

function AdminJoinTeamRequestDialog(props) {
    const { open, onClose, request } = props;
    const { t } = useTranslation(["notifications", "common"]);
    const baseId = ids.ADMIN_JOIN_TEAM.DIALOG;

    const [requestChoice, setRequestChoice] = useState(REQUEST_CHOICES.APPROVE);
    const [privilege, setPrivilege] = useState(Privilege.READ.value);
    const [denyMessage, setDenyMessage] = useState("");
    const [mutationError, setMutationError] = useState(null);
    const { setSelectedNotification } = useNotifications();

    const handleClose = () => {
        setSelectedNotification(null);
        onClose();
    };

    const handleRequestChange = (event) => {
        setRequestChoice(event.target.value);
    };

    const [denyRequestMutation, { status: denyRequestStatus }] = useMutation(
        denyRequestJoinTeam,
        {
            onSuccess: handleClose,
            onError: (error) => {
                setMutationError({
                    message: t("denyRequestFailed"),
                    object: error,
                });
            },
        }
    );

    const [approveRequestMutation, { status: approveRequestStatus }] =
        useMutation(approveRequestJoinTeam, {
            onSuccess: handleClose,
            onError: (error) => {
                setMutationError({
                    message: t("approveRequestFailed"),
                    object: error,
                });
            },
        });

    const handleSubmit = () => {
        const { team_name, requester_id } = request;
        setMutationError(null);
        if (requestChoice === REQUEST_CHOICES.APPROVE) {
            approveRequestMutation({
                teamName: team_name,
                requesterId: requester_id,
                privilege,
            });
        } else {
            denyRequestMutation({
                teamName: team_name,
                requesterId: requester_id,
                message: denyMessage,
            });
        }
    };

    const loading = isQueryLoading([denyRequestStatus, approveRequestStatus]);

    return (
        <DEDialog
            baseId={baseId}
            open={open}
            onClose={handleClose}
            title={t("joinTeamRequestHeader")}
            actions={
                <>
                    <Button
                        id={build(baseId, ids.CANCEL_BTN)}
                        onClick={handleClose}
                    >
                        {t("common:cancel")}
                    </Button>
                    <Button
                        color="primary"
                        id={build(baseId, ids.ADMIN_JOIN_TEAM.SUBMIT_BTN)}
                        onClick={handleSubmit}
                    >
                        {t("common:submit")}
                    </Button>
                </>
            }
        >
            {loading && (
                <div id={build(baseId, ids.LOADING_SKELETON)}>
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="rect" height={100} />
                    <Skeleton variant="text" height={40} />
                    <Skeleton variant="rect" height={100} />
                </div>
            )}
            {!loading && (
                <DialogContent
                    baseId={baseId}
                    handleRequestChange={handleRequestChange}
                    mutationError={mutationError}
                    requestChoice={requestChoice}
                    privilege={privilege}
                    setPrivilege={setPrivilege}
                    denyMessage={denyMessage}
                    setDenyMessage={setDenyMessage}
                    request={request}
                />
            )}
        </DEDialog>
    );
}

export default AdminJoinTeamRequestDialog;
