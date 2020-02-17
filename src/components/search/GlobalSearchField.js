import React from "react";
import { formatMessage, withI18N } from "@cyverse-de/ui-lib";
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
            float: "left",
            margin: theme.spacing(1),
            width: "50%",
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
        color: theme.palette.white,
        borderRadius: 2,
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1),
        },
    },
    icon: { color: theme.palette.white },
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
            <div className={classes.search}>
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
