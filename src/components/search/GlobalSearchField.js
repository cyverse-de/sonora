/**
 *
 * @author Sriram
 * A global search field with options to filter on apps, analyses and data
 */

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { queryCache } from "react-query";
import Link from "next/link";
import { useRouter } from "next/router";

import {
    useDataSearch,
    useAppsSearch,
    useAnalysesSearch,
    useTeamsSearch,
} from "./searchQueries";
import ResourceTypes from "../models/ResourceTypes";
import searchConstants from "./constants";
import constants from "../../constants";
import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";
import NavigationConstants from "common/NavigationConstants";
import { useDataNavigationLink } from "components/data/utils";
import { useAppLaunchLink } from "components/apps/utils";

import { BOOTSTRAP_KEY } from "serviceFacades/users";
import { ANALYSES_SEARCH_QUERY_KEY } from "serviceFacades/analyses";
import { APPS_SEARCH_QUERY_KEY } from "serviceFacades/apps";
import { DATA_SEARCH_QUERY_KEY } from "serviceFacades/filesystem";
import { SEARCH_TEAMS_QUERY } from "serviceFacades/groups";

import appFields from "components/apps/appFields";
import analysisFields from "components/analyses/analysisFields";

import ids from "./ids";
import SEARCH_RESULTS_TABS from "components/search/detailed/tabs";
import { getDataSimpleSearchQuery } from "./dataSearchQueryBuilder";
import { getAnalysesSearchQueryFilter } from "./analysesSearchQueryBuilder";

import { build, Highlighter } from "@cyverse-de/ui-lib";

import SearchIcon from "@material-ui/icons/Search";
import {
    CircularProgress,
    MenuItem,
    TextField,
    useMediaQuery,
    useTheme,
    Typography,
    Link as MuiLink,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import {
    Description as DescriptionIcon,
    Pageview as PageviewIcon,
    Folder as FolderIcon,
    Apps as AppsIcon,
    Group as TeamsIcon,
} from "@material-ui/icons";
import { useUserProfile } from "../../contexts/userProfile";

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
    optionIcon: {
        marginRight: theme.spacing(0.5),
    },
    optionDiv: {
        flexGrow: 1,
        margin: theme.spacing(1),
    },
}));

const getViewAllPrompt = (id, searchTerm, i18NSearch) => {
    let prompt = i18NSearch("viewAllDataResults", { searchTerm });
    let selectedTab = SEARCH_RESULTS_TABS.data;

    if (id === searchConstants.VIEW_ALL_ANALYSES_ID) {
        prompt = i18NSearch("viewAllAnalysesResults", { searchTerm });
        selectedTab = SEARCH_RESULTS_TABS.analyses;
    } else if (id === searchConstants.VIEW_ALL_APPS_ID) {
        prompt = i18NSearch("viewAllAppsResults", { searchTerm });
        selectedTab = SEARCH_RESULTS_TABS.apps;
    } else if (id === searchConstants.VIEW_ALL_TEAMS_ID) {
        prompt = i18NSearch("viewAllTeamResults", { searchTerm });
        selectedTab = SEARCH_RESULTS_TABS.teams;
    }

    return [prompt, selectedTab];
};

const SearchOption = React.forwardRef((props, ref) => {
    const { id, primary, secondary, icon, searchTerm, onClick, href } = props;
    const classes = useStyles();
    const theme = useTheme();
    return (
        <>
            <span className={classes.optionIcon}>{icon}</span>
            <MuiLink
                href={href}
                onClick={onClick}
                ref={ref}
                id={id}
                underline="none"
                color="inherit"
            >
                <div className={classes.optionDiv}>
                    <Typography
                        variant={"subtitle2"}
                        color={theme.palette.info.primary}
                    >
                        <Highlighter search={searchTerm}>{primary}</Highlighter>
                    </Typography>
                    <Typography
                        variant={"caption"}
                        wrap={true}
                        color={theme.palette.info.primary}
                    >
                        <Highlighter search={searchTerm}>
                            {secondary}
                        </Highlighter>
                    </Typography>
                </div>
            </MuiLink>
        </>
    );
});

