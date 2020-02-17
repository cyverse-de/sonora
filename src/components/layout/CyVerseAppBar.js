/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu.
 *
 */

import React, { useState } from "react";
import intlData from "./messages";
import ids from "./ids";
import constants from "../../constants";
import callApi from "../../common/callApi";

import { build, formatMessage, withI18N } from "@cyverse-de/ui-lib";

import { useRouter } from "next/router";
import { injectIntl } from "react-intl";
import {
    AppBar,
    Badge,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Divider,
    Drawer,
    Grow,
    Hidden,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import NotificationsIcon from "@material-ui/icons/Notifications";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";

import { useUserProfile } from "../../contexts/userProfile";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: theme.palette.bgGray,
        boxShadow: 0,
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.white,
        "&:hover": {
            backgroundColor: theme.palette.white,
        },
        marginRight: 0,
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(2),
            width: "100%",
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: 120,
            "&:focus": {
                width: 200,
            },
        },
    },
    drawerIcon: {
        height: 18,
        width: 18,
        paddingRight: 35,
    },
}));
const searchOptions = ["All", "Data", "Apps", "Analyses"];

function CyverseAppBar(props) {
    const classes = useStyles();
    const router = useRouter();
    const { intl, children } = props;
    const [userProfile, setUserProfile] = useUserProfile();
    const [drawerOpen, setDrawerOpen] = useState(false);

    React.useEffect(() => {
        const fetchUserProfile = async function() {
            const profile = await callApi({
                endpoint: "/api/profile",
                method: "GET",
                credentials: "include",
            });
            setUserProfile(profile);
        };
        fetchUserProfile();
    }, [setUserProfile]);

    const handleUserButtonClick = (event) => {
        console.log(userProfile);
        if (!userProfile) {
            router.push(`/login${router.asPath}`);
        }
    };
    const toggleDrawer = (open) => (event) => {
        setDrawerOpen(open);
    };
    return (
        <React.Fragment>
            <div className={classes.root}>
                <AppBar
                    position="static"
                    variant="outlined"
                    className={classes.appBar}
                >
                    <Toolbar>
                        <Hidden only={["sm", "md", "lg", "xl"]}>
                            <div>
                                <IconButton
                                    edge="start"
                                    className={classes.menuButton}
                                    color="primary"
                                    aria-label="open menu"
                                    onClick={toggleDrawer(true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </div>
                            <Drawer
                                open={drawerOpen}
                                onClose={toggleDrawer(false)}
                            >
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <ListItemText>Login</ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <img
                                            className={classes.drawerIcon}
                                            src="/dashboard.png"
                                        />
                                        <ListItemText>Dashboard</ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <img
                                            className={classes.drawerIcon}
                                            src="/data.png"
                                        />
                                        <ListItemText>Data</ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <img
                                            className={classes.drawerIcon}
                                            src="/apps.png"
                                        />
                                        <ListItemText>Apps</ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <img
                                            className={classes.drawerIcon}
                                            src="/analyses.png"
                                        />
                                        <ListItemText>Analyses</ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <SearchIcon />
                                        </ListItemIcon>
                                        <ListItemText>Search</ListItemText>
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>
                                        <ListItemText>Settings</ListItemText>
                                    </ListItem>
                                </List>
                            </Drawer>
                            <Typography color="primary">
                                Discovery Environment
                            </Typography>
                        </Hidden>
                        <Hidden xsDown>
                            <a
                                href={constants.CYVERSE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src="/de.png" alt="CyVerse"></img>
                            </a>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon color="primary" />
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ "aria-label": "search" }}
                                />
                            </div>
                            <div>
                                <SearchOptions intl={intl} />
                            </div>
                        </Hidden>
                        <div className={classes.root} />
                        <div style={{ display: "flex" }}>
                            <IconButton
                                aria-label="show new notifications"
                                color="primary"
                            >
                                <Badge badgeContent={17} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="account of current user"
                                aria-controls="menudId1"
                                aria-haspopup="true"
                                color="primary"
                                onClick={handleUserButtonClick}
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
            {children}
        </React.Fragment>
    );
}

function SearchOptions(props) {
    const { intl } = props;
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
        //as of now do nothing
        console.info(`You clicked ${searchOptions[selectedIndex]}`);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    return (
        <Paper>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label={formatMessage(intl, "searchFilterAriaLabel")}
            >
                <Button
                    id={build(ids.APP_BAR_BASE_ID, ids.SEARCH_FILTER_BTN)}
                    onClick={handleClick}
                    style={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.white,
                    }}
                >
                    {searchOptions[selectedIndex]}
                </Button>
                <Button
                    id={build(
                        ids.APP_BAR_BASE_ID,
                        ids.SEARCH_FILTER_OPTIONS_BTN
                    )}
                    style={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.white,
                    }}
                    size="small"
                    aria-controls={
                        open
                            ? formatMessage(intl, "searchFilterAriaControl")
                            : undefined
                    }
                    aria-expanded={open ? "true" : undefined}
                    aria-label={formatMessage(
                        intl,
                        "searchFilterMenuAriaLabel"
                    )}
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === "bottom"
                                    ? "center top"
                                    : "center bottom",
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    id={build(
                                        ids.APP_BAR_BASE_ID,
                                        ids.SEARCH_FILTER_MENU
                                    )}
                                >
                                    {searchOptions.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            id={build(
                                                ids.APP_BAR_BASE_ID,
                                                ids.SEARCH_FILTER_MENU +
                                                    "." +
                                                    option
                                            )}
                                            selected={index === selectedIndex}
                                            onClick={(event) =>
                                                handleMenuItemClick(
                                                    event,
                                                    index
                                                )
                                            }
                                        >
                                            {option}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Paper>
    );
}

export default withI18N(injectIntl(CyverseAppBar), intlData);
