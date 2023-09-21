/**
 * @author sriram
 *
 * A dialog that allows users to save a file at selected location
 */
import React, { useState } from "react";

import { Field, Form, Formik } from "formik";

import { useTranslation } from "i18n";

import buildID from "components/utils/DebugIDUtil";
import { announce } from "components/announcer/CyVerseAnnouncer";
import { INFO } from "components/announcer/AnnouncerConstants";
import { useMutation } from "react-query";
import ids from "./ids";
import ResourceIcon from "components/data/listing/ResourceIcon";
import ResourceTypes from "components/models/ResourceTypes";
import InputSelector from "components/apps/launch/InputSelector";
import DEDialog from "components/utils/DEDialog";
import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
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
    IconButton,
    useTheme,
} from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

function MoveDialog(props) {
    const { path, open, selectedResources, onClose, onRemoveResource } = props;
    const [moveError, setMoveError] = useState(null);
    const theme = useTheme();
    const baseId = ids.MOVE_DLG;

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    const { mutate: resourcesMove, status } = useMutation(move, {
        onSuccess: (data) => {
            announce({
                text: t("asyncMovePending"),
                variant: INFO,
            });
            onClose();
        },
        onError: setMoveError,
    });

    const handleMove = ({ dest }) => {
        const sources = selectedResources?.map((res) => res.path);
        if (status !== constants.LOADING && sources?.length > 0) {
            setMoveError(null);
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
                                        id={buildID(baseId, ids.CANCEL_BTN)}
                                        onClick={onClose}
                                    >
                                        {i18nCommon("cancel")}
                                    </Button>
                                    <Button
                                        id={buildID(baseId, ids.MOVE_BTN)}
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
                                {t("selectedFilesFolders")}
                            </Typography>
                            {selectedResources?.length === 0 && (
                                <Typography color="error">
                                    {t("selectFileFolderPrompt")}
                                </Typography>
                            )}
                            <List>
                                {selectedResources?.map((resource) => {
                                    return (
                                        <ListItem
                                            id={buildID(baseId, resource?.id)}
                                            key={resource?.id}
                                        >
                                            <IconButton
                                                edge="end"
                                                aria-label={i18nCommon(
                                                    "remove"
                                                )}
                                                size="small"
                                                onClick={() =>
                                                    onRemoveResource(resource)
                                                }
                                                style={{
                                                    margin: theme.spacing(1),
                                                }}
                                            >
                                                <RemoveCircleIcon color="error" />
                                            </IconButton>
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
                                        </ListItem>
                                    );
                                })}
                            </List>
                            <Field
                                startingPath={path}
                                name="dest"
                                id={buildID(baseId, ids.PATH)}
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
