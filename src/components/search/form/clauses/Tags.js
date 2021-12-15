/**
 * @author aramsey
 *
 * The clause for handling tags in an advanced data search.
 *
 * Multiple tags can be specified.
 */
import React from "react";

import { FieldArray, getIn } from "formik";

import TagSearch from "components/data/TagSearch";
import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";

const TAGS_TYPE = "tag";
const TAGS_ARGS_DEFAULT = { tags: [] };

// convert tags to just tag ids
const formatTagVals = (clause) => {
    // create copy of the clause, don't modify the original otherwise it
    // mutates the form
    let filteredValues = JSON.parse(JSON.stringify(clause));
    let args = filteredValues.args;

    const tagIds = args.tags.map((tag) => tag.id);
    filteredValues.args.tags = tagIds;
    return filteredValues;
};

function Tags(props) {
    const {
        parentId,
        field: { name },
        form: { values },
    } = props;

    const tagsFieldName = `${name}.tags`;
    const initialTags = getIn(values, tagsFieldName);

    return (
        <FieldArray
            name={`${name}.tags`}
            render={(arrayHelpers) => (
                <TagSearch
                    id={buildID(parentId, ids.TAG_SEARCH)}
                    initialTags={initialTags}
                    showHeader={false}
                    handleTagAdded={(tag) => {
                        arrayHelpers.push(tag);
                    }}
                    handleTagRemoved={(index) => {
                        arrayHelpers.remove(index);
                    }}
                />
            )}
        />
    );
}

export default Tags;
export { TAGS_ARGS_DEFAULT, TAGS_TYPE, formatTagVals };
