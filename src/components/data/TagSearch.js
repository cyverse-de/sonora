/**
 * @author aramsey
 *
 * A component containing an Autocomplete component for searching,
 * creating, and applying tags to a resource.
 * Also contains a Paper component for displaying current tags.
 */
import React, { useState } from "react";

import buildID from "components/utils/DebugIDUtil";
import {
    Chip,
    CircularProgress,
    makeStyles,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import { HighlightOff } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { useTranslation } from "react-i18next";

import ids from "./ids";
import {
    attachTagsToResource,
    createUserTag,
    detachTagsFromResource,
    getTagsForResource,
    getTagSuggestions,
} from "../../serviceFacades/tags";
import styles from "./styles";
import isQueryLoading from "../utils/isQueryLoading";
import DEErrorDialog from "../error/DEErrorDialog";
import ErrorTypography from "../error/ErrorTypography";
import { useUserProfile } from "contexts/userProfile";

const useStyles = makeStyles(styles);

function TagSearch(props) {
    const {
        id,
        resource,
        initialTags,
        showHeader = true,
        handleTagAdded,
        handleTagRemoved,
    } = props;
    const classes = useStyles();
    const { t } = useTranslation("data");

    const [searchTerm, setSearchTerm] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState(initialTags || []);

    const resourceId = resource?.id;
    const fetchTagsQueryKey = ["dataTagsForResource", { resourceId }];
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorObject, setErrorObject] = useState(null);
    const [userProfile] = useUserProfile();

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const { isFetching: isFetchingTags } = useQuery({
        queryKey: fetchTagsQueryKey,
        enabled: !!resourceId,
        queryFn: () => getTagsForResource(fetchTagsQueryKey[1]),
        onSuccess: (resp) => setSelectedTags(resp.tags),
        onError: (e) => {
            setErrorObject(e);
            const status = e?.response?.status;
            setErrorMessage(
                status === 401
                    ? t("tagsSignInError")
                    : t("fetchTagSuggestionsError")
            );
        },
    });

    const { status: tagSuggestionStatus } = useQuery({
        queryKey: { searchTerm },
        queryFn: () => getTagSuggestions({ searchTerm }),
        enabled: !!userProfile?.id,
        onSuccess: (resp) => {
            setOptions(resp.tags);
        },
    });

    const { mutate: removeTag, status: tagDetachStatus } = useMutation(
        detachTagsFromResource,
        {
            onSuccess: () => queryClient.invalidateQueries(fetchTagsQueryKey),
            onError: (e) => {
                setErrorMessage(t("modifyTagsError"));
                setErrorObject(e);
            },
        }
    );

    const onTagRemove = (selectedTag) => {
        if (selectedTag) {
            if (handleTagRemoved) {
                handleTagRemoved(
                    selectedTags.findIndex((item) => item.id === selectedTag.id)
                );
                setSelectedTags(
                    selectedTags.filter((item) => item.id !== selectedTag.id)
                );
                return;
            }
            removeTag({ tagIds: [selectedTag.id], resourceId: resource.id });
        }
    };

    const { mutate: createTag, status: tagCreationStatus } = useMutation(
        createUserTag,
        {
            onSuccess: (resp, variables) => {
                const { value } = variables;
                const newTag = {
                    id: resp.id,
                    value,
                };
                onTagSelected(null, newTag);
            },
            onError: (e) => {
                setErrorMessage(t("modifyTagsError"));
                setErrorObject(e);
            },
        }
    );

    const { mutate: attachTagToResource, status: tagAttachStatus } =
        useMutation(attachTagsToResource, {
            onSuccess: () => {
                setSearchTerm(null);
                return queryClient.invalidateQueries(fetchTagsQueryKey);
            },
            onError: (e) => {
                setErrorMessage(t("modifyTagsError"));
                setErrorObject(e);
            },
        });

    const onTagSelected = (event, selectedTag) => {
        if (selectedTag) {
            const tagId = selectedTag.id;
            if (!tagId) {
                createTag({ value: selectedTag.tagValue });
                return;
            }

            if (handleTagAdded) {
                handleTagAdded(selectedTag);
                setSelectedTags([...selectedTags, selectedTag]);
                return;
            }

            // Check if a tag has already been added
            if (!selectedTags.find((tag) => tag.id === tagId)) {
                attachTagToResource({
                    tagIds: [selectedTag.id],
                    resourceId: resource.id,
                });
            } else {
                setSearchTerm("");
            }
        }
    };

    const onInputChange = (event) => {
        if (event) {
            const newSearchTerm = event.target.value;
            setSearchTerm(newSearchTerm);
        }
    };

    const loading = isQueryLoading([
        tagAttachStatus,
        tagCreationStatus,
        tagDetachStatus,
        isFetchingTags,
        tagSuggestionStatus,
    ]);

    return (
        <>
            {showHeader && (
                <Typography variant="subtitle1">{t("tags")}</Typography>
            )}

            <Autocomplete
                id={id}
                freeSolo
                value={searchTerm}
                onChange={onTagSelected}
                onInputChange={onInputChange}
                getOptionSelected={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                    if (typeof option === "string") {
                        return option;
                    }
                    return option.value ? option.value : "";
                }}
                filterOptions={(options, params) => {
                    // add an option which allows the user to add a new tag
                    // when no option matches the search term
                    const hasOption = options.find(
                        (tag) => tag.value === searchTerm
                    );
                    if (searchTerm && !hasOption) {
                        const fakeAdderTag = {
                            id: null,
                            value: t("createTag", {
                                label: searchTerm,
                            }),
                            tagValue: searchTerm,
                        };
                        return [...options, fakeAdderTag];
                    }
                    return options;
                }}
                loading={loading}
                options={options}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={t("searchTags")}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? (
                                        <CircularProgress
                                            id={buildID(
                                                id,
                                                ids.LOADING_SKELETON
                                            )}
                                            color="inherit"
                                            size={20}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
            {selectedTags && selectedTags.length > 0 && (
                <Paper
                    className={classes.tagPaper}
                    id={buildID(id, ids.SELECTED_TAGS)}
                >
                    {selectedTags.map((tag) => (
                        <Chip
                            id={buildID(id, ids.SELECTED_TAGS, tag.value)}
                            key={tag.id}
                            label={tag.value}
                            onDelete={() => onTagRemove(tag)}
                            deleteIcon={
                                <HighlightOff
                                    id={buildID(
                                        id,
                                        ids.SELECTED_TAGS,
                                        tag.value,
                                        ids.DELETE
                                    )}
                                />
                            }
                        />
                    ))}
                </Paper>
            )}
            {errorMessage && (
                <ErrorTypography
                    errorMessage={errorMessage}
                    onDetailsClick={() => setErrorDialogOpen(true)}
                />
            )}
            <DEErrorDialog
                open={errorDialogOpen}
                baseId={id}
                errorObject={errorObject}
                handleClose={() => {
                    setErrorDialogOpen(false);
                }}
            />
        </>
    );
}

export default TagSearch;
