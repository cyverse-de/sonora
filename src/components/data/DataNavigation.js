/**
 * @author sriram
 *
 * A component that displays breadcrumbs for Data navigation.
 *
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
        maxWidth: 100,
    },
}));

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

function CurrentLocation({ root, path, userHomePath, userTrashPath }) {
    const classes = useStyles();
    const [relativePathItems, setRelativePathItems] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const relativePath = getRelativePath(path, userHomePath, userTrashPath);
        const pathItems = relativePath.split("/").slice(1);
        setRelativePathItems(pathItems);
        setSelectedIndex(pathItems.length > 0 ? pathItems.length - 1 : 0);
        console.log("relative path=>" + pathItems);
        console.log("path items size=>" + pathItems.length);
    }, [path]);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        /*   router.push(
            "/" + NavigationConstants.DATA + `?path=${dataRoots[index].path}`
        );*/
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
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
                    {relativePathItems.length > 0 && (
                        <>
                            /{<FolderIcon />}
                            <ListItemText
                                className={classes.currentLocationLink}
                                primary={relativePathItems[selectedIndex]}
                            />
                            <ListItemIcon>
                                <ArrowDropDownIcon />
                            </ListItemIcon>
                        </>
                    )}
                </ListItem>
            </List>
            {relativePathItems.length > 0 && (
                <Menu
                    id="lock-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {relativePathItems.map((crumb, index) => (
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
            )}
        </>
    );
}

function BreadCrumb({ root, path, userHomePath, userTrashPath }) {
    const router = useRouter();
    const classes = useStyles();
    const handleClick = (event, relativePath, crumb) => {
        event.preventDefault();
        let pathToRoute = "";
        const pathItems = relativePath.split("/");
        for (let i = 0; i < pathItems.length; i++) {
            if (pathItems[i] === crumb) {
                console.log("matched");
                break;
            } else if (pathItems[i] !== "") {
                pathToRoute = pathToRoute + "/" + pathItems[i];
            }
        }
        router.push(
            "/" +
                NavigationConstants.DATA +
                "?path=" +
                root +
                "/" +
                pathToRoute +
                crumb
        );
    };
    const relativePath = getRelativePath(path, userHomePath, userTrashPath);
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

function BreadCrumbs(props) {
    const { path, intl } = props;
    const router = useRouter();
    const classes = useStyles();
    const [dataRoots, setDataRoots] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [userHomePath, setUserHomePath] = useState("");
    const [userTrashPath, setUserTrashPath] = useState("");

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

        setDefaultPath(0, path ? path : menuItems[0].path);
        return menuItems;
    };

    const setBasePaths = (basePaths) => {
        console.log("user home=>" + basePaths["user_home_path"]);
        setUserHomePath(basePaths["user_home_path"]);
        setUserTrashPath(basePaths["user_trash_path"]);
    };

    const setDefaultPath = (index, path) => {
        //set default path after getting roots.
        setSelectedIndex(index);
        router.push("/" + NavigationConstants.DATA + `?path=${path}`);
    };

    useEffect(() => {
        callApi({
            endpoint: `/api/filesystem/root`,
        }).then((respData) => {
            if (respData) {
                setDataRoots(getDataRoots(respData.roots));
                setBasePaths(respData["base-paths"]);
            }
        });
    }, []);

    return (
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
                    {dataRoots.length > 0 && (
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
                    )}
                </ListItem>
            </List>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {dataRoots.length > 0 &&
                    dataRoots.map((menuItem, index) => (
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
                {dataRoots.length > 0 && path && (
                    <BreadCrumb
                        root={dataRoots[selectedIndex].path}
                        path={path}
                        userHomePath={userHomePath}
                        userTrashPath={userTrashPath}
                    />
                )}
            </Hidden>
            <Hidden only={["sm", "md", "lg", "xl"]}>
                {dataRoots.length > 0 && path && (
                    <CurrentLocation
                        root={dataRoots[selectedIndex].path}
                        path={path}
                        userHomePath={userHomePath}
                        userTrashPath={userTrashPath}
                    />
                )}
            </Hidden>
        </>
    );
}

export default withI18N(injectIntl(BreadCrumbs), intlData);
