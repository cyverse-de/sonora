/**
 * @author johnworth
 *
 * A table populated from tracked uploads. Used in the UploadQueue.
 *
 * @module uploads/queue
 */

import React from "react";
import { useTranslation } from "i18n";
import {
    Avatar,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

import {
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Description as DescriptionIcon,
    Error as ErrorIcon,
    Http as HttpIcon,
} from "@mui/icons-material";

import {
    KindFile,
    removeAction,
    useUploadTrackingDispatch,
    useUploadTrackingState,
} from "../../../contexts/uploadTracking";

import buildID from "components/utils/DebugIDUtil";
import ids from "../dialog/ids";
import { ERROR_CODES, getErrorCode } from "components/error/errorCode";

const useStyles = makeStyles((theme) => ({
    ellipsis: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingRight: theme.spacing(1),
    },

    error: {
        color: theme.palette.error.main,
        wordBreak: "break-word",
    },
}));

/**
 * Component for the upload status icon that chooses what to display based on the
 * state of the upload.
 *
 * @params {Object} props
 * @params {Object} props.upload - An upload from the upload tracker.
 * @returns {Object}
 */
const UploadStatus = ({ upload, baseId }) => {
    const theme = useTheme();

    let statusIcon = <div />;

    if (upload.isUploading) {
        statusIcon = (
            <CircularProgress
                size={20}
                id={buildID(baseId, ids.STATUS.UPLOADING)}
            />
        );
    }

    if (upload.hasUploaded) {
        statusIcon = (
            <CheckCircleIcon
                style={{ color: theme.palette.success.main }}
                id={buildID(baseId, ids.STATUS.SUCCESS)}
            />
        );
    }

    if (upload.hasErrored) {
        statusIcon = (
            <ErrorIcon color="error" id={buildID(baseId, ids.STATUS.FAILED)} />
        );
    }

    return statusIcon;
};

const EllipsisField = ({ children }) => {
    const classes = useStyles();

    return <div className={classes.ellipsis}>{children}</div>;
};

function UploadSecondaryText(props) {
    const { upload } = props;
    const theme = useTheme();
    const { t } = useTranslation("upload");
    const isSmall = useMediaQuery(theme.breakpoints.down("md"));

    if (upload.hasErrored) {
        return getErrorCode(upload.errorMessage) === ERROR_CODES.ERR_EXISTS
            ? t("uploadExists", { path: upload.parentPath })
            : t("failDetails", {
                  details: JSON.stringify(upload.errorMessage),
              });
    }

    if (!isSmall) {
        return upload.parentPath;
    }

    return null;
}

/**
 * Component for an item in the list of uploads.
 *
 * @params {Object} props
 * @params {Object} props.upload - An upload from the upload tracker.
 * @params {Object} props.handleCancel - A callback called when the cancel button is clicked.
 * @returns {Object}
 */
const UploadItem = ({ upload, handleCancel, baseId }) => {
    const theme = useTheme();
    const classes = useStyles();
    const { t } = useTranslation("upload");
    const isSmall = useMediaQuery(theme.breakpoints.down("md"));

    const uploadPath = [upload.parentPath, upload.filename].join("/");
    const itemId = buildID(baseId, uploadPath);

    return (
        <ListItem id={itemId}>
            {!isSmall && (
                <ListItemAvatar>
                    <Avatar>
                        {upload.kind === KindFile ? (
                            <DescriptionIcon />
                        ) : (
                            <HttpIcon />
                        )}
                    </Avatar>
                </ListItemAvatar>
            )}

            <ListItemText
                primary={<EllipsisField>{upload.filename}</EllipsisField>}
                classes={
                    upload.hasErrored ? { secondary: classes.error } : null
                }
                secondary={<UploadSecondaryText upload={upload} />}
            />

            <UploadStatus upload={upload} baseId={itemId} />

            <ListItemSecondaryAction>
                <IconButton
                    edge="end"
                    aria-label={t("cancelUploadAria")}
                    onClick={(e) => handleCancel(e, upload)}
                    size="large"
                >
                    <CancelIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

/**
 * Default component that renders a list of uploads being tracked by the upload
 * tracker.
 *
 * @returns {Object}
 */
const UploadList = (props) => {
    const { id } = props;
    const tracker = useUploadTrackingState();
    const dispatch = useUploadTrackingDispatch();

    const handleCancel = (event, upload) => {
        event.stopPropagation();
        event.preventDefault();

        // Terminate the upload. For URL imports it will cancel the running job.
        upload.cancelFn();

        // Remove the upload from the tracker.
        dispatch(
            removeAction({
                id: upload.id,
            })
        );
    };

    return (
        <List dense={true} id={id}>
            {tracker.uploads.map((upload) => (
                <UploadItem
                    baseId={id}
                    key={upload.id}
                    upload={upload}
                    handleCancel={handleCancel}
                />
            ))}
        </List>
    );
};

export default UploadList;
