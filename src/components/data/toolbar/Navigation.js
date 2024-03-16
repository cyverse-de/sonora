/**
 * @author sriram
 *
 * A component that displays Roots folders and breadcrumbs for Data navigation.
 * On smaller screens, breadcrumbs are replaced by dropdown menu of folder paths.
 *
 */

import React, { useEffect, useState } from "react";

import styles from "../styles";
import ids from "../ids";
import {
    useBaseHomePath,
    useBaseTrashPath,
    useUserHomePath,
    useTrashPath,
} from "../utils";

import constants from "../../../constants";
import {
    getFilesystemRoots,
    DATA_ROOTS_QUERY_KEY,
} from "serviceFacades/filesystem";
import { useUserProfile } from "contexts/userProfile";
import { useBootstrapInfo } from "contexts/bootstrap";

import buildID from "components/utils/DebugIDUtil";

import { makeStyles } from "tss-react/mui";
import { useTranslation } from "i18n";
import { useQueryClient, useQuery } from "react-query";

import HomeIcon from "@mui/icons-material/Home";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import useBreakpoints from "components/layout/useBreakpoints";

import {
    Breadcrumbs,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    Tooltip,
    Typography,
} from "@mui/material";

const useStyles = makeStyles()(styles);

/**
 * Splits a path into an array of path items.
 * @example
 * // returns [analyses,wordcount,logs]
 * getPathItems("/analyses/wordcount/logs");
 * @param {string }relativePath - relative path to CyVerse Data Store e.g: /analyses/wordcount/logs
 * @returns {string[]} - path items as a string array  e.g: [analyses,wordcount,logs]
 */
function getPathItems(relativePath) {
    let pathItems = [];
    pathItems = relativePath.split(constants.PATH_SEPARATOR).slice(1);
    return pathItems;
}

/**
 * Computes the path for routing.
 *  * @example
 * // returns "/iplant/home/ipctest/analyses"
 * getPathItems("/iplant/home/ipctest","/analyses/wordcount/logs", 0);
 * @param {string } root - CyVerse Data Store root path e.g: /iplant/home/ipctest
 * @param {string} relativePath - relative path to CyVerse Data Store e.g: /analyses/wordcount/logs
 * @param {number} selectedPathItemIndex - index of the selected path item
 * @returns {string} - path to be used by the nextjs router
 */
function pathToRoute(root, relativePath, selectedPathItemIndex) {
    const relativePathItems = getPathItems(relativePath);
    const reducer = (accumulator, currentVal, idx) => {
        if (idx <= selectedPathItemIndex) {
            return accumulator + constants.PATH_SEPARATOR + currentVal;
        }
        return accumulator;
    };
    const routerPath = relativePathItems.reduce(reducer);
    return `${root}${constants.PATH_SEPARATOR}${routerPath}`;
}

/**
 * Get relative path to CyVerse Data Store path.
 * Note: - Swapping community data path check and shared with me path check will result in incorrect
 * relative path since their path overlaps
 * COMMUNITY_DATA_PATH: "/iplant/home/shared",
 * SHARED_WITH_ME_PATH: "/iplant/home",
 * @example
 * // returns "/analyses/wordcount/logs"
 * getRelativePath(
 *     "/iplant/home/ipctest/analyses/wordcount/logs",
 *     "/iplant/home/ipctest",
 *     "/iplant/trash/home/ipctest"
 * );
 * @param {string} path -  CyVerse Data Store path
 * @param {string} userHomePath - Users home folder path
 * @param {string} userTrashPath - Users trash folder path
 * @param {string} sharedWithMePath - Data stores shared with me path
 * @param {string}  communityDataPath - Data stores community data path
 * @returns {string} relativePath - relative path to CyVerse Data Store e.g: /analyses/wordcount/logs
 */
function getRelativePath(
    path,
    userHomePath,
    userTrashPath,
    sharedWithMePath,
    communityDataPath
) {
    let relativePath = "";
    if (path.startsWith(userHomePath)) {
        relativePath = path.replace(userHomePath, "");
    } else if (path.startsWith(userTrashPath)) {
        relativePath = path.replace(userTrashPath, "");
    } else if (path.startsWith(communityDataPath)) {
        relativePath = path.replace(communityDataPath, "");
    } else if (path.startsWith(sharedWithMePath)) {
        relativePath = path.replace(sharedWithMePath, "");
    }
    return relativePath;
}

