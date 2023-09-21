/**
 *  @author aramsey
 *
 *  A component which displays 3 vertical dots, which when
 *  clicked will display a menu.
 *
 *  For a large screen, the users will see a Button with the 3 dots icon, plus
 *  the supplied button text.
 *  For a smaller screen, or if no text is provided, users will only see the icon.
 *
 *  MenuItems should be passed into the render prop which in turn
 *  will provide a function for closing the menu.
 *
 *  Sample usage:
 *  <DotMenu
 *    baseId="myId"
 *    render={(onClose) => [
 *        <MenuItem
 *          onClick={onClose}>
 *          Click Me
 *        </MenuItem>,
 *        ...
 *        ]}
 *  />
 **/

import React, { useState } from "react";

import {
    Button,
    IconButton,
    Menu,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import build from "components/utils/DebugIDUtil";

function DotMenu(props) {
    const {
        baseId,
        render,
        ButtonProps,
        buttonText,
        iconOnlyBreakpoint = "xs",
        MenuProps,
    } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const theme = useTheme();

    const handleDotMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDotMenuClose = (event) => {
        setAnchorEl(null);
    };

    let menuId = build(baseId, "moreMenu");

    const isIconButton =
        useMediaQuery(theme.breakpoints.down(iconOnlyBreakpoint)) ||
        !buttonText;

    const Component = isIconButton ? IconButton : Button;

    return (
        <>
            <Component
                id={build(baseId, "dotMenuIcon")}
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleDotMenuClick}
                size="small"
                variant={isIconButton ? null : "outlined"}
                color={isIconButton ? "default" : "primary"}
                {...(isIconButton ? null : { startIcon: <MoreVertIcon /> })}
                {...ButtonProps}
            >
                {isIconButton ? <MoreVertIcon /> : buttonText}
            </Component>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                open={open}
                onClose={handleDotMenuClose}
                {...MenuProps}
            >
                {render(handleDotMenuClose)}
            </Menu>
        </>
    );
}

export default DotMenu;