function ViewAllOption(props) {
    const { id, searchTerm, filter, prompt, selectedTab } = props;
    const href = `/${NavigationConstants.SEARCH}?searchTerm=${searchTerm}&filter=${filter}&selectedTab=${selectedTab}`;
    const as = `/${NavigationConstants.SEARCH}?searchTerm=${searchTerm}&filter=${filter}&selectedTab=${selectedTab}`;
    return (
        <Link href={href} as={as} passHref>
            <SearchOption
                primary={searchTerm}
                searchTerm={searchTerm}
                secondary={prompt}
                icon={<PageviewIcon color="primary" />}
                id={id}
            />
        </Link>
    );
}

function DataSearchOption(props) {
    const { baseId, filter, selectedOption, searchTerm } = props;
    const { t: i18NSearch } = useTranslation("search");
    const theme = useTheme();
    const type = selectedOption._type;
    const path = selectedOption._source?.path;
    const resourceId = selectedOption._source?.id;
    const name = selectedOption.name;
    const [href, as] = useDataNavigationLink(path, resourceId, type);

    const id = selectedOption?.id;

    if (
        id === searchConstants.VIEW_ALL_ANALYSES_ID ||
        id === searchConstants.VIEW_ALL_APPS_ID ||
        id === searchConstants.VIEW_ALL_DATA_ID ||
        id === searchConstants.VIEW_ALL_TEAMS_ID
    ) {
        const [prompt, selectedTab] = getViewAllPrompt(
            id,
            searchTerm,
            i18NSearch
        );
        return (
            <ViewAllOption
                searchTerm={searchTerm}
                filter={filter}
                prompt={prompt}
                selectedTab={selectedTab}
                id={build(baseId, ids.VIEW_ALL)}
            />
        );
    }

    let icon = <FolderIcon style={{ color: theme.palette.info.main }} />;
    if (type === ResourceTypes.FILE) {
        icon = <DescriptionIcon style={{ color: theme.palette.info.main }} />;
    }

    return (
        <Link href={href} as={as} passHref>
            <SearchOption
                primary={name}
                secondary={path}
                icon={icon}
                searchTerm={searchTerm}
                id={build(baseId, resourceId)}
            />
        </Link>
    );
}

function AppsSearchOption(props) {
    const { t: i18NSearch } = useTranslation("search");
    const { baseId, filter, selectedOption, searchTerm } = props;
    const theme = useTheme();
    const [href, as] = useAppLaunchLink(
        selectedOption?.system_id,
        selectedOption?.id
    );

    const id = selectedOption?.id;

    if (
        id === searchConstants.VIEW_ALL_ANALYSES_ID ||
        id === searchConstants.VIEW_ALL_APPS_ID ||
        id === searchConstants.VIEW_ALL_DATA_ID ||
        id === searchConstants.VIEW_ALL_TEAMS_ID
    ) {
        const [prompt, selectedTab] = getViewAllPrompt(
            id,
            searchTerm,
            i18NSearch
        );
        return (
            <ViewAllOption
                searchTerm={searchTerm}
                filter={filter}
                prompt={prompt}
                selectedTab={selectedTab}
                id={build(baseId, ids.VIEW_ALL)}
            />
        );
    }

    return (
        <Link href={href} as={as} passHref>
            <SearchOption
                primary={selectedOption.name}
                secondary={selectedOption.description}
                icon={<AppsIcon style={{ color: theme.palette.info.main }} />}
                searchTerm={searchTerm}
                id={build(baseId, selectedOption.id)}
            />
        </Link>
    );
}

