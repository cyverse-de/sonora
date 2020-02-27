/**
 * @author sriram
 *
 * A component that displays Roots folders and breadcrumbs for Data navigation.
 * On smaller screens, breadcrumbs are replaced by dropdown menu of folder paths.
 *
 */

import React, { useEffect, useState } from "react";
import callApi from "../../common/callApi";
import { build, formatMessage, withI18N } from "@cyverse-de/ui-lib";
import intlData from "./messages";
import {
    Breadcrumbs,
    Hidden,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
    Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";

import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import FolderIcon from "@material-ui/icons/Folder";
import { useRouter } from "next/router";
import NavigationConstants from "../layout/NavigationConstants";
import constants from "../../constants";
import ids from "./ids";

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
    breadCrumbLink: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        display: "inline-block",
        maxWidth: 150,
    },
    currentLocationLink: {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        display: "inline-block",
        maxWidth: 90,
    },
}));

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
    pathItems = relativePath.split("/").slice(1);
    return pathItems;
}

/**
 * Computes the path for routing.
 *  * @example
 * // returns "/data?path=/iplant/home/ipctest/analyses"
 * getPathItems("/iplant/home/ipctest","/analyses/wordcount/logs", 0);
 * @param {string }root - CyVerse Data Store root path e.g: /iplant/home/ipctest
 * @param {string} relativePath - relative path to CyVerse Data Store e.g: /analyses/wordcount/logs
 * @param {integer} selectedPathItemIndex - index of the selected path item
 * @returns {string} - path to be used by the nextjs router
 */
function pathToRoute(root, relativePath, selectedPathItemIndex) {
    const relativePathItems = getPathItems(relativePath);
    const reducer = (accumulator, currentVal, idx) => {
        if (idx <= selectedPathItemIndex) {
            return accumulator + "/" + currentVal;
        }
        return accumulator;
    };
    const routerPath = relativePathItems.reduce(reducer);
    console.log(
        "reduced path=>" +
            routerPath +
            " path index=>" +
            selectedPathItemIndex +
            " relative path=>" +
            relativePathItems.length
    );

    return "/" + NavigationConstants.DATA + `/?path=${root}/${routerPath}`;
}

/**
 * Get relative path to CyVerse Data Store path.
 *  * @example
 * // returns "/analyses/wordcount/logs"
 * getRelativePath("/iplant/home/ipctest/analyses/wordcount/logs","/iplant/home/ipctest",
 * "/iplant/trash/home/de-irods/ipctest");
 * @param {string} path -  CyVerse Data Store path
 * @param {string} userHomePath - Users home folder path
 * @param {string} userTrashPath - Users trash folder path
 * @returns {string} relativePath - relative path to CyVerse Data Store e.g: /analyses/wordcount/logs
 */
function getRelativePath(path, userHomePath, userTrashPath) {
    let relativePath = "";
    if (path.indexOf(userHomePath) !== -1) {
        relativePath = path.replace(userHomePath, "");
    } else if (path.indexOf(userTrashPath) !== -1) {
        relativePath = path.replace(userTrashPath, "");
    } else if (path.indexOf(constants.COMMUNITY_DATA_PATH) !== -1) {
        relativePath = path.replace(constants.COMMUNITY_DATA_PATH, "");
    } else if (path.indexOf(constants.SHARED_WITH_ME_PATH) !== -1) {
        relativePath = path.replace(constants.SHARED_WITH_ME_PATH, "");
    }
    return relativePath;
}

