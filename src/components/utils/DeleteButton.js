/**
 * @author aramsey
 *
 * A commonly used button or icon button that displays a red trash can icon
 */
import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import PropTypes from "prop-types";

import ids from "./ids";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "../../i18n";

const useStyles = makeStyles((theme) => ({
    deleteBtn: {
        color: theme.palette.error.main,
    },
}));

function DeleteButton(props) {
    const {
        baseId,
        ariaLabel,
        component = "Button",
        children,
        ...rest
    } = props;
    const { t } = useTranslation("common");

    const classes = useStyles();

    const isButton = component === "Button";
    const Component = isButton ? Button : IconButton;
    const showStartIcon = isButton && children;
    const showChildIcon = !isButton || !showStartIcon;

    return (
        <Component
            id={buildID(baseId, ids.BUTTONS.DELETE)}
            aria-label={ariaLabel || t("delete")}
            className={isButton ? classes.deleteBtn : null}
            classes={!isButton ? { root: classes.deleteBtn } : null}
            {...(showStartIcon && { startIcon: <Delete /> })}
            {...rest}
        >
            {showChildIcon && <Delete />}
            {children}
        </Component>
    );
}

DeleteButton.propTypes = {
    baseId: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string,
    component: PropTypes.oneOf(["Button", "IconButton"]),
};

export default DeleteButton;