function AnalysesSearchOption(props) {
    const { t } = useTranslation("common");
    const { t: i18NSearch } = useTranslation("search");
    const { baseId, filter, selectedOption, searchTerm } = props;

    const id = selectedOption?.id;

    if (
        id === searchConstants.VIEW_ALL_ANALYSES_ID ||
        id === searchConstants.VIEW_ALL_APPS_ID ||
        id === searchConstants.VIEW_ALL_DATA_ID ||
        id === searchConstants.VIEW_ALL_TEAMS_ID
    ) {
        const [prompt, selectedTab] = getViewAllPrompt(
            id,
            searchTerm,
            i18NSearch
        );
        return (
            <ViewAllOption
                searchTerm={searchTerm}
                filter={filter}
                prompt={prompt}
                selectedTab={selectedTab}
                id={build(baseId, ids.VIEW_ALL)}
            />
        );
    }

    const href = `/${NavigationConstants.ANALYSES}/[analysisId]`;
    const as = `/${NavigationConstants.ANALYSES}/${selectedOption?.id}`;
    return (
        <Link href={href} as={as} passHref>
            <SearchOption
                primary={selectedOption.name}
                secondary={selectedOption.status}
                icon={<img src="/analyses-grey-24.png" alt={t("analyses")} />}
                searchTerm={searchTerm}
                id={build(baseId, selectedOption.id)}
            />
        </Link>
    );
}

function TeamSearchOption(props) {
    const theme = useTheme();
    const { t: i18NSearch } = useTranslation("search");
    const { baseId, filter, selectedOption, searchTerm } = props;

    const id = selectedOption?.id;

    if (
        id === searchConstants.VIEW_ALL_ANALYSES_ID ||
        id === searchConstants.VIEW_ALL_APPS_ID ||
        id === searchConstants.VIEW_ALL_DATA_ID ||
        id === searchConstants.VIEW_ALL_TEAMS_ID
    ) {
        const [prompt, selectedTab] = getViewAllPrompt(
            id,
            searchTerm,
            i18NSearch
        );
        return (
            <ViewAllOption
                searchTerm={searchTerm}
                filter={filter}
                prompt={prompt}
                selectedTab={selectedTab}
                id={build(baseId, ids.VIEW_ALL)}
            />
        );
    }

    const href = `/${NavigationConstants.TEAMS}`;
    const as = `/${NavigationConstants.TEAMS}`;
    return (
        <Link href={href} as={as} passHref>
            <SearchOption
                primary={selectedOption.display_extension}
                secondary={selectedOption.description}
                icon={<TeamsIcon color={theme.palette.info.primary} />}
                searchTerm={searchTerm}
                id={build(baseId, selectedOption.id)}
            />
        </Link>
    );
}