function PathSelectorMenu({ root, path, userHomePath, userTrashPath, baseId }) {
    const classes = useStyles();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const relativePath = getRelativePath(path, userHomePath, userTrashPath);
    const pathItems = getPathItems(relativePath);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        console.log(
            "selected index=>" + pathItems.length > 0 ? pathItems.length - 1 : 0
        );
        setSelectedIndex(pathItems.length > 0 ? pathItems.length - 1 : 0);
    }, [pathItems]);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        const relativePath = getRelativePath(path, userHomePath, userTrashPath);
        router.push(pathToRoute(root, relativePath, index));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        pathItems.length > 0 && (
            <>
                <List
                    component="nav"
                    aria-label="Data Current Location"
                    id={build(baseId, ids.PATH_ITEMS)}
                >
                    <ListItem
                        button
                        aria-haspopup="true"
                        aria-controls="Data current menu"
                        aria-label="Current Data Location"
                        onClick={handleClickListItem}
                        className={classes.selectedListItem}
                    >
                        <>
                            {
                                <>
                                    <ArrowRightIcon /> <FolderIcon />
                                </>
                            }
                            <ListItemText
                                id={build(
                                    baseId,
                                    ids.PATH_ITEMS,
                                    ids.SELECTED_PATH_ITEM
                                )}
                                className={classes.currentLocationLink}
                                primary={pathItems[selectedIndex]}
                            />
                            <ListItemIcon>
                                <ArrowDropDownIcon />
                            </ListItemIcon>
                        </>
                    </ListItem>
                </List>

                <Menu
                    id={build(baseId, ids.PATH_ITEMS_MENU)}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {pathItems.map((crumb, index) => (
                        <ListItem
                            id={build(
                                baseId,
                                ids.PATH_ITEMS_MENU,
                                ids.PATH_ITEMS_MENU_ITEM
                            )}
                            key={crumb}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                                handleMenuItemClick(event, index)
                            }
                            className={classes.list}
                        >
                            <ListItemIcon>
                                <FolderIcon />
                            </ListItemIcon>
                            <ListItemText>{crumb}</ListItemText>
                        </ListItem>
                    ))}
                </Menu>
            </>
        )
    );
}

function BreadCrumb({ root, path, userHomePath, userTrashPath, baseId }) {
    const router = useRouter();
    const classes = useStyles();
    const relativePath = getRelativePath(path, userHomePath, userTrashPath);

    const handleClick = (event, relativePath, crumb) => {
        event.preventDefault();
        const relativePathItems = getPathItems(relativePath);
        const index = relativePathItems.indexOf((item) => item === crumb);
        router.push(pathToRoute(root, relativePath, index));
    };

    return (
        <Breadcrumbs
            maxItems={2}
            aria-label="breadcrumb"
            id={build(baseId, ids.BREADCRUMBS)}
        >
            {getPathItems(relativePath).map((crumb) => (
                <>
                    <FolderIcon color="primary" />
                    <Tooltip title={crumb}>
                        <Link
                            id={build(
                                baseId,
                                ids.BREADCRUMBS,
                                ids.PATH_ITEM,
                                crumb
                            )}
                            key={crumb}
                            color="inherit"
                            href="#"
                            onClick={(event) =>
                                handleClick(event, relativePath, crumb)
                            }
                            className={classes.breadCrumbLink}
                        >
                            {crumb}
                        </Link>
                    </Tooltip>
                </>
            ))}
        </Breadcrumbs>
    );
}

