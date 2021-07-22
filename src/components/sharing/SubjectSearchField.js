/**
 * @author aramsey
 *
 * An autocomplete component that allows users to search for users and groups
 * (a.k.a subjects).
 * This field also handles managing the user's recent contact list. The recent
 * contact list has replaced the Collaborators window feature by managing
 * the user's `default` collaborator list.
 *
 * When searching, the options are shown in two categories:
 * Recent Contacts and Search Results
 *
 * Search Results will display:
 * - Any group the user has permission to see (i.e. public groups or groups
 * they are a member of) whose display name contains the search term.
 *
 * - Any user whose ID or email exactly matches the search term. This is done
 * to address privacy concerns and also matches what Google has done with their
 * sharing interface, so users should hopefully be familiar.
 *
 * Recent Contacts will display:
 * - Any group from their recent contacts list whose display name contains
 * the search term.
 *
 * - Any user from their recent contacts list whose ID or email contains
 * (i.e. not exact match) the search term.
 * Since Recent Contacts will only contain contacts that the user has already
 * found via an exact match, there's no need to force an exact match again
 *
 */
import React, { useEffect, useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    CircularProgress,
    ListItemIcon,
    ListItemText,
    TextField,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { queryCache, useMutation, useQuery } from "react-query";

import ids from "./ids";
import {
    addRecentContacts,
    fetchRecentContactsList,
    RECENT_CONTACTS_LIST_NAME,
    RECENT_CONTACTS_QUERY,
    removeRecentContacts,
} from "serviceFacades/groups";
import { searchSubjects } from "serviceFacades/sharing";
import isQueryLoading from "../utils/isQueryLoading";
import { useTranslation } from "i18n";
import { groupName, isGroup } from "components/sharing/util";
import PersonIcon from "@material-ui/icons/Person";
import { TeamIcon } from "../teams/Icons";
import withErrorAnnouncer from "../error/withErrorAnnouncer";
import DeleteButton from "../utils/DeleteButton";

function recentContactMatches(option, searchTerm) {
    if (option.recentContact) {
        return (
            option.email?.includes(searchTerm) || option.id.includes(searchTerm)
        );
    }

    return false;
}

function groupMatches(option, searchTerm) {
    return isGroup(option) && groupName(option).includes(searchTerm);
}

function SubjectSearchField(props) {
    const { baseId, onUserSelected, onSearchStart, showErrorAnnouncer } = props;
    const { t } = useTranslation("sharing");
    const [searchTerm, setSearchTerm] = useState(null);
    const [options, setOptions] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [recentContacts, setRecentContacts] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { status: subjectSearchStatus } = useQuery({
        queryKey: { searchTerm },
        queryFn: searchSubjects,
        config: {
            enabled: searchTerm && searchTerm.length > 2,
            onSuccess: (resp) => {
                // Remove recent contacts list (default collab list) from search results
                // so user doesn't share with everyone they've ever shared with
                const subjects = resp?.subjects
                    .filter(
                        (subject) =>
                            groupName(subject) !== RECENT_CONTACTS_LIST_NAME
                    )
                    .map((subject) => {
                        return { ...subject, grouping: t("searchResults") };
                    });
                setSearchResults(subjects);
            },
        },
    });

    const { status: recentContactsStatus } = useQuery({
        queryKey: [RECENT_CONTACTS_QUERY],
        queryFn: fetchRecentContactsList,
        config: {
            onSuccess: (resp) => {
                const members = Object.values(resp);
                const contacts = members.map((member) => {
                    return {
                        ...member,
                        grouping: t("recentContacts"),
                        recentContact: true,
                    };
                });
                setRecentContacts(contacts);
            },
        },
    });

    useEffect(() => {
        setOptions([...(recentContacts || []), ...(searchResults || [])]);
    }, [recentContacts, searchResults]);

    const [addRecentContactMutation, { status: addRecentContactStatus }] =
        useMutation(addRecentContacts, {
            onSuccess: () =>
                queryCache.invalidateQueries([RECENT_CONTACTS_QUERY]),
            onError: (error) => {
                showErrorAnnouncer(t("addRecentContactError"), error);
            },
        });

    const [removeRecentContactMutation, { status: removeRecentContactStatus }] =
        useMutation(removeRecentContacts, {
            onSuccess: () =>
                queryCache.invalidateQueries([RECENT_CONTACTS_QUERY]),
            onError: (error) => {
                showErrorAnnouncer(t("removeRecentContactError"), error);
            },
        });

    const onUserAdded = () => {
        setSearchTerm(null);
    };

    const onInputChange = (event) => {
        if (event) {
            const newSearchTerm = event.target.value;
            setSearchTerm(newSearchTerm);
            newSearchTerm && onSearchStart && onSearchStart();
            //clear existing results on new search
            setOptions([]);
            setSearchResults([]);
        }
    };

    const renderCustomOption = (option) => {
        let optionLabel = null;
        let icon = null;
        if (isGroup(option)) {
            optionLabel = groupName(option);
            icon = (
                <TeamIcon
                    fontSize="small"
                    style={{ color: theme.palette.info.main }}
                />
            );
        } else {
            if (option.recentContact || searchTerm === option.id) {
                optionLabel = option.id;
            } else if (searchTerm === option.email) {
                optionLabel = option.email;
            }
            icon = (
                <PersonIcon
                    fontSize="small"
                    style={{ color: theme.palette.info.main }}
                />
            );
        }
        const DeleteBtn = () => (
            <DeleteButton
                component="IconButton"
                baseId={baseId}
                onClick={(event) => {
                    event.stopPropagation();
                    const userId = option.id;
                    removeRecentContactMutation({ members: [userId] });
                }}
                size="small"
            >
                <Close />
            </DeleteButton>
        );

        return (
            <>
                {option.recentContact && isMobile && (
                    <ListItemIcon>
                        <DeleteBtn />
                    </ListItemIcon>
                )}
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={optionLabel} />
                {option.recentContact && !isMobile && <DeleteBtn />}
            </>
        );
    };

    const loading = isQueryLoading([
        subjectSearchStatus,
        recentContactsStatus,
        addRecentContactStatus,
        removeRecentContactStatus,
    ]);

    return (
        <Autocomplete
            id={baseId}
            value={searchTerm}
            groupBy={(option) => option.grouping}
            onChange={(event, user) => {
                if (user) {
                    addRecentContactMutation({ members: [user.id] });
                    onUserSelected(user, onUserAdded);
                }
            }}
            onInputChange={onInputChange}
            getOptionSelected={(option, value) => option?.id === value?.id}
            getOptionLabel={(option) => {
                if (typeof option === "string") {
                    return option;
                }
                return isGroup(option)
                    ? groupName(option)
                    : option["display_name"] || "";
            }}
            filterOptions={(options, params) => {
                return options.filter(
                    (option) =>
                        searchTerm === option.email ||
                        searchTerm === option.id ||
                        groupMatches(option, searchTerm) ||
                        recentContactMatches(option, searchTerm)
                );
            }}
            loading={loading}
            options={options}
            noOptionsText={t("noUsersFound")}
            popupIcon={null}
            clearOnBlur={true}
            renderOption={(option, state) => renderCustomOption(option)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={isMobile ? t("searchUsersMobile") : t("searchUsers")}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress
                                        id={buildID(
                                            baseId,
                                            ids.LOADING_SKELETON
                                        )}
                                        color="inherit"
                                        size={20}
                                    />
                                ) : null}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}

export default withErrorAnnouncer(SubjectSearchField);
