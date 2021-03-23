/**
 * @author sriram
 *
 * A dialog that allows users to save a file at selected location
 */
import React, { useState } from "react";

import { Field, Form, Formik } from "formik";

import { useTranslation } from "react-i18next";

import { announce, AnnouncerConstants, build } from "@cyverse-de/ui-lib";
import { useMutation } from "react-query";
import ids from "./ids";
import ResourceIcon from "components/data/listing/ResourceIcon";
import ResourceTypes from "components/models/ResourceTypes";
import InputSelector from "components/apps/launch/InputSelector";
import DEDialog from "components/utils/DEDialog";

import { move } from "serviceFacades/filesystem";
import constants from "../../constants";

import {
    Avatar,
    Button,
    CircularProgress,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction,
    IconButton,
    useTheme,
} from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";

function MoveDialog(props) {
    const { path, open, selectedResources, onClose } = props;
    const [moveError, setMoveError] = useState(null);
    const theme = useTheme();
    const baseId = ids.MOVE_DLG;

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const [resourcesMove, { status }] = useMutation(move, {
        onSuccess: (data) => {
            announce({
                text: t("asyncMovePending"),
                variant: AnnouncerConstants.INFO,
            });
            onClose();
        },
        onError: (error) => {
            setMoveError(error);
        },
    });

    const handleMove = ({ dest }) => {
        const sources = selectedResources.map((res) => res.path);
        if (status !== constants.LOADING) {
            resourcesMove({ dest, sources });
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{ dest: path }}
            onSubmit={handleMove}
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        <DEDialog
                            open={open}
                            onClose={onClose}
                            baseId={baseId}
                            title={t("move")}
                            actions={
                                <>
                                    <Button
                                        id={build(baseId, ids.CANCEL_BTN)}
                                        onClick={onClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={build(baseId, ids.CREATE_BTN)}
                                        color="primary"
                                        type="submit"
                                        onClick={handleSubmit}
                                    >
                                        {t("move")}
                                    </Button>
                                </>
                            }
                        >
                            {status === constants.LOADING && (
                                <CircularProgress
                                    size={30}
                                    thickness={5}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                    }}
                                />
                            )}
                            {moveError && (
                                <ErrorTypographyWithDialog
                                    errorObject={moveError}
                                    errorMessage={t("moveRequestFailed")}
                                />
                            )}
                            <Typography
                                variant="subtitle2"
                                style={{
                                    marginTop: theme.spacing(1),
                                    marginBottom: theme.spacing(1),
                                }}
                            >
                                Selected File(s) and Folder(s)
                            </Typography>
                            <List dense>
                                {selectedResources?.map((resource) => {
                                    return (
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <ResourceIcon
                                                        type={resource?.type}
                                                    />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={resource?.label}
                                                secondary={resource?.path}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="remove"
                                                    size="small"
                                                    style={{
                                                        marginBottom: theme.spacing(
                                                            1
                                                        ),
                                                    }}
                                                >
                                                    <RemoveCircleIcon color="error" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                            </List>
                            <Field
                                startingPath={path}
                                name="dest"
                                id={build(baseId, ids.PATH)}
                                acceptedType={ResourceTypes.FOLDER}
                                label={t("moveDestination")}
                                component={InputSelector}
                                required={true}
                            />
                        </DEDialog>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default MoveDialog;
