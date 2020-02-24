/**
 *
 * @author Sriram
 * A component that global search field with options to filter on apps, analyses and data
 */
import React from "react";
import ids from "./ids";
import { build, formatMessage, withI18N } from "@cyverse-de/ui-lib";
import intlData from "../layout/messages";
import NavigationConstants from "../layout/NavigationConstants";

import SearchIcon from "@material-ui/icons/Search";
import {
    FormControl,
    InputAdornment,
    InputBase,
    MenuItem,
    Select,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.white,
        "&:hover": {
            backgroundColor: theme.palette.white,
        },
        marginRight: 0,
        marginLeft: 0,
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(2),
            width: "70%",
        },
        [theme.breakpoints.down("xs")]: {
            backgroundColor: theme.palette.bgGray,
            float: "left",
            margin: theme.spacing(1),
            width: "60%",
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
    searchFilter: {
        width: 100,
        marginRight: theme.spacing(4),
        paddingLeft: theme.spacing(1),
        border: 1,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: 2,
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1),
            width: 90,
        },
    },
    icon: { color: theme.palette.primary.contrastText },
}));

function GlobalSearchField(props) {
    const classes = useStyles();
    const router = useRouter();
    const { intl } = props;
    const [searchText, setSearchText] = React.useState("");
    const [filter, setFilter] = React.useState("all");

    const handleChange = (event) => {
        setSearchText(event.target.value);
    };
    const handleKeyPress = (event) => {
        if (event.target.value.length >= 3 && event.key === "Enter") {
            router.push(
                "/" +
                    NavigationConstants.SEARCH +
                    "?searchTerm=" +
                    event.target.value +
                    "&filter=" +
                    filter
            );
        }
    };
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };
    return (
        <>
            <div id={ids.SEARCH} className={classes.search}>
                <InputBase
                    placeholder={formatMessage(intl, "search")}
                    value={searchText}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon color="primary" />
                        </InputAdornment>
                    }
                />
            </div>
            <FormControl>
                <Select
                    id={build(ids.SEARCH, ids.SEARCH_FILTER_MENU)}
                    autoWidth={true}
                    value={filter}
                    onChange={handleFilterChange}
                    className={classes.searchFilter}
                    inputProps={{
                        classes: {
                            icon: classes.icon,
                        },
                    }}
                >
                    <MenuItem value="all">
                        {formatMessage(intl, "all")}
                    </MenuItem>
                    <MenuItem value="data">
                        {formatMessage(intl, "data")}
                    </MenuItem>
                    <MenuItem value="apps">
                        {formatMessage(intl, "apps")}
                    </MenuItem>
                    <MenuItem value="analyses">
                        {formatMessage(intl, "analyses")}
                    </MenuItem>
                </Select>
            </FormControl>
        </>
    );
}

export default withI18N(injectIntl(GlobalSearchField), intlData);
