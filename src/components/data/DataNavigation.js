/**
 * @author sriram
 *
 * A component that displays Roots folders and breadcrumbs for Data navigation.
 * On smaller screens, breadcrumbs are replaced by dropdown menu of folder path.
 *
 */

import React, { useEffect, useState } from "react";
import callApi from "../../common/callApi";
import { formatMessage, withI18N } from "@cyverse-de/ui-lib";
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

function getPathItems(relativePath) {
    let pathItems = [];
    pathItems = relativePath.split("/").slice(1);
    return pathItems;
}

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

function PathSelectorMenu({ root, path, userHomePath, userTrashPath }) {
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
                <List component="nav" aria-label="Data Current Location">
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
                    id="lock-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {pathItems.map((crumb, index) => (
                        <ListItem
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

function BreadCrumb({ root, path, userHomePath, userTrashPath }) {
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
        <Breadcrumbs maxItems={2} aria-label="breadcrumb">
            {relativePath.split("/").map((crumb) => (
                <Tooltip title={crumb}>
                    <Link
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
            ))}
        </Breadcrumbs>
    );
}

function DataNavigation(props) {
    const { path, error, intl } = props;
    const router = useRouter();
    const classes = useStyles();
    const [dataRoots, setDataRoots] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [userHomePath, setUserHomePath] = useState("");
    const [userTrashPath, setUserTrashPath] = useState("");

    useEffect(() => {
        callApi({
            endpoint: `/api/filesystem/root`,
        }).then((respData) => {
            if (respData) {
                const roots = getDataRoots(respData.roots);
                setDataRoots(roots);
                setBasePaths(respData["base-paths"]);
                if (error === null || error.length === 0) {
                    setDefaultPath(roots, path ? path : roots[0].path);
                }
            }
        });
    });

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
                <List component="nav" aria-label="Data Root Location">
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
                    id="lock-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {dataRoots.map((menuItem, index) => (
                        <ListItem
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
                    {path && (error === null || error.length === 0) ? (
                        <BreadCrumb
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
                    {path && (error === null || error.length === 0) ? (
                        <PathSelectorMenu
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
