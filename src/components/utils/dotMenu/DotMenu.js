/**
 *  @author aramsey
 *
 *  A component which displays 3 vertical dots, which when
 *  clicked will display a menu.
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

import { Menu, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import build from "../../util/DebugIDUtil";

function DotMenu(props) {
    const { baseId, render, ButtonProps, MenuProps } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleDotMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDotMenuClose = (event) => {
        setAnchorEl(null);
    };

    let menuId = build(baseId, "moreMenu");

    return (
        <>
            <IconButton
                id={build(baseId, "dotMenuIcon")}
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleDotMenuClick}
                size="small"
                {...ButtonProps}
            >
                <MoreVertIcon />
            </IconButton>
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
