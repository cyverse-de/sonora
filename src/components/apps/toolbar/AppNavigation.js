/**
 *
 * @author sriram
 * A list that allow users to browse different app categories.
 *
 */
import React, { useCallback, useEffect, useState } from "react";

import ids from "../ids";

import constants from "../../../constants";
import systemId from "components/models/systemId";
import {
    getPrivateCategories,
    APP_CATEGORIES_QUERY_KEY,
} from "serviceFacades/apps";

import { useQueryClient, useQuery } from "react-query";

import { useTranslation } from "i18n";

import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    Typography,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import buildID from "components/utils/DebugIDUtil";

import {
    Apps as AppsIcon,
    ArrowDropDown as ArrowDropDownIcon,
    Favorite as FavoriteIcon,
    FolderShared as FolderSharedIcon,
    GroupWork as GroupWorkIcon,
    Lock as LockIcon,
    Storage as StorageIcon,
    VerifiedUser as ShieldIcon,
} from "@material-ui/icons";
import { useUserProfile } from "../../../contexts/userProfile";
import { CollectionIcon } from "components/collections/Icons";

const useStyles = makeStyles((theme) => ({
    selectedListItem: {
        paddingLeft: 0,
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
    },
    list: {
        width: 250,
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
        width: 250,
    },
    divider: {
        flexGrow: 1,
    },
    selectedCategory: {
        width: 250,
    },
}));

function AppNavigation(props) {
    const {
        handleCategoryChange,
        setCategoryStatus,
        handleAppNavError,
        selectedCategory,
        baseId,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation("apps");
    const [categories, setCategories] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [userProfile] = useUserProfile();
    const [categoryQueryKey, setCategoryQueryKey] = useState([
        APP_CATEGORIES_QUERY_KEY,
        userProfile?.id,
    ]);

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const appNavId = buildID(baseId, ids.APPS_NAVIGATION);

    const iconMap = new Map();
    iconMap.set(constants.APPS_UNDER_DEV, <LockIcon />);
    iconMap.set(constants.APPS_SHARED_WITH_ME, <FolderSharedIcon />);
    iconMap.set(constants.FAV_APPS, <FavoriteIcon />);
    iconMap.set(constants.MY_PUBLIC_APPS, <GroupWorkIcon />);
    iconMap.set(constants.BROWSE_ALL_APPS, <AppsIcon />);
    iconMap.set(constants.HPC, <StorageIcon />);
    iconMap.set(constants.MY_COLLECTIONS, <CollectionIcon />);
    iconMap.set(constants.FEATURED_APPS, <ShieldIcon />);

    const allAppsCategory = useCallback(() => {
        return {
            name: constants.BROWSE_ALL_APPS,
            id: constants.BROWSE_ALL_APPS_ID,
        };
    }, []);

    const myCollectionsCategory = useCallback(() => {
        return {
            name: constants.MY_COLLECTIONS,
            id: constants.MY_COLLECTIONS,
        };
    }, []);

    const preProcessData = useCallback(
        (data) => {
            const privateCat = data.categories.find(
                (cat) => cat.system_id === systemId.de
            );
            const hpcCat = data.categories.find(
                (cat) => cat.system_id === systemId.agave
            );

            let categoryList = privateCat.categories;
            if (hpcCat) {
                categoryList = categoryList.concat(hpcCat);
            }
            categoryList = categoryList.concat(myCollectionsCategory());
            categoryList = categoryList.concat(allAppsCategory());
            setCategories(categoryList);
            handleAppNavError(null);
            // If a user has just logged in, they may still have one of the fake
            // categories given to the anonymous user selected with a fake
            // UUID
            if (
                [constants.FAV_APPS, constants.APPS_UNDER_DEV].includes(
                    selectedCategory?.id
                )
            ) {
                handleCategoryChange(
                    categoryList.find(
                        (category) => category.name === selectedCategory.name
                    )
                );
            }
        },
        [
            myCollectionsCategory,
            allAppsCategory,
            handleAppNavError,
            selectedCategory,
            handleCategoryChange,
        ]
    );

    const { isFetching } = useQuery({
        queryKey: categoryQueryKey,
        queryFn: () => getPrivateCategories(categoryQueryKey[1]),
        onSuccess: preProcessData,
        onError: (e) => {
            handleAppNavError(e);
        },
        staleTime: Infinity,
        cacheTime: Infinity,
    });

    useEffect(() => {
        setCategoryStatus(isFetching);
    }, [isFetching, setCategoryStatus]);

    useEffect(() => {
        setCategoryQueryKey([APP_CATEGORIES_QUERY_KEY, userProfile?.id]);
    }, [userProfile]);

    useEffect(() => {
        if (!categories || categories.length === 0) {
            const cacheCat = queryClient.getQueryData(categoryQueryKey);
            if (cacheCat) {
                preProcessData(cacheCat);
            }
        }
    }, [categoryQueryKey, preProcessData, categories, queryClient]);

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

    const categoryI18nName = (name) => {
        return name.toLowerCase().replaceAll(" ", "_");
    };

    if (!categories || categories.length === 0 || !selectedCategory) {
        return null;
    }

    return (
        <>
            <List
                component="nav"
                aria-label={t("selectedCategoryAriaLabel")}
                id={buildID(appNavId, ids.APPS_CATEGORIES)}
                className={classes.list}
            >
                <ListItem
                    button
                    aria-haspopup="true"
                    onClick={handleClickListItem}
                    className={classes.selectedListItem}
                    aria-label={t("selectedCategoryAriaMenuItemLabel")}
                >
                    {iconMap.get(selectedCategory.name)}
                    <ListItemText
                        id={buildID(
                            appNavId,
                            ids.APPS_CATEGORIES,
                            selectedCategory.name
                        )}
                        primary={
                            <Typography className={classes.selectedCategory}>
                                {t(categoryI18nName(selectedCategory.name))}
                            </Typography>
                        }
                    />
                    <ListItemIcon style={{ minWidth: 20 }}>
                        <ArrowDropDownIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
            <Menu
                id={buildID(appNavId, ids.APP_CATEGORIES_MENU)}
                aria-haspopup="true"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                aria-label={t("categoriesMenuAriaLabel")}
            >
                {categories.map((menuItem, index) => (
                    <ListItem
                        id={buildID(
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
                        <ListItemIcon>
                            {iconMap.get(menuItem.name)}
                        </ListItemIcon>
                        <ListItemText>
                            <Typography className={classes.listItemText}>
                                {t(categoryI18nName(menuItem.name))}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </Menu>
        </>
    );
}

export default AppNavigation;
