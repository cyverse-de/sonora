/**
 *
 * @author Sriram
 * A global search field with options to filter on apps, analyses and data
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import { useQuery } from "react-query";

import { getAnalyses } from "serviceFacades/analyses";
import { searchApps } from "serviceFacades/apps";
import { searchData } from "serviceFacades/filesystem";

import ids from "./ids";
import { build } from "@cyverse-de/ui-lib";

import SearchIcon from "@material-ui/icons/Search";
import {
    CircularProgress,
    FormControl,
    MenuItem,
    Select,
    Input,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    search: {
        position: "relative",
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
        },
    },
    input: {
        position: "relative",
        borderRadius: 0,
        backgroundColor: theme.palette.info.contrastText,
        color: theme.palette.info.main,
        "&:focus": {
            backgroundColor: theme.palette.info.contrastText,
        },
    },
}));

function GlobalSearchField(props) {
    const classes = useStyles();

    const { t } = useTranslation(["common"]);
    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");
    const [options, setOptions] = useState([]);

    const [analysesSearchKey, setAnalysesSearchKey] = useState();
    const [appsSearchKey, setAppsSearchKey] = useState();
    const [dataSearchKey, setDataSearchKey] = useState();

    const [
        analysesSearchQueryEnabled,
        setAnalysesSearchQueryEnabled,
    ] = useState(false);
    const [appsSearchQueryEnabled, setAppsSearchQueryEnabled] = useState(false);
    const [dataSearchQueryEnabled, setDataSearchQueryEnabled] = useState(false);

    const {
        isFetching: searchingAnalyses,
        error: analysesSearchError,
    } = useQuery({
        queryKey: analysesSearchKey,
        queryFn: getAnalyses,
        config: {
            enabled: analysesSearchQueryEnabled,
        },
    });

    const { isFetching: searchingApps, error: appsSearchError } = useQuery({
        queryKey: appsSearchKey,
        queryFn: searchApps,
        config: {
            enabled: appsSearchQueryEnabled,
        },
    });

    const { isFetching: searchingData, error: dataSearchError } = useQuery({
        queryKey: dataSearchKey,
        queryFn: searchData,
        config: {
            enabled: dataSearchQueryEnabled,
        },
    });

    const handleChange = (event, value, reason) => {
        console.log("handleChange=>" + value);
        setSearchText(value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);	      
    };

    useEffect(() => {
        if (searchText && searchText.length > 3) {
        }
    }, [searchText]);

    if (analysesSearchError || appsSearchError || dataSearchError) {
        console.log("error when searching...");
    }

    const getSearchResultLabel = (option) => {
        return option.name;
    };

    const loading = searchingAnalyses || searchingApps || searchingData;

    return (
        <>
            <Autocomplete
                freeSolo
                id="search"
                size="small"
                className={classes.search}
                options={options}
                value={searchText}
                onInputChange={handleChange}
                getOptionLabel={(option) => getSearchResultLabel(option)}
                loading={loading}
                renderInput={(params) => (
                    <Input
                        {...params}
                        size="small"
                        className={classes.input}
                        label="Search input"
                        margin="normal"
                        variant="outlined"
                        disableUnderline
                        onKeyPress={(event) =>
                            console.log(
                                "handleKeyPress=>" +
                                    event.target.value +
                                    "Key=" +
                                    event.key
                            )
                        }
                        startAdornment={<SearchIcon />}
                        endAdornment={
                            <>
                                {loading ? (
                                    <CircularProgress
                                        color="primary"
                                        size={20}
                                    />
                                ) : null}
                            </>
                        }
                    />
                )}
            />
            <FormControl>
                <Select
                    id={build(ids.SEARCH, ids.SEARCH_FILTER_MENU)}
                    value={filter}
                    onChange={handleFilterChange}
                    className={classes.input}
                    input={
                        <Input
                            size="small"
                            variant="outlined"
                            disableUnderline
                        />
                    }
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
