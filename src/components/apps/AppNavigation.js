/**
 *
 * @author sriram
 * A list that allow users to browse different app categories.
 *
 */
import React, { useState } from "react";
import { useQuery } from "react-query";
import { getPrivateCategories } from "../../serviceFacade/appServiceFacade";
import { injectIntl } from "react-intl";
import intlData from "./messages";
import ids from "./ids";
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
    Menu,
    Toolbar,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@material-ui/core/styles";
import { formatMessage, build, withI18N } from "@cyverse-de/ui-lib";

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
    const { handleCategoryChange, intl, baseId } = props;
    const [categories, setCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const classes = useStyles();
    const appNavId = build(baseId, ids.APP_NAVIGATION);

    const preProcessData = (data) => {
        const privateCat = data.categories.find(
            (cat) => cat.system_id === "de"
        );
        const hpcCat = data.categories.find((cat) => cat.system_id === "agave");

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
            <List
                component="nav"
                aria-controls={formatMessage(
                    intl,
                    "selectedCategoryMenuAriaControl"
                )}
                aria-label={formatMessage(intl, "selectedCategoryAriaLabel")}
                id={build(appNavId, ids.APP_CATEGORIES)}
            >
                <ListItem
                    button
                    aria-haspopup="true"
                    onClick={handleClickListItem}
                    className={classes.selectedListItem}
                    aria-label={formatMessage(
                        intl,
                        "selectedCategoryAriaMenuItemControl"
                    )}
                >
                    {categories[selectedIndex].icon}
                    <ListItemText
                        id={build(
                            appNavId,
                            ids.APP_CATEGORIES,
                            categories[selectedIndex].name
                        )}
                        primary={categories[selectedIndex].name}
                    />
                    <ListItemIcon style={{ minWidth: 20 }}>
                        <ArrowDropDownIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
            <Menu
                id={build(appNavId, ids.APP_CATEGORIES_MENU)}
                aria-haspopup="true"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                aria-controls={formatMessage(intl, "categoriesMenuAriaControl")}
                aria-label={formatMessage(intl, "categoriesMenuAriaLabel")}
            >
                {categories.map((menuItem, index) => (
                    <ListItem
                        id={build(
                            appNavId,
                            ids.APP_CATEGORIES_MENU,
                            ids.APP_CATEGORIES_MENU_ITEM,
                            menuItem.name
                        )}
                        key={menuItem.label}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        className={classes.list}
                        aria-controls={formatMessage(
                            intl,
                            "categoriesMenuItemAriaControl"
                        )}
                        aria-label={menuItem.name}
                    >
                        <ListItemIcon>{menuItem.icon}</ListItemIcon>
                        <ListItemText>{menuItem.name}</ListItemText>
                    </ListItem>
                ))}
            </Menu>
        </Toolbar>
    );
}
export default withI18N(injectIntl(AppNavigation), intlData);
