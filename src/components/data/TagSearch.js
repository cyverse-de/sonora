/**
 * @author aramsey
 *
 * A component containing an Autocomplete component for searching,
 * creating, and applying tags to a resource.
 * Also contains a Paper component for displaying current tags.
 */
import React, { useState } from "react";

import { build, formatMessage, getMessage, withI18N } from "@cyverse-de/ui-lib";
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
import { injectIntl } from "react-intl";
import { queryCache, useMutation, useQuery } from "react-query";

import ids from "./ids";
import {
    attachTagsToResource,
    createUserTag,
    detachTagsFromResource,
    getTagsForResource,
    getTagSuggestions,
} from "../../serviceFacades/tags";
import messages from "./messages";
import styles from "./styles";
import isQueryLoading from "../utils/isQueryLoading";
import DEErrorDialog from "../utils/error/DEErrorDialog";
import ErrorTypography from "../utils/error/ErrorTypography";

const useStyles = makeStyles(styles);

function TagSearch(props) {
    const { id, resource, intl } = props;
    const classes = useStyles();

    const [searchTerm, setSearchTerm] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const resourceId = resource.id;
    const fetchTagsQueryKey = ["dataTagsForResource", { resourceId }];
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [errorObject, setErrorObject] = useState(null);

    const { isFetching: isFetchingTags } = useQuery({
        queryKey: fetchTagsQueryKey,
        queryFn: getTagsForResource,
        config: {
            onSuccess: (resp) => setSelectedTags(resp.tags),
            onError: (e) => {
                setErrorObject(e);
                setErrorMessage(
                    formatMessage(intl, "fetchTagSuggestionsError")
                );
            },
        },
    });

    const { status: tagSuggestionStatus } = useQuery({
        queryKey: { searchTerm },
        queryFn: getTagSuggestions,
        config: {
            onSuccess: (resp) => {
                setOptions(resp.tags);
            },
        },
    });

    const [removeTag, { status: tagDetachStatus }] = useMutation(
        detachTagsFromResource,
        {
            onSuccess: () => queryCache.invalidateQueries(fetchTagsQueryKey),
            onError: (e) => {
                setErrorMessage(formatMessage(intl, "modifyTagsError"));
                setErrorObject(e);
            },
        }
    );

    const onTagRemove = (selectedTag) => {
        removeTag({ tagIds: [selectedTag.id], resourceId: resource.id });
    };

    const [createTag, { status: tagCreationStatus }] = useMutation(
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
                setErrorMessage(formatMessage(intl, "modifyTagsError"));
                setErrorObject(e);
            },
        }
    );

    const [attachTagToResource, { status: tagAttachStatus }] = useMutation(
        attachTagsToResource,
        {
            onSuccess: () => {
                setSearchTerm(null);
                return queryCache.invalidateQueries(fetchTagsQueryKey);
            },
            onError: (e) => {
                setErrorMessage(formatMessage(intl, "modifyTagsError"));
                setErrorObject(e);
            },
        }
    );

    const onTagSelected = (event, selectedTag) => {
        if (selectedTag) {
            const tagId = selectedTag.id;
            if (!tagId) {
                createTag({ value: selectedTag.tagValue });
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
            <Typography variant="subtitle1">{getMessage("tags")}</Typography>

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
                            value: formatMessage(intl, "createTag", {
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
                        label={getMessage("searchTags")}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? (
                                        <CircularProgress
                                            id={build(id, ids.LOADING_SKELETON)}
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
                    id={build(id, ids.SELECTED_TAGS)}
                >
                    {selectedTags.map((tag) => (
                        <Chip
                            id={build(id, ids.SELECTED_TAGS, tag.value)}
                            key={tag.id}
                            label={tag.value}
                            onDelete={() => onTagRemove(tag)}
                            deleteIcon={
                                <HighlightOff
                                    id={build(
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

export default withI18N(injectIntl(TagSearch), messages);
