import React, { useState } from "react";
import { useQuery } from "react-query";
import { getPrivateCategories } from "../../serviceFacade/appServiceFacade";

import StorageIcon from "@material-ui/icons/Storage";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LockIcon from "@material-ui/icons/Lock";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import constants from "../../constants";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu, Toolbar,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@material-ui/core/styles";

/**
 *
 * @author sriram
 *
 */
const useStyles = makeStyles((theme) => ({
    selectedListItem: {
        paddingLeft: 0,
        color: theme.palette.primary.main,
    },
    list: {
        outline: "none",
        cursor: "pointer",
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
    },
}));

function AppNavigation(props) {
    const {handleCategoryChange} = props;
    const [categories, setCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const classes = useStyles();

    const preProcessData = (data) => {
        const privateCat = data.categories.find(
            (cat) => cat.system_id === "de"
        );
        const hpcCat = data.categories.find((cat) => cat.system_id === "agave");

        console.log("de cat==> " + privateCat.name);
        console.log("hpc cat===>" + hpcCat.name);

        privateCat.categories.forEach((category) => {
            if (category.name === constants.APPS_UNDER_DEV) {
                category.icon = <LockIcon />;
            } else if (
                category.name.toLowerCase() ===
                constants.SHARED_WITH_ME.toLowerCase()
            ) {
                category.icon = <FolderSharedIcon />;
            } else if (category.name === constants.FAV_APPS) {
                category.icon = <FavoriteIcon />;
            } else if (category.name == constants.MY_PUBLIC_APPS) {
                category.icon = <GroupWorkIcon />;
            }
        });

        hpcCat.icon = <StorageIcon />;
        setCategories(privateCat.categories.concat(hpcCat));
        setSelectedIndex(0);
        handleCategoryChange(privateCat.categories[0]);
    };

    const { status, data, error } = useQuery({
        queryKey: "getPrivateCategories",
        queryFn: getPrivateCategories,
        config: { onSuccess: preProcessData, refetchOnWindowFocus: false },
    });

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setAnchorEl(null);
        setSelectedIndex(index);
        handleCategoryChange(categories[index]);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <Toolbar variant="dense">
            <List component="nav">
                <ListItem
                    button
                    aria-haspopup="true"
                    onClick={handleClickListItem}
                    className={classes.selectedListItem}
                >
                    {categories[selectedIndex].icon}
                    <ListItemText primary={categories[selectedIndex].name} />
                    <ListItemIcon style={{ minWidth: 20 }}>
                        <ArrowDropDownIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
            <Menu
                aria-haspopup="true"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {categories.map((menuItem, index) => (
                    <ListItem
                        key={menuItem.label}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        className={classes.list}
                    >
                        <ListItemIcon>{menuItem.icon}</ListItemIcon>
                        <ListItemText>{menuItem.name}</ListItemText>
                    </ListItem>
                ))}
            </Menu>
        </Toolbar>
    );
}
export default AppNavigation;