function DataNavigation(props) {
    const { path, error, baseId, intl } = props;
    const router = useRouter();
    const classes = useStyles();
    const [dataRoots, setDataRoots] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [userHomePath, setUserHomePath] = useState("");
    const [userTrashPath, setUserTrashPath] = useState("");
    const dataNavId = build(baseId, ids.DATA_NAVIGATION);

    useEffect(() => {
        callApi({
            endpoint: `/api/filesystem/root`,
        }).then((respData) => {
            if (respData) {
                const roots = getDataRoots(respData.roots);
                setDataRoots(roots);
                setBasePaths(respData["base-paths"]);
                if ((!error || error.length === 0) && !path) {
                    setDefaultPath(roots, roots[0].path);
                }
            }
        });
    }, [path]);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        router.push(
            "/" + NavigationConstants.DATA + `?path=${dataRoots[index].path}`
        );
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const getDataRoots = (roots) => {
        const menuItems = [];
        if (roots) {
            const home = roots.find(
                (root) =>
                    root.label !== formatMessage(intl, "trash") &&
                    root.label !== formatMessage(intl, "sharedWithMe") &&
                    root.label !== formatMessage(intl, "communityData")
            );
            home.icon = <HomeIcon />;
            const sharedWithMe = roots.find((root) => {
                return root.label === formatMessage(intl, "sharedWithMe");
            });
            sharedWithMe.icon = <FolderSharedIcon />;
            const communityData = roots.find(
                (root) => root.label === formatMessage(intl, "communityData")
            );
            communityData.icon = <GroupIcon />;
            const trash = roots.find(
                (root) => root.label === formatMessage(intl, "trash")
            );
            trash.icon = <DeleteIcon />;
            menuItems.push(home, sharedWithMe, communityData, trash);
        }
        return menuItems;
    };

    const setBasePaths = (basePaths) => {
        console.log("home=>" + basePaths["user_home_path"]);
        console.log("trash=>" + basePaths["user_trash_path"]);
        setUserHomePath(basePaths["user_home_path"]);
        setUserTrashPath(basePaths["user_trash_path"]);
    };

    const setDefaultPath = (roots, path) => {
        //set default path after getting roots.
        const idx = roots.findIndex((root) => path.includes(root.path));
        console.log("selected index=>" + idx);
        console.log("path=>" + path);
        console.log("roots.size=>" + roots.length);
        setSelectedIndex(idx);
        router.push("/" + NavigationConstants.DATA + `?path=${path}`);
    };

    if (dataRoots.length === 0) {
        return null;
    }
    return (
        dataRoots.length > 0 && (
            <>
                <List
                    component="nav"
                    aria-label="Data Root Location"
                    id={build(dataNavId, ids.DATA_ROOTS)}
                >
                    <ListItem
                        button
                        aria-haspopup="true"
                        aria-controls="Data root menu"
                        aria-label="Data Location"
                        onClick={handleClickListItem}
                        className={classes.selectedListItem}
                    >
                        <>
                            {dataRoots[selectedIndex].icon}
                            <ListItemText
                                id={build(
                                    baseId,
                                    ids.DATA_ROOTS,
                                    dataRoots[selectedIndex].label
                                )}
                                primary={
                                    dataRoots.length > 0
                                        ? dataRoots[selectedIndex].label
                                        : ""
                                }
                            />
                            <ListItemIcon>
                                <ArrowDropDownIcon />
                            </ListItemIcon>
                        </>
                    </ListItem>
                </List>
                <Menu
                    id={build(baseId, ids.DATA_ROOTS_MENU)}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {dataRoots.map((menuItem, index) => (
                        <ListItem
                            id={build(
                                dataNavId,
                                ids.DATA_ROOTS_MENU,
                                ids.DATA_ROOTS_MENU_ITEM,
                                dataRoots[selectedIndex].label
                            )}
                            key={menuItem.label}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                                handleMenuItemClick(event, index)
                            }
                            className={classes.list}
                        >
                            <ListItemIcon>{menuItem.icon}</ListItemIcon>
                            <ListItemText>{menuItem.label}</ListItemText>
                        </ListItem>
                    ))}
                </Menu>

                <Hidden xsDown>
                    {path && (!error || error.toString().length === 0) ? (
                        <BreadCrumb
                            baseId={dataNavId}
                            root={dataRoots[selectedIndex].path}
                            path={path}
                            userHomePath={userHomePath}
                            userTrashPath={userTrashPath}
                        />
                    ) : (
                        <div></div>
                    )}
                </Hidden>
                <Hidden only={["sm", "md", "lg", "xl"]}>
                    {path && (!error || error.toString().length === 0) ? (
                        <PathSelectorMenu
                            baseId={dataNavId}
                            root={dataRoots[selectedIndex].path}
                            path={path}
                            userHomePath={userHomePath}
                            userTrashPath={userTrashPath}
                        />
                    ) : (
                        <div></div>
                    )}
                </Hidden>
            </>
        )
    );
}

export default withI18N(injectIntl(DataNavigation), intlData);
