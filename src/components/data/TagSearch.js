/**
 * @author aramsey
 *
 * A component containing an Autocomplete component for searching,
 * creating, and applying tags to a resource.
 * Also contains a Paper component for displaying current tags.
 */
import React, { useEffect, useState } from "react";

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

import callApi from "../../common/callApi";
import ids from "./ids";
import messages from "./messages";
import styles from "./styles";

const SEARCH_LIMIT = 10;
const useStyles = makeStyles(styles);

function TagSearch(props) {
    const { id, resource, intl } = props;
    const classes = useStyles();

    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        setLoading(true);
        callApi({
            endpoint: `/api/filesystem/entry/${resource.id}/tags`,
        }).then((resp) => {
            setSelectedTags(resp.tags);
            setLoading(false);
        });
    }, [resource]);

    const getTagSuggestions = (searchTerm) => {
        setLoading(true);
        callApi({
            endpoint: `/api/tags/suggestions?contains=${searchTerm}&limit=${SEARCH_LIMIT}`,
        }).then((resp) => {
            setOptions(resp.tags);
            setLoading(false);
        });
    };

    const onTagRemove = (selectedTag) => {
        const body = {
            tags: [selectedTag.id],
        };

        setLoading(true);
        callApi({
            endpoint: `/api/filesystem/entry/${resource.id}/tags?type=detach`,
            method: "PATCH",
            body,
        }).then((resp) => {
            const newTagList = [...selectedTags];
            const tagIndex = selectedTags.findIndex(
                (tag) => tag.id === selectedTag.id
            );
            newTagList.splice(tagIndex, 1);
            setSelectedTags(newTagList);
            setLoading(false);
        });
    };

    const createTag = (tagValue) => {
        const body = {
            value: tagValue,
        };

        setLoading(true);
        callApi({
            endpoint: `/api/tags/user`,
            method: "POST",
            body,
        }).then((resp) => {
            const newTag = {
                id: resp.id,
                value: tagValue,
            };
            onTagSelected(null, newTag);
        });
    };

    const onTagSelected = (event, selectedTag) => {
        if (selectedTag) {
            const tagId = selectedTag.id;
            setLoading(true);
            if (!tagId) {
                createTag(selectedTag.tagValue);
                return;
            }
            const body = {
                tags: [selectedTag.id],
            };

            // Check if a tag has already been added
            if (selectedTags.findIndex((tag) => tag.id === tagId) === -1) {
                callApi({
                    endpoint: `/api/filesystem/entry/${resource.id}/tags?type=attach`,
                    method: "PATCH",
                    body,
                }).then((resp) => {
                    setSelectedTags([...selectedTags, selectedTag]);
                    setSearchTerm("");
                    setLoading(false);
                });
            } else {
                setSearchTerm("");
                setLoading(false);
            }
        }
    };

    const onInputChange = (event) => {
        if (event) {
            const newSearchTerm = event.target.value;
            setSearchTerm(newSearchTerm);
            getTagSuggestions(newSearchTerm);
        }
    };

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
                    const hasOption =
                        options.findIndex((tag) => tag.value === searchTerm) !==
                        -1;
                    if (searchTerm !== "" && !hasOption) {
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
        </>
    );
}

export default withI18N(injectIntl(TagSearch), messages);
