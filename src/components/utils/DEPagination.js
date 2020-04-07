import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
    Button,
    ClickAwayListener,
    Grid,
    Grow,
    Hidden,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    useMediaQuery,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme) => ({
    paper: {
        flexGrow: 1,
        marinTop: theme.spacing(1),
    },
    paginationItems: {
        paddingTop: theme.spacing(1),
        color: theme.palette.info,
    },
    buttonPadding: {
        paddingTop: theme.spacing(1),
    },
}));

const options = [25, 50, 100, 200, 500];

function ItemsPerPage(props) {
    const { onPageSizeChange, selectedPageSize } = props;
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

    return (
        <>
            <Button
                className={classes.buttonPadding}
                color="primary"
                size="small"
                ref={anchorRef}
                aria-controls={open ? "page-size-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select page size"
                aria-haspopup="menu"
                onClick={handleToggle}
            >
                {selectedPageSize} <ArrowDropDownIcon />
            </Button>

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
                                <MenuList id="page-size-button-menu">
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

export default function DEPagination(props) {
    const classes = useStyles();
    const theme = useTheme();
    const { onChange, page, totalPages, onPageSizeChange, pageSize } = props;
    const matches = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Paper className={classes.paper}>
            <Grid container spacing={1}>
                <Hidden mdDown>
                    <Grid item xs={1} sm={4}></Grid>
                </Hidden>
                <Grid item>
                    <Pagination
                        size={matches ? "small" : "medium"}
                        className={classes.paginationItems}
                        count={totalPages}
                        variant="outlined"
                        onChange={onChange}
                        page={page}
                    />
                </Grid>
                <Grid item xs={1} sm={4}>
                    <ItemsPerPage
                        onPageSizeChange={onPageSizeChange}
                        selectedPageSize={pageSize}
                    />
                </Grid>
            </Grid>
        </Paper>
    );
}
