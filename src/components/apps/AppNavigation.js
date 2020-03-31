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
import appType from "../models/AppType";
import StorageIcon from "@material-ui/icons/Storage";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LockIcon from "@material-ui/icons/Lock";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Autocomplete from "@material-ui/lab/Autocomplete";
import constants from "../../constants";
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    TextField,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { build, formatMessage, withI18N } from "@cyverse-de/ui-lib";

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
    divider: {
        flexGrow: 1,
    },
    selectedCategory: {
        [theme.breakpoints.down("sm")]: {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "inline-block",
            maxWidth: 75,
        },
    },
}));

function getFilters() {
    return Object.keys(appType).map((type) => {
        return {
            name: appType[type],
        };
    });
}

function AppNavigation(props) {
    const {
        handleCategoryChange,
        handleFilterChange,
        filter,
        selectedCategory,
        intl,
        baseId,
    } = props;
    const [categories, setCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
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
            } else if (category.name === constants.MY_PUBLIC_APPS) {
                category.icon = <GroupWorkIcon />;
            }
        });

        hpcCat.icon = <StorageIcon />;
        setCategories(privateCat.categories);
        handleCategoryChange(privateCat.categories[0]);
        handleFilterChange(getFilters()[0]);
    };

    useQuery({
        queryKey: "getPrivateCategories",
        queryFn: getPrivateCategories,
        config: { onSuccess: preProcessData, refetchOnWindowFocus: false },
    });

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setAnchorEl(null);
        handleCategoryChange(categories[index]);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!categories || categories.length === 0 || !selectedCategory) {
        return null;
    }

    return (
        <Toolbar variant="dense">
            <List
                component="nav"
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
                        "selectedCategoryAriaMenuItemLabel"
                    )}
                >
                    {selectedCategory.icon}
                    <ListItemText
                        id={build(
                            appNavId,
                            ids.APP_CATEGORIES,
                            selectedCategory.name
                        )}
                        primary={
                            <Typography className={classes.selectedCategory}>
                                {selectedCategory.name}
                            </Typography>
                        }
                    />
                    <ListItemIcon>
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
                        key={menuItem.name}
                        selected={selectedCategory.name === menuItem.name}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        className={classes.list}
                        aria-label={menuItem.name}
                    >
                        <ListItemIcon>{menuItem.icon}</ListItemIcon>
                        <ListItemText>{menuItem.name}</ListItemText>
                    </ListItem>
                ))}
            </Menu>
            <div className={classes.divider} />
            <Autocomplete
                value={filter}
                options={getFilters()}
                size="small"
                onChange={(event, newValue) => {
                    handleFilterChange(newValue);
                }}
                getOptionLabel={(option) => option.name}
                style={{ minWidth: 150 }}
                renderInput={(params) => (
                    <TextField {...params} label="Filter" variant="outlined" />
                )}
            />
        </Toolbar>
    );
}
export default withI18N(injectIntl(AppNavigation), intlData);
