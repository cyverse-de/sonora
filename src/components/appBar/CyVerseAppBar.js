/**
 *
 * @author sriram
 * A component that displays app level tool bar with search and user menu.
 *
 */

import React from "react";
import intlData from "./messages";
import ids from "./ids";
import constants from "../../constants";

import {
    build,
    formatHTMLMessage,
    formatMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

import { useRouter } from "next/router";
import { injectIntl } from "react-intl";
import {
    AppBar,
    ButtonGroup,
    Button,
    ClickAwayListener,
    Grow,
    MenuList,
    MenuItem,
    Paper,
    Popper,
    IconButton,
    InputBase,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: theme.palette.primary,
    },
    title: {
        flexGrow: 1,
        display: "none",
        [theme.breakpoints.up("sm")]: {
            display: "block",
        },
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(1),
            width: "auto",
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
    user: {
        marginLeft: theme.spacing(1),
    },
    inputRoot: {
        color: "inherit",
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
}));
const searchOptions = ["All", "Data", "Apps", "Analyses"];

function CyverseAppBar(props) {
    const theme = useTheme();
    const classes = useStyles();
    const router = useRouter();
    const { intl, children } = props;

    const handleUserButtonClick = (event) => {
        const { user } = props.children.props;
        if (!user) {
            router.push("/login");
        }
    };

    return (
        <React.Fragment>
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <a
                            href={constants.CYVERSE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src="/cyverse_whitelogo.png"
                                alt="CyVerse"
                            ></img>
                        </a>
                        <Typography
                            className={classes.title}
                            variant="subtitle2"
                            noWrap
                        >
                            {formatHTMLMessage("discovery")}
                            <br />
                            {formatHTMLMessage("environment")}
                        </Typography>

                        <div
                            className={classes.search}
                            id={build(ids.APP_BAR_BASE_ID, ids.SEARCH)}
                        >
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder={formatMessage(intl, "search")}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{
                                    "aria-label": formatMessage(
                                        intl,
                                        "searchAriaLabel"
                                    ),
                                }}
                            />
                        </div>
                        <SearchOptions intl={intl} />
                        <div className={classes.user}>
                            <IconButton
                                id={build(
                                    ids.APP_BAR_BASE_ID,
                                    ids.USER_MENU_BTN
                                )}
                                aria-label={formatMessage(
                                    intl,
                                    "userMenuAriaLabel"
                                )}
                                onClick={(event) => {
                                    handleUserButtonClick(event);
                                }}
                            >
                                <AccountCircleIcon
                                    fontSize="large"
                                    style={{
                                        color:
                                            theme.palette.primary.contrastText,
                                    }}
                                />
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
                    style={{ backgroundColor: theme.palette.white }}
                >
                    {searchOptions[selectedIndex]}
                </Button>
                <Button
                    id={build(
                        ids.APP_BAR_BASE_ID,
                        ids.SEARCH_FILTER_OPTIONS_BTN
                    )}
                    style={{ backgroundColor: theme.palette.white }}
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
