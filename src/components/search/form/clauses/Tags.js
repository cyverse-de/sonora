import React from "react";

import { FieldArray } from "formik";

import TagSearch from "components/data/TagSearch";
import buildID from "components/utils/DebugIDUtil";
import ids from "../ids";

const TAGS_TYPE = "tag";
const TAGS_ARGS_DEFAULT = { tags: [] };

function Tags(props) {
    const {
        parentId,
        field: { name },
    } = props;

    return (
        <FieldArray
            name={`${name}.tags`}
            render={(arrayHelpers) => (
                <TagSearch
                    id={buildID(parentId, ids.TAG_SEARCH)}
                    showHeader={false}
                    handleTagAdded={(tag) => {
                        arrayHelpers.push(tag.id);
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
export { TAGS_ARGS_DEFAULT, TAGS_TYPE };
