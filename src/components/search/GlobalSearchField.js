/**
 *
 * @author Sriram
 * A global search field with options to filter on apps, analyses and data
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from "i18n";

import { useQuery, queryCache } from "react-query";

import { BOOTSTRAP_KEY } from "serviceFacades/users";
import {
    getAnalyses,
    ANALYSES_SEARCH_QUERY_KEY,
} from "serviceFacades/analyses";
import { searchApps, APPS_SEARCH_QUERY_KEY } from "serviceFacades/apps";
import { searchData, DATA_SEARCH_QUERY_KEY } from "serviceFacades/filesystem";

import appFields from "components/apps/AppFields";
import analysisFields from "components/analyses/analysisFields";

import ids from "./ids";
import { getDataSimpleSearchQuery } from "./dataSearchQueryBuilder";
import { getAnalysesSearchQueryFilter } from "./analysesSearchQueryBuilder";

import { build } from "@cyverse-de/ui-lib";

import SearchIcon from "@material-ui/icons/Search";
import {
    CircularProgress,
    ListItem,
    MenuItem,
    Select,
    TextField,
    ListItemText,
    ListItemIcon,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import DescriptionIcon from "@material-ui/icons/Description";
import FolderIcon from "@material-ui/icons/Folder";
import ResourceTypes from "../models/ResourceTypes";
import constants from "../../constants";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        marginRight: 0,
        marginLeft: 0,
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(2),
            width: "60%",
        },
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1),
            width: "95%",
        },
    },
    paper: {
        boxShadow: "none",
        margin: 0,
    },
    option: {
        minHeight: "auto",
        padding: theme.spacing(0),
        margin: theme.spacing(0),
    },
    searchFilter: {
        marginRight: theme.spacing(4),
        height: theme.spacing(3.6),
        borderRadius: 0,
        width: 100,
        color: theme.palette.info.main,
        [theme.breakpoints.down("xs")]: {
            margin: theme.spacing(1),
            borderRadius: theme.spacing(1),
            width: "90%",
        },
        [theme.breakpoints.up("sm")]: {
            backgroundColor: theme.palette.info.contrastText,
        },
    },
    input: {
        position: "relative",
        height: theme.spacing(3.6),
        borderRadius: 0,
        color: theme.palette.info.main,
        [theme.breakpoints.down("xs")]: {
            border: theme.spacing(0.5),
            borderRadius: theme.spacing(1),
        },
        [theme.breakpoints.up("sm")]: {
            backgroundColor: theme.palette.info.contrastText,
        },
    },
    icon: {
        marginTop: theme.spacing(2),
        marginBotton: 0,
        marginLeft: 0,
        marginRight: 0,
    },
}));

//gobal search constants
const PAGE = 0;
const ROWS = 10;

function SearchOption(props) {
    const { primary, secondary, icon } = props;
    const classes = useStyles();
    return (
        <ListItem alignItems="flex-start" dense={true} divider={true}>
            <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
            <ListItemText
                primary={primary}
                primaryTypographyProps={{
                    variant: "body1",
                    color: "primary",
                }}
                secondary={secondary}
                secondaryTypographyProps={{
                    variant: "caption",
                    wrap: "true",
                }}
            />
        </ListItem>
    );
}

function DataSearchOption(resultItem) {
    return (
        <SearchOption
            primary={resultItem.option.name}
            secondary={resultItem.option?._source?.path}
            icon={
                resultItem.option?._type === ResourceTypes.FILE ? (
                    <DescriptionIcon />
                ) : (
                    <FolderIcon />
                )
            }
        />
    );
}

function AppsSearchOption(resultItem) {
    const { t } = useTranslation("common");
    return (
        <SearchOption
            primary={resultItem.option.name}
            secondary={resultItem.option?.description}
            icon={<img src="/icon-apps.png" alt={t("apps")} />}
        />
    );
}

function AnalysesSearchOption(resultItem) {
    const { t } = useTranslation("common");
    return (
        <SearchOption
            primary={resultItem.option.name}
            secondary={resultItem.option?.status}
            icon={<img src="/icon-analyses.png" alt={t("analyses")} />}
        />
    );
}

function GlobalSearchField(props) {
    const classes = useStyles();
    const { showErrorAnnouncer } = props;

    const { t } = useTranslation(["common"]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    const [analysesSearchKey, setAnalysesSearchKey] = useState(
        ANALYSES_SEARCH_QUERY_KEY
    );
    const [appsSearchKey, setAppsSearchKey] = useState(APPS_SEARCH_QUERY_KEY);
    const [dataSearchKey, setDataSearchKey] = useState(DATA_SEARCH_QUERY_KEY);

    const [
        analysesSearchQueryEnabled,
        setAnalysesSearchQueryEnabled,
    ] = useState(false);
    const [appsSearchQueryEnabled, setAppsSearchQueryEnabled] = useState(false);
    const [dataSearchQueryEnabled, setDataSearchQueryEnabled] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    //get bootstrap from cache.
    const bootstrapCache = queryCache.getQueryData(BOOTSTRAP_KEY);

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
                    analyses.forEach((analysis) => {
                        analysis.resultType = t("analyses");
                    });
                    setOptions([...options, ...analyses]);
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
                    apps.forEach((app) => {
                        app.resultType = t("apps");
                    });
                    setOptions([...options, ...apps]);
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
                    data.forEach((data) => {
                        data.name = data._source?.label;
                        data.resultType = t("data");
                    });
                    setOptions([...options, ...data]);
                }
            },
        },
    });

    const handleChange = (event, value, reason) => {
        //console.log("handleChange=>" + value);
        if (reason === "clear" || value === "") {
            setAnalysesSearchQueryEnabled(false);
            setAppsSearchQueryEnabled(false);
            setDataSearchQueryEnabled(false);
            setOptions([]);
        }
        setSearchTerm(value);
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
        //console.log("selected value=>" + JSON.stringify(value));
    }, [value]);

    useEffect(() => {
        if (searchTerm && searchTerm.length > 2) {
            setAnalysesSearchKey([
                ANALYSES_SEARCH_QUERY_KEY,
                {
                    rowsPerPage: ROWS,
                    orderBy: analysisFields.START_DATE.key,
                    order: constants.SORT_DESCENDING,
                    page: PAGE,
                    filter: getAnalysesSearchQueryFilter(searchTerm),
                },
            ]);
            setAnalysesSearchQueryEnabled(true);

            setAppsSearchKey([
                APPS_SEARCH_QUERY_KEY,
                {
                    rowsPerPage: ROWS,
                    orderBy: appFields.NAME.key,
                    order: constants.SORT_ASCENDING,
                    page: PAGE,
                    search: searchTerm,
                },
            ]);
            setAppsSearchQueryEnabled(true);
       
            const userHomeDir = bootstrapCache?.data_info.user_home_path + "/";
            const dataQuery = getDataSimpleSearchQuery(
                searchTerm,
                userHomeDir,
                ROWS,
                PAGE
            );
            // console.log("Final Query to submit =>" + JSON.stringify(dataQuery));
            setDataSearchKey([DATA_SEARCH_QUERY_KEY, { query: dataQuery }]);
            setDataSearchQueryEnabled(true);
        }
    }, [bootstrapCache, searchTerm]);

    if (analysesSearchError || appsSearchError || dataSearchError) {
        showErrorAnnouncer(
            t("searchError"),
            analysesSearchError || appsSearchError || dataSearchError
        );
    }

    const loading = searchingAnalyses || searchingApps || searchingData;

    const renderCustomOption = (option) => {
        switch (option?.resultType) {
            case t("data"):
                return <DataSearchOption option={option} />;
            case t("apps"):
                return <AppsSearchOption option={option} />;
            case t("analyses"):
                return <AnalysesSearchOption option={option} />;
            default:
                return <SearchOption primary={option.option.name} />;
        }
    };

    const renderCustomInput = (params) => (
        <TextField
            {...params}
            className={classes.input}
            variant={isMobile ? "outlined" : "standard"}
            InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                startAdornment: <SearchIcon color="primary" />,
                endAdornment: (
                    <React.Fragment>
                        {loading ? (
                            <CircularProgress color="primary" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                    </React.Fragment>
                ),
            }}
        />
    );

    return (
        <>
            <Autocomplete
                classes={{
                    root: classes.root,
                    paper: classes.paper,
                    option: classes.option,
                }}
                open={open}
                debug={true}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                freeSolo
                id="search"
                size="small"
                options={options}
                onInputChange={handleChange}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(option, value) =>
                    option.name === value.name
                }
                filterOptions={(options, state) => options}
                loading={loading}
                loadingText={t("searching")}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                groupBy={(option) => option.resultType}
                renderOption={(option, state) => renderCustomOption(option)}
                renderInput={(params) => renderCustomInput(params)}
            />
            <Select
                id={build(ids.SEARCH, ids.SEARCH_FILTER_MENU)}
                value={filter}
                onChange={handleFilterChange}
                disableUnderline
                className={classes.searchFilter}
                size="small"
                variant={isMobile ? "outlined" : "standard"}
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

export default withErrorAnnouncer(GlobalSearchField);
