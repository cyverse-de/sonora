/**
 * @author aramsey
 *
 * A component that displays a Help icon button which, when clicked, will
 * display a popover with some text
 */
import React from "react";

import buildID from "components/utils/DebugIDUtil";
import { IconButton, Popover, Tooltip, Typography } from "@mui/material";
import { Help } from "@mui/icons-material";

import ids from "../ids";
import { useTranslation } from "i18n";
import styles from "../styles";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(styles);

function HelpIconButton(props) {
    const { parentId, message, ...rest } = props;
    const { t } = useTranslation("common");
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title={t("help")}>
                <IconButton
                    id={buildID(parentId, ids.BUTTONS.HELP_BTN)}
                    aria-label={t("help")}
                    onClick={handleClick}
                    {...rest}
                    size="large"
                >
                    <Help />
                </IconButton>
            </Tooltip>
            <Popover
                id={ids.EDIT_TEAM.HELP_POPOVER}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Typography className={classes.popover}>{message}</Typography>
            </Popover>
        </>
    );
}

export default HelpIconButton;
