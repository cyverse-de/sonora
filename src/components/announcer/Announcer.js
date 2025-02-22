/**
 *  @author sriram
 *
 **/

import React from "react";

import PropTypes from "prop-types";
import {
    BOTTOM,
    ERROR,
    LEFT,
    SUCCESS,
    TIMEOUT,
    WARNING,
} from "components/announcer/AnnouncerConstants";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { Snackbar, useTheme } from "@mui/material";
import Alert from "@mui/material/Alert";

function getTextColor(theme, severity) {
    let color;
    switch (severity) {
        case ERROR:
            color = theme.palette.error.contrastText;
            break;
        case SUCCESS:
            color = theme.palette.success.contrastText;
            break;
        case WARNING:
            color = theme.palette.warning.contrastText;
            break;
        default:
            color = theme.palette.info.contrastText;
    }

    return color;
}

const MySnackbarContent = React.forwardRef(function MySnackbarContent(
    props,
    ref
) {
    const { message, onClose, variant: severity, action } = props;
    const theme = useTheme();
    return (
        <Alert
            elevation={6}
            ref={ref}
            variant="filled"
            severity={severity}
            onClose={onClose}
            action={action}
            style={{ color: getTextColor(theme, severity) }}
        >
            {message}
        </Alert>
    );
});

MySnackbarContent.propTypes = {
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(["success", "warning", "error", "info"])
        .isRequired,
    action: PropTypes.node,
};

function Announcer(props) {
    const {
        message,
        variant,
        duration,
        horizontal,
        vertical,
        onClose,
        open,
        CustomAction,
    } = props;
    const theme = useTheme();
    if (message) {
        return (
            <Snackbar
                key={message}
                anchorOrigin={{
                    vertical: vertical ? vertical : BOTTOM,
                    horizontal: horizontal ? horizontal : LEFT,
                }}
                open={open}
                autoHideDuration={duration ? duration : TIMEOUT}
                onClose={onClose}
                disableWindowBlurListener={true}
            >
                <MySnackbarContent
                    onClose={onClose}
                    variant={variant}
                    message={message}
                    action={[
                        CustomAction ? <CustomAction key="custom" /> : null,
                        <IconButton
                            key="close"
                            size="small"
                            style={{ color: getTextColor(theme, variant) }}
                            aria-label="Close"
                            onClick={() => {
                                onClose();
                            }}
                        >
                            <CloseIcon />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        );
    } else {
        return null;
    }
}

Announcer.propTypes = {
    open: PropTypes.bool.isRequired,
    message: PropTypes.string,
    variant: PropTypes.oneOf(["success", "warning", "error", "info"])
        .isRequired,
    duration: PropTypes.number,
    vertical: PropTypes.oneOf(["top", "bottom"]),
    horizontal: PropTypes.oneOf(["center", "right", "left"]),
};

export default Announcer;
