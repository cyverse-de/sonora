/**
 * @author aramsey
 *
 * A commonly used button or icon button that displays a red trash can icon
 */
import React from "react";

import { build } from "@cyverse-de/ui-lib";
import { Delete } from "@material-ui/icons";
import { Button, IconButton } from "@material-ui/core";
import PropTypes from "prop-types";

import ids from "./ids";
import { makeStyles } from "@material-ui/styles";
import { useTranslation } from "../../i18n";

const useStyles = makeStyles((theme) => ({
    deleteBtn: {
        color: theme.palette.error.main,
    },
}));

function DeleteButton(props) {
    const { baseId, ariaLabel, component = "Button", ...rest } = props;
    const { t } = useTranslation("common");

    const classes = useStyles();

    const isButton = component === "Button";
    const Component = isButton ? Button : IconButton;

    return (
        <Component
            id={build(baseId, ids.BUTTONS.DELETE)}
            aria-label={ariaLabel || t("delete")}
            className={isButton ? classes.deleteBtn : null}
            classes={!isButton ? { root: classes.deleteBtn } : null}
            {...rest}
        >
            <Delete />
        </Component>
    );
}

DeleteButton.propTypes = {
    baseId: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string,
    component: PropTypes.oneOf(["Button", "IconButton"]),
};

export default DeleteButton;
