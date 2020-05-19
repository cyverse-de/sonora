import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
    Button,
    ClickAwayListener,
    Grid,
    Grow,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Tooltip,
    useMediaQuery,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { injectIntl } from "react-intl";
import { build, formatMessage, withI18N } from "@cyverse-de/ui-lib";
import ids from "./ids";
import intlData from "./messages";

const useStyles = makeStyles((theme) => ({
    paper: {
        flexShrink: 0,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    paginationItems: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        color: theme.palette.info,
    },
    buttonPadding: {
        paddingTop: theme.spacing(1.5),
    },
}));

const options = [25, 50, 100, 200, 500];

function ItemsPerPage(props) {
    const { onPageSizeChange, selectedPageSize, baseId, intl } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleMenuItemClick = (event, index) => {
        onPageSizeChange(options[index]);
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
    const menuId = build(baseId, ids.PAGE_SIZE_MENU);
    return (
        <>
            <Tooltip title={formatMessage(intl, "selectPageSize")}>
                <Button
                    className={classes.buttonPadding}
                    color="primary"
                    size="small"
                    ref={anchorRef}
                    aria-controls={open ? menuId : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-label={formatMessage(intl, "selectPageSize")}
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    {selectedPageSize} <ArrowDropDownIcon />
                </Button>
            </Tooltip>
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
                                <MenuList id={menuId}>
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option}
                                            selected={
                                                option === selectedPageSize
                                            }
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
        </>
    );
}

function DEPagination(props) {
    const classes = useStyles();
    const theme = useTheme();
    const {
        onChange,
        page,
        totalPages,
        onPageSizeChange,
        pageSize,
        baseId,
        intl,
    } = props;
    const matches = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item sm={4} md={5}></Grid>
                <Grid item>
                    <Pagination
                        id={build(baseId, ids.PAGINATION_TOOLBAR)}
                        size={matches ? "small" : "medium"}
                        className={classes.paginationItems}
                        count={totalPages}
                        variant="outlined"
                        onChange={onChange}
                        page={page}
                    />
                </Grid>
                <Grid item>
                    <ItemsPerPage
                        onPageSizeChange={onPageSizeChange}
                        selectedPageSize={pageSize}
                        baseId={baseId}
                        intl={intl}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}

export default withI18N(injectIntl(DEPagination), intlData);
