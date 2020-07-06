/**
 *
 * @author sriram
 * A list that allow users to browse different app categories.
 *
 */
import React, { useCallback, useEffect, useState } from "react";

import intlData from "../messages";
import ids from "../ids";

import constants from "../../../constants";
import appType from "../../models/AppType";
import {
    getPrivateCategories,
    APP_CATEGORIES_QUERY_KEY,
} from "../../../serviceFacades/apps";

import { queryCache, useQuery } from "react-query";

import { injectIntl } from "react-intl";

import {
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { build, formatMessage, withI18N } from "@cyverse-de/ui-lib";

import {
    Apps as AppsIcon,
    ArrowDropDown as ArrowDropDownIcon,
    Favorite as FavoriteIcon,
    FolderShared as FolderSharedIcon,
    GroupWork as GroupWorkIcon,
    Lock as LockIcon,
    Storage as StorageIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    selectedListItem: {
        paddingLeft: 0,
        color: theme.palette.primary.main,
    },
    list: {
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(1),
        },
        [theme.breakpoints.down("sm")]: {
            maxWidth: 130,
            padding: 0,
        },
    },
    listItem: {
        outline: "none",
        cursor: "pointer",
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
    },
    listItemText: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        maxWidth: 200,
    },
    divider: {
        flexGrow: 1,
    },
    selectedCategory: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        maxWidth: 140,
    },
    filter: {
        [theme.breakpoints.down("xs")]: {
            width: 130,
        },
        [theme.breakpoints.up("sm")]: {
            width: 150,
        },
    },
}));

function getAppTypeFilters() {
    return Object.values(appType).map((type) => {
        return {
            name: type,
        };
    });
}

function getAllAppsCategory(categoryName) {
    return {
        name: categoryName,
        icon: <AppsIcon />,
    };
}

function AppNavigation(props) {
    const {
        handleCategoryChange,
        setCategoryStatus,
        handleAppNavError,
        selectedCategory,
        intl,
        baseId,
    } = props;
    const classes = useStyles();

    const [categories, setCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const appNavId = build(baseId, ids.APPS_NAVIGATION);
    const allAppsCategory = getAllAppsCategory(constants.BROWSE_ALL_APPS);

    const preProcessData = useCallback(
        (data) => {
            const privateCat = data.categories.find(
                (cat) => cat.system_id === "de"
            );
            const hpcCat = data.categories.find(
                (cat) => cat.system_id === "agave"
            );

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

            if (hpcCat) {
                hpcCat.icon = <StorageIcon />;
                setCategories(privateCat.categories.concat(hpcCat));
            } else {
                setCategories(privateCat.categories);
            }
            handleAppNavError(null);
        },
        [setCategories, handleAppNavError]
    );

    const { isFetching } = useQuery({
        queryKey: APP_CATEGORIES_QUERY_KEY,
        queryFn: getPrivateCategories,
        config: {
            onSuccess: preProcessData,
            onError: (e) => {
                handleAppNavError(e);
            },
            staleTime: Infinity,
            cacheTime: Infinity,
        },
    });

    useEffect(() => {
        setCategoryStatus(isFetching);
    }, [isFetching, setCategoryStatus]);

    useEffect(() => {
        if (categories && categories.length > 0) {
            handleCategoryChange(categories[0]);
        } else {
            const cacheCat = queryCache.getQueryData("getPrivateCategories");
            if (cacheCat) {
                preProcessData(cacheCat);
            }
        }
    }, [preProcessData, categories, handleCategoryChange]);

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
        <>
            <List
                component="nav"
                aria-label={formatMessage(intl, "selectedCategoryAriaLabel")}
                id={build(appNavId, ids.APPS_CATEGORIES)}
                className={classes.list}
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
                            ids.APPS_CATEGORIES,
                            selectedCategory.name
                        )}
                        primary={
                            <Typography className={classes.selectedCategory}>
                                {selectedCategory.name}
                            </Typography>
                        }
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
                aria-label={formatMessage(intl, "categoriesMenuAriaLabel")}
            >
                {categories.map((menuItem, index) => (
                    <ListItem
                        id={build(
                            appNavId,
                            ids.APPS_CATEGORIES_MENU,
                            ids.APPS_CATEGORIES_MENU_ITEM,
                            menuItem.name
                        )}
                        key={menuItem.name}
                        selected={selectedCategory.name === menuItem.name}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        className={classes.listItem}
                        aria-label={menuItem.name}
                    >
                        <ListItemIcon>{menuItem.icon}</ListItemIcon>
                        <ListItemText>
                            <Typography className={classes.listItemText}>
                                {menuItem.name}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
                <Divider />
                <ListItem
                    id={build(
                        appNavId,
                        ids.APPS_CATEGORIES_MENU,
                        ids.APPS_CATEGORIES_MENU_ITEM,
                        ids.BROWSE_ALL_APPS
                    )}
                    key={allAppsCategory.name}
                    selected={selectedCategory.name === allAppsCategory.name}
                    onClick={() => {
                        setAnchorEl(null);
                        handleCategoryChange(allAppsCategory);
                    }}
                    className={classes.listItem}
                    aria-label={allAppsCategory.name}
                >
                    <ListItemIcon>{allAppsCategory.icon}</ListItemIcon>
                    <ListItemText>
                        <Typography className={classes.listItemText}>
                            {allAppsCategory.name}
                        </Typography>
                    </ListItemText>
                </ListItem>
            </Menu>
        </>
    );
}
export default withI18N(injectIntl(AppNavigation), intlData);
export { getAppTypeFilters };