function FolderSelectorMenu({
    root,
    path,
    handlePathChange,
    userHomePath,
    userTrashPath,
    sharedWithMePath,
    communityDataPath,
    baseId,
}) {
    const { classes } = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const relativePath = getRelativePath(
        path,
        userHomePath,
        userTrashPath,
        sharedWithMePath,
        communityDataPath
    );
    const pathItems = getPathItems(relativePath);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { t } = useTranslation("data");

    useEffect(() => {
        setSelectedIndex(pathItems.length > 0 ? pathItems.length - 1 : 0);
    }, [pathItems]);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        const relativePath = getRelativePath(
            path,
            userHomePath,
            userTrashPath,
            sharedWithMePath,
            communityDataPath
        );
        handlePathChange(pathToRoute(root, relativePath, index));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        pathItems.length > 0 && (
            <>
                <List
                    component="nav"
                    aria-controls={t("selectedFolderAriaControl")}
                    aria-label={t("selectedFolderAriaLabel")}
                    id={buildID(baseId, ids.PATH_ITEMS)}
                    className={classes.list}
                >
                    <ListItem
                        button
                        aria-haspopup="true"
                        aria-controls={t("selectedFolderAriaMenuItemControl")}
                        aria-label={pathItems[selectedIndex]}
                        onClick={handleClickListItem}
                        className={classes.selectedListItem}
                    >
                        {<FolderIcon fontSize="small" />}
                        <ListItemText
                            id={buildID(
                                baseId,
                                ids.PATH_ITEMS,
                                ids.SELECTED_PATH_ITEM
                            )}
                            primary={
                                <Typography
                                    className={classes.currentLocationLink}
                                >
                                    {pathItems[selectedIndex]}
                                </Typography>
                            }
                        />
                        <ListItemIcon style={{ minWidth: 20 }}>
                            <ArrowDropDownIcon />
                        </ListItemIcon>
                    </ListItem>
                </List>

                <Menu
                    id={buildID(baseId, ids.PATH_ITEMS_MENU)}
                    aria-haspopup="true"
                    aria-controls={t("FolderPathsMenuAriaControl")}
                    aria-label={t("FolderPathsMenuAriaLabel")}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {pathItems.map((crumb, index) => (
                        <ListItem
                            id={buildID(
                                baseId,
                                ids.PATH_ITEMS_MENU,
                                ids.PATH_ITEMS_MENU_ITEM
                            )}
                            aria-label={pathItems[selectedIndex]}
                            key={crumb}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                                handleMenuItemClick(event, index)
                            }
                            className={classes.listItem}
                        >
                            <ListItemIcon>
                                <FolderIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography className={classes.listItemText}>
                                    {crumb}
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    ))}
                </Menu>
            </>
        )
    );
}

function BreadCrumb({
    root,
    path,
    handlePathChange,
    userHomePath,
    userTrashPath,
    sharedWithMePath,
    communityDataPath,
    baseId,
}) {
    const { classes } = useStyles();
    const { t } = useTranslation("data");
    const relativePath = getRelativePath(
        path,
        userHomePath,
        userTrashPath,
        sharedWithMePath,
        communityDataPath
    );

    const handleClick = (event, relativePath, crumb) => {
        event.preventDefault();
        const relativePathItems = getPathItems(relativePath);
        const index = relativePathItems.indexOf(crumb);
        handlePathChange(pathToRoute(root, relativePath, index));
    };

    return (
        <>
            {relativePath && <ArrowRightIcon className={classes.icon} />}
            <Breadcrumbs
                maxItems={2}
                aria-label="breadcrumb"
                id={buildID(baseId, ids.BREADCRUMBS)}
                aria-controls={t("dataNavigationBreadcrumbsControl")}
            >
                {getPathItems(relativePath).map((crumb) => (
                    <Tooltip title={crumb} key={crumb}>
                        <Button
                            variant="text"
                            startIcon={<FolderIcon className={classes.icon} />}
                            aria-controls={t("folderPathAriaControl")}
                            id={buildID(
                                baseId,
                                ids.BREADCRUMBS,
                                ids.PATH_ITEM,
                                crumb
                            )}
                            key={crumb}
                            color="inherit"
                            onClick={(event) =>
                                handleClick(event, relativePath, crumb)
                            }
                        >
                            <Typography className={classes.currentLocationLink}>
                                {crumb}
                            </Typography>
                        </Button>
                    </Tooltip>
                ))}
            </Breadcrumbs>
        </>
    );
}

