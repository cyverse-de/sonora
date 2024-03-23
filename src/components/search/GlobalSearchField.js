/**
 *
 * @author Sriram
 * A global search field with options to filter on apps, analyses and data
 */

import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "i18n";
import { useQueryClient } from "react-query";
import Link from "next/link";

import {
    useAnalysesSearch,
    useAppsSearch,
    useDataSearch,
    useTeamsSearch,
} from "./searchQueries";
import ResourceTypes from "../models/ResourceTypes";
import searchConstants from "./constants";
import constants from "../../constants";
import withErrorAnnouncer from "components/error/withErrorAnnouncer";
import NavigationConstants from "common/NavigationConstants";
import { useDataNavigationLink } from "components/data/utils";
import { useAppLaunchLink } from "components/apps/utils";
import AnalysesIcon from "components/icons/AnalysesIcon";

import { useBootStrap, BOOTSTRAP_KEY } from "serviceFacades/users";
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

import buildID from "components/utils/DebugIDUtil";
import Highlighter from "components/highlighter/Highlighter";

import SearchIcon from "@mui/icons-material/Search";
import {
    CircularProgress,
    Link as MuiLink,
    MenuItem,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import {
    Apps as AppsIcon,
    Description as DescriptionIcon,
    Folder as FolderIcon,
    Pageview as PageviewIcon,
} from "@mui/icons-material";
import { TeamIcon } from "../teams/Icons";
import { useUserProfile } from "../../contexts/userProfile";
import { getTeamLinkRefs } from "../teams/util";
import { trackIntercomEvent } from "common/intercom";
import { useConfig } from "contexts/config";

const useStyles = makeStyles()((theme) => ({
    root: {
        position: "relative",
        marginRight: 0,
        marginLeft: 0,
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(2),
            width: "60%",
        },
        [theme.breakpoints.down("sm")]: {
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
        [theme.breakpoints.down("sm")]: {
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
        [theme.breakpoints.down("sm")]: {
            border: theme.spacing(0.5),
            borderRadius: theme.spacing(1),
        },
        [theme.breakpoints.up("sm")]: {
            backgroundColor: theme.palette.info.contrastText,
        },
    },
    optionIcon: {
        marginRight: theme.spacing(0.5),
        color: theme.palette.info.main,
        fontSize: "1.5rem",
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

const SearchOption = (props) => {
    const {
        id,
        primary,
        secondary,
        icon,
        searchTerm,
        onOptionSelected,
        href,
        as,
    } = props;
    const { classes } = useStyles();
    const theme = useTheme();

    const OptionLink = React.forwardRef(({ onClick, href }, ref) => (
        <>
            <span className={classes.optionIcon}>{icon}</span>
            <MuiLink
                href={href}
                onClick={(event) => {
                    if (onOptionSelected) {
                        event.preventDefault();
                        onOptionSelected();
                        return false;
                    } else {
                        onClick(event);
                    }
                }}
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
                        color={theme.palette.info.primary}
                    >
                        <Highlighter search={searchTerm}>
                            {secondary}
                        </Highlighter>
                    </Typography>
                </div>
            </MuiLink>
        </>
    ));

    return onOptionSelected ? (
        <OptionLink />
    ) : (
        <Link href={href} as={as} passHref legacyBehavior>
            <OptionLink />
        </Link>
    );
};

function ViewAllOption(props) {
    const {
        id,
        searchTerm,
        filter,
        prompt,
        selectedTab,
        onShowDetailedSearch,
    } = props;
    return (
        <SearchOption
            primary={searchTerm}
            searchTerm={searchTerm}
            secondary={prompt}
            icon={<PageviewIcon color="primary" />}
            id={id}
            onOptionSelected={() =>
                onShowDetailedSearch({
                    searchTerm,
                    filter,
                    selectedTab,
                })
            }
        />
    );
}

function DataSearchOption(props) {
    const { baseId, selectedOption, searchTerm } = props;
    const type = selectedOption?._type || selectedOption?._source?.doc_type;
    const path = selectedOption._source?.path;
    const resourceId = selectedOption._source?.id;
    const name = selectedOption.name;
    const [href, as] = useDataNavigationLink(path, resourceId, type);

    let icon = <FolderIcon />;
    if (type === ResourceTypes.FILE) {
        icon = <DescriptionIcon />;
    }

    return (
        <SearchOption
            href={href}
            as={as}
            primary={name}
            secondary={path}
            icon={icon}
            searchTerm={searchTerm}
            id={buildID(baseId, resourceId)}
        />
    );
}

function AppsSearchOption(props) {
    const { baseId, selectedOption, onOptionSelected, searchTerm } = props;
    const [href, as] = useAppLaunchLink(
        selectedOption?.system_id,
        selectedOption?.id
    );

    return (
        <SearchOption
            href={href}
            as={as}
            primary={selectedOption.name}
            secondary={selectedOption.description}
            icon={<AppsIcon />}
            searchTerm={searchTerm}
            id={buildID(baseId, selectedOption.id)}
            onOptionSelected={onOptionSelected}
        />
    );
}

function AnalysesSearchOption(props) {
    const { baseId, selectedOption, searchTerm } = props;

    const href = `/${NavigationConstants.ANALYSES}/[analysisId]`;
    const as = `/${NavigationConstants.ANALYSES}/${selectedOption?.id}`;
    return (
        <SearchOption
            href={href}
            as={as}
            primary={selectedOption.name}
            secondary={selectedOption.status}
            icon={<AnalysesIcon />}
            searchTerm={searchTerm}
            id={buildID(baseId, selectedOption.id)}
        />
    );
}

function TeamSearchOption(props) {
    const theme = useTheme();
    const { baseId, selectedOption, searchTerm } = props;

    const [href, as] = getTeamLinkRefs(selectedOption.name);
    return (
        <SearchOption
            href={href}
            as={as}
            primary={selectedOption.display_extension}
            secondary={selectedOption.description}
            icon={<TeamIcon style={{ color: theme.palette.info.main }} />}
            searchTerm={searchTerm}
            id={buildID(baseId, selectedOption.id)}
        />
    );
}

function GlobalSearchField(props) {
    const { classes } = useStyles();
    const [userProfile] = useUserProfile();
    const {
        search,
        selectedFilter,
        showErrorAnnouncer,
        singleSearchOption = false,
        onShowDetailedSearch,
        onOptionSelected,
        outlined,
        hideDropDown = false,
        placeholder,
    } = props;

    const { t } = useTranslation("common");
    const [config] = useConfig();
    const { t: appsI18n } = useTranslation("apps");
    const { t: analysesI18n } = useTranslation("analyses");
    const { t: i18NSearch } = useTranslation("search");
    const appRecordFields = appFields(appsI18n);
    const defaultTab = config?.elasticEnabled
        ? SEARCH_RESULTS_TABS.data
        : SEARCH_RESULTS_TABS.apps;

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

    const [analysesSearchQueryEnabled, setAnalysesSearchQueryEnabled] =
        useState(false);
    const [appsSearchQueryEnabled, setAppsSearchQueryEnabled] = useState(false);
    const [dataSearchQueryEnabled, setDataSearchQueryEnabled] = useState(false);
    const [teamSearchQueryEnabled, setTeamSearchQueryEnabled] = useState(false);

    const [bootstrapQueryEnabled, setBootstrapQueryEnabled] = useState(false);
    const [userHomeDir, setUserHomeDir] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    //get bootstrap from cache.
    const bootstrapCache = queryClient.getQueryData(BOOTSTRAP_KEY);

    const preProcessData = useCallback(
        (respData) => {
            let homeDir = bootstrapCache?.data_info.user_home_path;
            if (homeDir) {
                homeDir = homeDir + "/";
                setUserHomeDir(homeDir);
            }
        },
        [bootstrapCache]
    );

    const { isFetching: isBootStrapFetching } = useBootStrap(
        bootstrapQueryEnabled,
        preProcessData,
        null
    );

    useEffect(() => {
        if (bootstrapCache && !userHomeDir) {
            preProcessData(bootstrapCache);
        } else {
            if (userProfile?.id) {
                setBootstrapQueryEnabled(true);
            }
        }
    }, [bootstrapCache, preProcessData, userHomeDir, userProfile]);

    const viewAllAnalysesOptions = {
        id: searchConstants.VIEW_ALL_ANALYSES_ID,
        name: searchTerm,
        resultType: {
            type: t("analyses"),
            id: searchConstants.ANALYSES,
        },
    };

    // Return 'view all data' option if data search is enabled; otherwise, return false. False values are filtered out from the options array.
    const viewAllDataOptions = () => {
        return config?.elasticEnabled
            ? {
                  id: searchConstants.VIEW_ALL_DATA_ID,
                  name: searchTerm,
                  resultType: { type: t("data"), id: searchConstants.DATA },
              }
            : false;
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

    const { isFetching: searchingAnalyses, error: analysesSearchError } =
        useAnalysesSearch(
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

                    if (
                        filter === searchConstants.ANALYSES &&
                        !singleSearchOption
                    ) {
                        setOptions(
                            [
                                ...options,
                                ...analyses,
                                viewAllAnalysesOptions,
                                viewAllAppOptions,
                                viewAllDataOptions(),
                                viewAllTeamOptions,
                            ].filter(Boolean)
                        );
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
                if (filter === searchConstants.APPS && !singleSearchOption) {
                    setOptions(
                        [
                            ...options,
                            ...apps,
                            viewAllAppOptions,
                            viewAllAnalysesOptions,
                            viewAllDataOptions(),
                            viewAllTeamOptions,
                        ].filter(Boolean)
                    );
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
                if (filter === searchConstants.DATA && !singleSearchOption) {
                    setOptions(
                        [
                            ...options,
                            ...data,
                            viewAllDataOptions(),
                            viewAllAnalysesOptions,
                            viewAllAppOptions,
                            viewAllTeamOptions,
                        ].filter(Boolean)
                    );
                } else {
                    setOptions(
                        [...options, ...data, viewAllDataOptions()].filter(
                            Boolean
                        )
                    );
                }
            } else {
                setOptions([...options, viewAllDataOptions()].filter(Boolean));
            }
        }
    );

    const { isFetching: searchingTeams, error: teamSearchError } =
        useTeamsSearch(teamSearchKey, teamSearchQueryEnabled, (results) => {
            if (results && results.groups?.length > 0) {
                const teams = results.groups;
                teams.forEach((team) => {
                    team.resultType = {
                        type: t("teams"),
                        id: searchConstants.TEAMS,
                    };
                });
                if (filter === searchConstants.TEAMS && !singleSearchOption) {
                    setOptions(
                        [
                            ...options,
                            ...teams,
                            viewAllTeamOptions,
                            viewAllDataOptions(),
                            viewAllAppOptions,
                            viewAllAnalysesOptions,
                        ].filter(Boolean)
                    );
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
        setSearchTerm(value?.trim());
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
            config?.irods?.community_path,
            false,
            userProfile,
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
                filter: getAnalysesSearchQueryFilter(searchTerm, analysesI18n),
            },
        ]);

        setTeamSearchKey([SEARCH_TEAMS_QUERY, { searchTerm }]);
        const isLoggedIn = !!userProfile?.id;
        switch (filter) {
            case searchConstants.DATA:
                setDataSearchQueryEnabled(config?.elasticEnabled);
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
                setAnalysesSearchQueryEnabled(isLoggedIn);
                setTeamSearchQueryEnabled(false);
                break;

            case searchConstants.TEAMS:
                setDataSearchQueryEnabled(false);
                setAppsSearchQueryEnabled(false);
                setAnalysesSearchQueryEnabled(false);
                setTeamSearchQueryEnabled(isLoggedIn);
                break;

            default:
                setDataSearchQueryEnabled(config?.elasticEnabled);
                setAppsSearchQueryEnabled(true);
                setAnalysesSearchQueryEnabled(isLoggedIn);
                setTeamSearchQueryEnabled(isLoggedIn);
        }
    }, [
        analysesI18n,
        appRecordFields.NAME.key,
        config,
        filter,
        searchTerm,
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

    useEffect(() => {
        if (searchTerm && searchTerm.length > 2) {
            trackIntercomEvent(t("searching"), {
                filter,
                search: searchTerm,
                total: options?.length || 0,
            });
        }
    }, [filter, options, searchTerm, t]);

    const loading =
        isBootStrapFetching ||
        searchingAnalyses ||
        searchingApps ||
        searchingData ||
        searchingTeams;

    const renderCustomOption = (option) => {
        const id = option?.id;
        const resultType = option?.resultType?.id;

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
                    onShowDetailedSearch={onShowDetailedSearch}
                    id={buildID(
                        ids.SEARCH,
                        ids[`${resultType?.toUpperCase()}_SEARCH_OPTION`],
                        ids.VIEW_ALL
                    )}
                />
            );
        }
        switch (resultType) {
            case searchConstants.DATA:
                return (
                    <DataSearchOption
                        selectedOption={option}
                        searchTerm={searchTerm}
                        baseId={buildID(ids.SEARCH, ids.DATA_SEARCH_OPTION)}
                    />
                );
            case searchConstants.APPS:
                return (
                    <AppsSearchOption
                        selectedOption={option}
                        searchTerm={searchTerm}
                        onOptionSelected={
                            onOptionSelected
                                ? () => onOptionSelected(option)
                                : false
                        }
                        baseId={buildID(ids.SEARCH, ids.APPS_SEARCH_OPTION)}
                    />
                );
            case searchConstants.ANALYSES:
                return (
                    <AnalysesSearchOption
                        selectedOption={option}
                        searchTerm={searchTerm}
                        baseId={buildID(ids.SEARCH, ids.ANALYSES_SEARCH_OPTION)}
                    />
                );
            case searchConstants.TEAMS:
                return (
                    <TeamSearchOption
                        selectedOption={option}
                        searchTerm={searchTerm}
                        baseId={buildID(ids.SEARCH, ids.TEAMS_SEARCH_OPTION)}
                    />
                );
            default:
                return null;
        }
    };

    const renderCustomInput = (params) => {
        const variant = isMobile || outlined ? "outlined" : "standard";
        const inputProps = {
            ...params.InputProps,
            startAdornment: <SearchIcon color="primary" />,
            endAdornment: (
                <React.Fragment>
                    {loading ? (
                        <CircularProgress color="primary" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                </React.Fragment>
            ),
        };
        if (variant === "standard") {
            inputProps.disableUnderline = true;
        }
        return (
            <TextField
                id={buildID(ids.SEARCH, ids.SEARCH_INPUT_FILED)}
                {...params}
                className={classes.input}
                placeholder={placeholder}
                variant={variant}
                InputProps={inputProps}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        setOpen(false);
                        onShowDetailedSearch({
                            searchTerm,
                            filter,
                            selectedTab:
                                filter && filter !== searchConstants.ALL
                                    ? filter.toUpperCase()
                                    : defaultTab,
                        });
                    }
                }}
            />
        );
    };

    const searchFilterId = buildID(ids.SEARCH, ids.SEARCH_FILTER_MENU);
    const allFilterOptions = [
        searchConstants.ALL,
        searchConstants.DATA,
        searchConstants.APPS,
        searchConstants.ANALYSES,
    ];
    const filterOptions = singleSearchOption
        ? [selectedFilter]
        : config?.elasticEnabled
        ? allFilterOptions
        : allFilterOptions.filter((option) => option !== searchConstants.DATA);

    const variant = isMobile ? "outlined" : "standard";
    const inputProps = {};
    if (!isMobile) {
        inputProps.disableUnderline = true;
    }

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
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                id={buildID(ids.SEARCH, ids.GLOBAL_SEARCH_FIELD)}
                size="small"
                options={options}
                onInputChange={handleChange}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) =>
                    option.name === value.name
                }
                filterOptions={(options, state) => options}
                loading={loading}
                loadingText={t("searching")}
                groupBy={(option) => option.resultType.type}
                renderOption={(props, option) => (
                    <li {...props}>{renderCustomOption(option)}</li>
                )}
                renderInput={(params) => renderCustomInput(params)}
                popupIcon={null}
                noOptionsText={t("noOptions")}
                clearOnEscape={true}
                clearOnBlur={false}
            />
            {!hideDropDown && (
                <TextField
                    id={searchFilterId}
                    select
                    size="small"
                    value={filter}
                    onChange={handleFilterChange}
                    className={classes.searchFilter}
                    variant={variant}
                    InputProps={inputProps}
                >
                    {filterOptions.map((option) => (
                        <MenuItem
                            id={buildID(
                                searchFilterId,
                                ids.SEARCH_FILTER_MI[option.toUpperCase()]
                            )}
                            value={option}
                            key={option}
                        >
                            {t(option.toLowerCase())}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        </>
    );
}

export default withErrorAnnouncer(GlobalSearchField);
