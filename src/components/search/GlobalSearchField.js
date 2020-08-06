/**
 *
 * @author Sriram
 * A global search field with options to filter on apps, analyses and data
 */
import React from "react";
import { useTranslation } from "i18n";
import { useRouter } from "next/router";

import ids from "./ids";
import { build } from "@cyverse-de/ui-lib";
import NavigationConstants from "../../common/NavigationConstants";

import SearchIcon from "@material-ui/icons/Search";
import {
    FormControl,
    InputAdornment,
    InputBase,
    MenuItem,
    Select,
} from "@material-ui/core";

import { makeStyles, withStyles } from "@material-ui/core/styles";

const CustomInput = withStyles((theme) => ({
    root: {
        "label + &": {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        position: "relative",
        borderRadius: 0,
        backgroundColor: theme.palette.white,
        fontSize: 16,
        color: theme.palette.info.main,
        padding: "7px 19px 7px 9px",
        "&:focus": {
            backgroundColor: theme.palette.white,
        },
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
    search: {
        position: "relative",
        backgroundColor: theme.palette.white,
        "&:hover": {
            backgroundColor: theme.palette.white,
        },
        marginRight: 0,
        marginLeft: 0,
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(2),
            width: "60%",
        },
        [theme.breakpoints.down("xs")]: {
            backgroundColor: theme.palette.bgGray,
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
        marginRight: theme.spacing(4),
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1),
            width: 90,
        },
    },
}));

function GlobalSearchField(props) {
    const classes = useStyles();
    const { t } = useTranslation(["common"]);
    const router = useRouter();
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
                    placeholder={t("search")}
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
                    value={filter}
                    variant="outlined"
                    onChange={handleFilterChange}
                    className={classes.searchFilter}
                    input={<CustomInput />}
                >
                    <MenuItem value="all">{t("all")}</MenuItem>
                    <MenuItem value="data">{t("data")}</MenuItem>
                    <MenuItem value="apps">{t("apps")}</MenuItem>
                    <MenuItem value="analyses">{t("analyses")}</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}

export default GlobalSearchField;
