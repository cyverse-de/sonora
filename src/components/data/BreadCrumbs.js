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
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Menu,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";

import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import DeleteIcon from "@material-ui/icons/Delete";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { useRouter } from "next/router";
import NavigationConstants from "../layout/NavigationConstants";

const useStyles = makeStyles((theme) => ({
    icon: { color: theme.palette.primary.main },
}));

function BreadCrumb({ root, path, userHomePath, userTrashPath }) {
    const router = useRouter();
    const handleClick = (event, updatedPath, crumb) => {
        event.preventDefault();
        let pathToRoute = "";
        const pathItems = updatedPath.split("/");
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

    let updatedPath = path;
    if (path.indexOf(userHomePath) !== -1) {
        updatedPath = path.replace(userHomePath, "");
    } else if (path.indexOf(userTrashPath) !== -1) {
        updatedPath = path.replace(userTrashPath, "");
    } else if (path.indexOf("/iplant/home/shared") !== -1) {
        updatedPath = path.replace("/iplant/home/shared", "");
    }
    return (
        <Breadcrumbs maxItems={2} aria-label="breadcrumb">
            {updatedPath.split("/").map((crumb) => (
                <Link
                    color="inherit"
                    href="#"
                    onClick={(event) => handleClick(event, updatedPath, crumb)}
                >
                    {crumb}
                </Link>
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
    const [trashBasePath, setTrashBasePath] = useState("");

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
            home.icon = <HomeIcon color="inherit" />;
            const sharedWithMe = roots.find((root) => {
                return root.label === formatMessage(intl, "sharedWithMe");
            });
            sharedWithMe.icon = <FolderSharedIcon color="inherit" />;
            const communityData = roots.find(
                (root) => root.label === formatMessage(intl, "communityData")
            );
            communityData.icon = <GroupIcon color="inherit" />;
            const trash = roots.find(
                (root) => root.label === formatMessage(intl, "trash")
            );
            trash.icon = <DeleteIcon color="inherit" />;
            menuItems.push(home, sharedWithMe, communityData, trash);
        }

        setDefaultPath(0, menuItems[0].path);
        return menuItems;
    };

    const setBasePaths = (basePaths) => {
        console.log("user home=>" + basePaths["user_home_path"]);
        setUserHomePath(basePaths["user_home_path"]);
        setTrashBasePath(basePaths["base_trash_path"]);
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
            <List component="nav" aria-label="Data Location">
                <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="Data root menu"
                    aria-label="Data Location"
                    onClick={handleClickListItem}
                    className={classes.icon}
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
                        >
                            <ListItemIcon style={{ cursor: "pointer" }}>
                                {menuItem.icon}
                            </ListItemIcon>
                            <ListItemText style={{ cursor: "pointer" }}>
                                {menuItem.label}
                            </ListItemText>
                        </ListItem>
                    ))}
            </Menu>

            {dataRoots.length > 0 && path && (
                <BreadCrumb
                    root={dataRoots[selectedIndex].path}
                    path={path}
                    userHomePath={userHomePath}
                    userTrashPath={userTrashPath}
                />
            )}
        </>
    );
}

export default withI18N(injectIntl(BreadCrumbs), intlData);
