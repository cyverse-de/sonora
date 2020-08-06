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
import { simpleQueryTemplate, buildQuery } from "./dataSearchQueryBuilder";
import { build } from "@cyverse-de/ui-lib";

import SearchIcon from "@material-ui/icons/Search";
import {
    CircularProgress,
    MenuItem,
    Select,
    TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { json } from "express";

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
    searchFilter: {
        marginRight: theme.spacing(4),
        height: theme.spacing(3.6),
        borderRadius: 0,
        width: 100,
        backgroundColor: theme.palette.info.contrastText,
        color: theme.palette.info.main,
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1),
        },
    },
    input: {
        position: "relative",
        height: theme.spacing(3.6),
        borderRadius: 0,
        backgroundColor: theme.palette.info.contrastText,
        color: theme.palette.info.main,
        "&:focus": {
            backgroundColor: theme.palette.info.contrastText,
        },
    },
}));

const analysesfilter = {
    field: "",
    value: "",
};

function GlobalSearchField(props) {
    const classes = useStyles();

    const { t } = useTranslation(["common"]);

    const [searchText, setSearchText] = useState("");
    const [filter, setFilter] = useState("all");

    const [options, setOptions] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);

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
            onSuccess: (results) => {
                if (results && results.analyses?.length > 0) {
                    const analyses = results.analyses;
                    const analysesSearchResults = analyses.map((analysis) => ({
                        name: analysis.name,
                    }));
                    setOptions([...options, ...analysesSearchResults]);
                }
            },
        },
    });

    const { isFetching: searchingApps, error: appsSearchError } = useQuery({
        queryKey: appsSearchKey,
        queryFn: searchApps,
        config: {
            enabled: appsSearchQueryEnabled,
            onSuccess: (results) => {
                if (results && results.apps?.length > 0) {
                    const apps = results.apps;
                    const appsSearchResults = apps.map((app) => ({
                        name: app.name,
                    }));
                    setOptions([...options, ...appsSearchResults]);
                }
            },
        },
    });

    const { isFetching: searchingData, error: dataSearchError } = useQuery({
        queryKey: dataSearchKey,
        queryFn: searchData,
        config: {
            enabled: dataSearchQueryEnabled,
            onSuccess: (results) => {
                if (results && results.hits?.length > 0) {
                    const data = results.hits;
                    const dataSearchResults = data.map((data) => ({
                        name: data._source?.label,
                    }));
                    setOptions([...options, ...dataSearchResults]);
                }
            },
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
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    useEffect(() => {
        console.log("selected value=>" + JSON.stringify(value));
    }, [value]);

    useEffect(() => {
        const searchFilters = [];
        if (searchText && searchText.length > 2) {
            const nameFilterObj = Object.create(analysesfilter);
            nameFilterObj.field = "name";
            nameFilterObj.value = searchText;
            searchFilters.push(nameFilterObj);

            const appNameFilterObj = Object.create(analysesfilter);
            appNameFilterObj.field = "app_name";
            appNameFilterObj.value = searchText;
            searchFilters.push(appNameFilterObj);

            const filterString = searchFilters
                .map((filterItem) => JSON.stringify(filterItem))
                .join(",");

            setAnalysesSearchKey([
                "analysesSearch",
                {
                    rowsPerPage: 10,
                    orderBy: "startdate",
                    order: "desc",
                    page: 0,
                    filter: filterString,
                },
            ]);
            setAnalysesSearchQueryEnabled(true);

            setAppsSearchKey([
                "appsSearch",
                {
                    search: searchText,
                    rowsPerPage: 10,
                    orderBy: "name",
                    order: "asc",
                    page: 0,
                },
            ]);
            setAppsSearchQueryEnabled(true);

            const template = simpleQueryTemplate(searchText);
            const query = buildQuery(template);
            console.log("QUERY is =>" + JSON.stringify(query));
            query.size = 10;
            query.from = 0;
            query.sort = [
                {
                    field: "label",
                    order: "ascending",
                },
            ];
            console.log("Final Query to submit =>" + JSON.stringify(query));
            setDataSearchKey(["dataSearch", { query }]);
            setDataSearchQueryEnabled(true);
        }
    }, [searchText]);

    if (analysesSearchError || appsSearchError || dataSearchError) {
        console.log("error when searching...");
    }

    const loading = searchingAnalyses || searchingApps || searchingData;

    return (
        <>
            <Autocomplete
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                freeSolo
                id="search"
                size="small"
                className={classes.search}
                options={options}
                onInputChange={handleChange}
                getOptionSelected={(option, value) =>
                    option.name === value.name
                }
                filterOptions={(options, state) => options}
                getOptionLabel={(option) => option.name}
                loading={loading}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        className={classes.input}
                        InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                            startAdornment: <SearchIcon color="primary" />,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? (
                                        <CircularProgress
                                            color="primary"
                                            size={20}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
            <Select
                id={build(ids.SEARCH, ids.SEARCH_FILTER_MENU)}
                value={filter}
                onChange={handleFilterChange}
                disableUnderline
                className={classes.searchFilter}
                size="small"
                renderInput={() => <TextField size="small" disableUnderline />}
            >
                <MenuItem value="all">{t("all")}</MenuItem>
                <MenuItem value="data">{t("data")}</MenuItem>
                <MenuItem value="apps">{t("apps")}</MenuItem>
                <MenuItem value="analyses">{t("analyses")}</MenuItem>
            </Select>
        </>
    );
}

export default GlobalSearchField;