function GlobalSearchField(props) {
    const classes = useStyles();
    const router = useRouter();
    const [userProfile] = useUserProfile();
    const { search, selectedFilter, showErrorAnnouncer } = props;

    const { t } = useTranslation("common");
    const { t: appsI18n } = useTranslation("apps");
    const { t: analysesI18n } = useTranslation("analyses");
    const appRecordFields = appFields(appsI18n);

    const [searchTerm, setSearchTerm] = useState(search);
    const [filter, setFilter] = useState(selectedFilter || searchConstants.ALL);

    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);

    const [analysesSearchKey, setAnalysesSearchKey] = useState(
        ANALYSES_SEARCH_QUERY_KEY
    );
    const [appsSearchKey, setAppsSearchKey] = useState(APPS_SEARCH_QUERY_KEY);
    const [dataSearchKey, setDataSearchKey] = useState(DATA_SEARCH_QUERY_KEY);
    const [teamSearchKey, setTeamSearchKey] = useState([SEARCH_TEAMS_QUERY]);

    const [
        analysesSearchQueryEnabled,
        setAnalysesSearchQueryEnabled,
    ] = useState(false);
    const [appsSearchQueryEnabled, setAppsSearchQueryEnabled] = useState(false);
    const [dataSearchQueryEnabled, setDataSearchQueryEnabled] = useState(false);
    const [teamSearchQueryEnabled, setTeamSearchQueryEnabled] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    //get bootstrap from cache.
    const bootstrapCache = queryCache.getQueryData(BOOTSTRAP_KEY);
    let userHomeDir = bootstrapCache?.data_info.user_home_path;
    if (userHomeDir) {
        userHomeDir = userHomeDir + "/";
    }

    const viewAllAnalysesOptions = {
        id: searchConstants.VIEW_ALL_ANALYSES_ID,
        name: searchTerm,
        resultType: {
            type: t("analyses"),
            id: searchConstants.ANALYSES,
        },
    };

    const viewAllDataOptions = {
        id: searchConstants.VIEW_ALL_DATA_ID,
        name: searchTerm,
        resultType: { type: t("data"), id: searchConstants.DATA },
    };

    const viewAllAppOptions = {
        id: searchConstants.VIEW_ALL_APPS_ID,
        name: searchTerm,
        resultType: { type: t("apps"), id: searchConstants.APPS },
    };

    const viewAllTeamOptions = {
        id: searchConstants.VIEW_ALL_TEAMS_ID,
        name: searchTerm,
        resultType: { type: t("teams"), id: searchConstants.TEAMS },
    };

    useEffect(() => {
        setFilter(selectedFilter);
    }, [selectedFilter]);

    const {
        isFetching: searchingAnalyses,
        error: analysesSearchError,
    } = useAnalysesSearch(
        analysesSearchKey,
        analysesSearchQueryEnabled,
        (results) => {
            if (results && results.analyses?.length > 0) {
                const analyses = results.analyses;
                analyses.forEach((analysis) => {
                    analysis.resultType = {
                        type: t("analyses"),
                        id: searchConstants.ANALYSES,
                    };
                });

                if (filter === searchConstants.ANALYSES) {
                    setOptions([
                        ...options,
                        ...analyses,
                        viewAllAnalysesOptions,
                        viewAllAppOptions,
                        viewAllDataOptions,
                        viewAllTeamOptions,
                    ]);
                } else {
                    setOptions([
                        ...options,
                        ...analyses,
                        viewAllAnalysesOptions,
                    ]);
                }
            }
        }
    );

    const { isFetching: searchingApps, error: appsSearchError } = useAppsSearch(
        appsSearchKey,
        appsSearchQueryEnabled,
        (results) => {
            if (results && results.apps?.length > 0) {
                const apps = results.apps;
                apps.forEach((app) => {
                    app.resultType = {
                        type: t("apps"),
                        id: searchConstants.APPS,
                    };
                });
                if (filter === searchConstants.APPS) {
                    setOptions([
                        ...options,
                        ...apps,
                        viewAllAppOptions,
                        viewAllAnalysesOptions,
                        viewAllDataOptions,
                        viewAllTeamOptions,
                    ]);
                } else {
                    setOptions([...options, ...apps, viewAllAppOptions]);
                }
            }
        }
    );

    const { isFetching: searchingData, error: dataSearchError } = useDataSearch(
        dataSearchKey,
        dataSearchQueryEnabled,
        (results) => {
            if (results && results.hits?.length > 0) {
                const data = results.hits;
                data.forEach((data) => {
                    data.name = data._source?.label;
                    data.resultType = {
                        type: t("data"),
                        id: searchConstants.DATA,
                    };
                });
                if (filter === searchConstants.DATA) {
                    setOptions([
                        ...options,
                        ...data,
                        viewAllDataOptions,
                        viewAllAnalysesOptions,
                        viewAllAppOptions,
                        viewAllTeamOptions,
                    ]);
                } else {
                    setOptions([...options, ...data, viewAllDataOptions]);
                }
            }
        }
    );

    const {
        isFetching: searchingTeams,
        error: teamSearchError,
    } = useTeamsSearch(teamSearchKey, teamSearchQueryEnabled, (results) => {
        if (results && results.groups?.length > 0) {
            const teams = results.groups;
            teams.forEach((team) => {
                team.resultType = {
                    type: t("teams"),
                    id: searchConstants.TEAMS,
                };
            });
            if (filter === searchConstants.TEAMS) {
                setOptions([
                    ...options,
                    ...teams,
                    viewAllTeamOptions,
                    viewAllDataOptions,
                    viewAllAppOptions,
                    viewAllAnalysesOptions,
                ]);
            } else {
                setOptions([...options, ...teams, viewAllTeamOptions]);
            }
        }
    });

    const handleChange = (event, value, reason) => {
        if (reason === "clear" || value === "") {
            setAnalysesSearchQueryEnabled(false);
            setAppsSearchQueryEnabled(false);
            setDataSearchQueryEnabled(false);
            setTeamSearchQueryEnabled(false);
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

    const doSearch = useCallback(() => {
        setOptions([]);
        const dataQuery = getDataSimpleSearchQuery(
            searchTerm,
            userHomeDir,
            searchConstants.GLOBAL_SEARCH_PAGE_SIZE,
            searchConstants.GLOBAL_SEARCH_PAGE,
            "label",
            "ascending"
        );
        setDataSearchKey([DATA_SEARCH_QUERY_KEY, { query: dataQuery }]);

        setAppsSearchKey([
            APPS_SEARCH_QUERY_KEY,
            {
                rowsPerPage: searchConstants.GLOBAL_SEARCH_PAGE_SIZE,
                orderBy: appRecordFields.NAME.key,
                order: constants.SORT_ASCENDING,
                page: searchConstants.GLOBAL_SEARCH_PAGE,
                search: searchTerm,
            },
        ]);

        const analysisRecordFields = analysisFields(analysesI18n);
        setAnalysesSearchKey([
            ANALYSES_SEARCH_QUERY_KEY,
            {
                rowsPerPage: searchConstants.GLOBAL_SEARCH_PAGE_SIZE,
                orderBy: analysisRecordFields.START_DATE.key,
                order: constants.SORT_DESCENDING,
                page: searchConstants.GLOBAL_SEARCH_PAGE,
                filter: getAnalysesSearchQueryFilter(searchTerm, t),
            },
        ]);

        setTeamSearchKey([SEARCH_TEAMS_QUERY, { searchTerm }]);

        switch (filter) {
            case searchConstants.DATA:
                setDataSearchQueryEnabled(true);
                setAppsSearchQueryEnabled(false);
                setAnalysesSearchQueryEnabled(false);
                setTeamSearchQueryEnabled(false);
                break;

            case searchConstants.APPS:
                setDataSearchQueryEnabled(false);
                setAppsSearchQueryEnabled(true);
                setAnalysesSearchQueryEnabled(false);
                setTeamSearchQueryEnabled(false);
                break;

            case searchConstants.ANALYSES:
                setDataSearchQueryEnabled(false);
                setAppsSearchQueryEnabled(false);
                setAnalysesSearchQueryEnabled(userProfile?.id);
                setTeamSearchQueryEnabled(false);
                break;

            case searchConstants.TEAMS:
                setDataSearchQueryEnabled(false);
                setAppsSearchQueryEnabled(false);
                setAnalysesSearchQueryEnabled(false);
                setTeamSearchQueryEnabled(userProfile?.id);
                break;

            default:
                setDataSearchQueryEnabled(true);
                setAppsSearchQueryEnabled(true);
                setAnalysesSearchQueryEnabled(userProfile?.id);
                setTeamSearchQueryEnabled(userProfile?.id);
        }
    }, [
        analysesI18n,
        appRecordFields.NAME.key,
        filter,
        searchTerm,
        t,
        userHomeDir,
        userProfile,
    ]);

    useEffect(() => {
        let timeOutId = null;
        if (searchTerm && searchTerm.length > 2) {
            timeOutId = setTimeout(() => doSearch(), 500);
        }
        return () => clearTimeout(timeOutId);
    }, [searchTerm, doSearch]);

    useEffect(() => {
        if (
            analysesSearchError ||
            appsSearchError ||
            dataSearchError ||
            teamSearchError
        ) {
            showErrorAnnouncer(
                t("searchError"),
                analysesSearchError ||
                    appsSearchError ||
                    dataSearchError ||
                    teamSearchError
            );
        }
    }, [
        analysesSearchError,
        appsSearchError,
        dataSearchError,
        teamSearchError,
        showErrorAnnouncer,
        t,
    ]);

    const loading =
        searchingAnalyses || searchingApps || searchingData || searchingTeams;

    const renderCustomOption = (option) => {
        switch (option?.resultType?.id) {
            case searchConstants.DATA:
                return (
                    <DataSearchOption
                        selectedOption={option}
                        searchTerm={searchTerm}
                        filter={filter}
                        baseId={build(ids.SEARCH, ids.DATA_SEARCH_OPTION)}
                    />
                );
            case searchConstants.APPS:
                return (
                    <AppsSearchOption
                        selectedOption={option}
                        searchTerm={searchTerm}
                        filter={filter}
                        baseId={build(ids.SEARCH, ids.APPS_SEARCH_OPTION)}
                    />
                );
            case searchConstants.ANALYSES:
                return (
                    <AnalysesSearchOption
                        selectedOption={option}
                        searchTerm={searchTerm}
                        filter={filter}
                        baseId={build(ids.SEARCH, ids.ANALYSES_SEARCH_OPTION)}
                    />
                );
            case searchConstants.TEAMS:
                return (
                    <TeamSearchOption
                        selectedOption={option}
                        searchTerm={searchTerm}
                        filter={filter}
                        baseId={build(ids.SEARCH, ids.TEAM_SEARCH_OPTION)}
                    />
                );
            default:
                return null;
        }
    };

    const renderCustomInput = (params) => (
        <TextField
            id={build(ids.SEARCH, ids.SEARCH_INPUT_FILED)}
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
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setOpen(false);
                    router.push({
                        pathname: `/${NavigationConstants.SEARCH}`,
                        query: {
                            searchTerm,
                            filter,
                            selectedTab:
                                filter && filter !== searchConstants.ALL
                                    ? filter.toUpperCase()
                                    : SEARCH_RESULTS_TABS.data,
                        },
                    });
                }
            }}
        />
    );

    const searchFilterId = build(ids.SEARCH, ids.SEARCH_FILTER_MENU);

    return (
        <>
            <Autocomplete
                classes={{
                    root: classes.root,
                    paper: classes.paper,
                    option: classes.option,
                }}
                className={"search-intro"}
                open={open}
                debug={false}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                id={build(ids.SEARCH, ids.GLOBAL_SEARCH_FIELD)}
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
                groupBy={(option) => option.resultType.type}
                renderOption={(option, state) => renderCustomOption(option)}
                renderInput={(params) => renderCustomInput(params)}
                popupIcon={null}
                noOptionsText={t("noOptions")}
                clearOnEscape={true}
                clearOnBlur={false}
            />
            <TextField
                id={searchFilterId}
                select
                size="small"
                value={filter}
                onChange={handleFilterChange}
                className={classes.searchFilter}
                variant={isMobile ? "outlined" : "standard"}
                InputProps={{
                    disableUnderline: true,
                }}
            >
                <MenuItem
                    id={build(searchFilterId, ids.SEARCH_FILTER_MI.ALL)}
                    value={searchConstants.ALL}
                >
                    {t("all")}
                </MenuItem>
                <MenuItem
                    id={build(searchFilterId, ids.SEARCH_FILTER_MI.DATA)}
                    value={searchConstants.DATA}
                >
                    {t("data")}
                </MenuItem>
                <MenuItem
                    id={build(searchFilterId, ids.SEARCH_FILTER_MI.APPS)}
                    value={searchConstants.APPS}
                >
                    {t("apps")}
                </MenuItem>
                <MenuItem
                    id={build(searchFilterId, ids.SEARCH_FILTER_MI.ANALYSES)}
                    value={searchConstants.ANALYSES}
                >
                    {t("analyses")}
                </MenuItem>
            </TextField>
        </>
    );
}

export default withErrorAnnouncer(GlobalSearchField);