function Navigation(props) {
    const { path, handlePathChange, baseId, handleDataNavError } = props;
    const { t } = useTranslation("data");
    const { classes } = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dataRoots, setDataRoots] = useState([]);
    const [sharedWithMePath, setSharedWithMePath] = useState("");
    const [communityDataPath, setCommunityDataPath] = useState("");
    const dataNavId = buildID(baseId, ids.DATA_NAVIGATION);
    const [userProfile] = useUserProfile();
    const [bootstrapInfo, setBootstrapInfo] = useBootstrapInfo();
    const irodsHomePath = useBaseHomePath();
    const irodsTrashPath = useBaseTrashPath();
    const userHomePath = useUserHomePath();
    const userTrashPath = useTrashPath();
    const [rootsQueryKeyArray, setRootsQueryKeyArray] = useState([
        DATA_ROOTS_QUERY_KEY,
        {
            userId: userProfile?.id,
            homePath: irodsHomePath,
            trashPath: irodsTrashPath,
        },
    ]);
    const { isMdDown, isMdUp } = useBreakpoints();

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const preProcessData = (respData) => {
        if (respData) {
            let home, sharedWithMe, communityData, trash;
            respData.roots.forEach(({ label, path }) => {
                switch (label) {
                    case constants.SHARED_WITH_ME:
                        setSharedWithMePath(path);
                        sharedWithMe = {
                            label,
                            path,
                            icon: <FolderSharedIcon fontSize="small" />,
                        };
                        break;

                    case constants.COMMUNITY_DATA:
                        setCommunityDataPath(path);
                        communityData = {
                            label,
                            path,
                            icon: <GroupIcon fontSize="small" />,
                        };
                        break;

                    case constants.TRASH:
                        trash = {
                            label,
                            path,
                            icon: <DeleteIcon fontSize="small" />,
                        };
                        break;

                    default:
                        // Must be the user's home
                        home = {
                            label: userProfile ? label : t("home"),
                            path,
                            icon: <HomeIcon fontSize="small" />,
                        };
                        break;
                }
            });

            const basePaths = respData["base-paths"];
            if (
                basePaths.user_home_path !== userHomePath ||
                basePaths.user_trash_path !== userTrashPath
            ) {
                setBootstrapInfo({
                    ...bootstrapInfo,
                    data_info: { ...basePaths },
                });
            }

            setDataRoots(
                userProfile
                    ? [home, sharedWithMe, communityData, trash]
                    : [communityData, home, sharedWithMe, trash]
            );

            handleDataNavError(null);
        }
    };

    useEffect(() => {
        //route to default path
        if (dataRoots.length > 0 && !path) {
            handlePathChange(dataRoots[0].path);
        }
    }, [dataRoots, handlePathChange, path]);

    useEffect(() => {
        setRootsQueryKeyArray([
            DATA_ROOTS_QUERY_KEY,
            {
                userId: userProfile?.id,
                homePath: irodsHomePath,
                trashPath: irodsTrashPath,
            },
        ]);
    }, [userProfile, irodsHomePath, irodsTrashPath]);

    const { error } = useQuery({
        queryKey: rootsQueryKeyArray,
        queryFn: () => getFilesystemRoots(rootsQueryKeyArray[1]),
        enabled: true,
        onSuccess: preProcessData,
        onError: handleDataNavError,
        staleTime: Infinity,
        cacheTime: Infinity,
    });

    useEffect(() => {
        /**
         * Note: - Swapping community data path check and shared with me path check will result in
         * incorrect relative path since their path overlaps
         * COMMUNITY_DATA_PATH: "/iplant/home/shared",
         * SHARED_WITH_ME_PATH: "/iplant/home",
         */
        if (dataRoots.length > 0 && path) {
            let index = 0;
            if (path.startsWith(userHomePath)) {
                index = dataRoots.findIndex(
                    (root) => root.path === userHomePath
                );
            } else if (path.startsWith(userTrashPath)) {
                index = dataRoots.findIndex(
                    (root) => root.path === userTrashPath
                );
            } else if (path.startsWith(communityDataPath)) {
                index = dataRoots.findIndex(
                    (root) => root.path === communityDataPath
                );
            } else if (path.startsWith(sharedWithMePath)) {
                index = dataRoots.findIndex(
                    (root) => root.path === sharedWithMePath
                );
            }
            setSelectedIndex(index < 0 ? 0 : index);
        }
    }, [
        dataRoots,
        path,
        userHomePath,
        userTrashPath,
        sharedWithMePath,
        communityDataPath,
    ]);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setAnchorEl(null);
        handlePathChange(dataRoots[index].path);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (dataRoots.length === 0) {
        const cacheRoots = queryClient.getQueryData(rootsQueryKeyArray);
        if (cacheRoots) {
            preProcessData(cacheRoots);
        }
        return null;
    }

    return (
        <>
            <List
                component="nav"
                aria-label={t("selectedDataRootMenuAriaLabel")}
                id={buildID(dataNavId, ids.DATA_ROOTS)}
                className={classes.list}
            >
                <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls={t("selectedDataRootAriaMenuItemControl")}
                    aria-label={dataRoots[selectedIndex].label}
                    onClick={handleClickListItem}
                    className={classes.selectedListItem}
                >
                    {dataRoots[selectedIndex].icon}
                    <ListItemText
                        id={buildID(
                            baseId,
                            ids.DATA_ROOTS,
                            dataRoots[selectedIndex].label
                        )}
                        primary={
                            <Typography className={classes.currentLocationLink}>
                                {dataRoots[selectedIndex].label}
                            </Typography>
                        }
                    />
                    <ListItemIcon style={{ minWidth: 20 }}>
                        <ArrowDropDownIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
            <Menu
                id={buildID(baseId, ids.DATA_ROOTS_MENU)}
                aria-haspopup="true"
                aria-controls={t("dataRootMenuAriaControl")}
                aria-label={t("dataRootsMenuAriaLabel")}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {dataRoots.map((menuItem, index) => (
                    <ListItem
                        id={buildID(
                            dataNavId,
                            ids.DATA_ROOTS_MENU,
                            ids.DATA_ROOTS_MENU_ITEM,
                            menuItem.label
                        )}
                        aria-controls={t("dataRootsMenuItemAriaControl")}
                        aria-label={menuItem.label}
                        key={menuItem.label}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        className={classes.listItem}
                    >
                        <ListItemIcon>{menuItem.icon}</ListItemIcon>
                        <ListItemText>
                            <Typography className={classes.listItemText}>
                                {menuItem.label}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </Menu>
            {!isMdDown && path && (!error || error.length === 0) ? (
                <BreadCrumb
                    baseId={dataNavId}
                    root={dataRoots[selectedIndex].path}
                    path={path}
                    handlePathChange={handlePathChange}
                    userHomePath={userHomePath}
                    userTrashPath={userTrashPath}
                    sharedWithMePath={sharedWithMePath}
                    communityDataPath={communityDataPath}
                />
            ) : (
                <div></div>
            )}

            {!isMdUp && path && (!error || error.length === 0) ? (
                <FolderSelectorMenu
                    baseId={dataNavId}
                    root={dataRoots[selectedIndex].path}
                    path={path}
                    handlePathChange={handlePathChange}
                    userHomePath={userHomePath}
                    userTrashPath={userTrashPath}
                    sharedWithMePath={sharedWithMePath}
                    communityDataPath={communityDataPath}
                />
            ) : (
                <div></div>
            )}
        </>
    );
}

export default Navigation;
