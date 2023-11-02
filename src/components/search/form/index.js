/**
 * @author aramsey
 *
 * The dialog that opens to show the advanced data search form.
 *
 * All available search clauses are displayed and the query will execute
 * with ALL clauses needing to be true.
 *
 */
import React from "react";

import { Button, Grid } from "@mui/material";
import { FastField, Formik } from "formik";

import DEDialog from "components/utils/DEDialog";
import GridLabelValue from "components/utils/GridLabelValue";
import { useUserProfile } from "contexts/userProfile";
import {
    Created,
    CREATED_ARGS_DEFAULT,
    CREATED_TYPE,
    formatDateValues,
    Modified,
    MODIFIED_ARGS_DEFAULT,
    MODIFIED_TYPE,
} from "./clauses/Date";
import { useTranslation } from "i18n";
import FileName, { LABEL_ARGS_DEFAULT, LABEL_TYPE } from "./clauses/FileName";
import Path, { PATH_ARGS_DEFAULT, PATH_TYPE } from "./clauses/Path";
import FileSize, {
    formatFileSizeValues,
    SIZE_ARGS_DEFAULT,
    SIZE_TYPE,
} from "./clauses/FileSize";
import Metadata, {
    METADATA_ARGS_DEFAULT,
    METADATA_TYPE,
    formatMetadataVals,
} from "./clauses/Metadata";
import Tags, {
    formatTagVals,
    TAGS_ARGS_DEFAULT,
    TAGS_TYPE,
} from "./clauses/Tags";
import Owner, { OWNER_ARGS_DEFAULT, OWNER_TYPE } from "./clauses/Owner";
import Permissions, {
    PERMISSIONS_ARGS_DEFAULT,
    PERMISSIONS_TYPE,
    removeEmptyPermissionVals,
} from "./clauses/Permissions";
import ids from "./ids";
import { getSearchLink } from "../utils";
import { useRouter } from "next/router";

/**
 * @typedef {object} Clause
 * @property {string} type
 * @property {object} args
 */

const initialValue = (clauseList) => {
    return clauseList.map((clause) => {
        return {
            type: clause.type,
            args: clause.defaultArgs,
        };
    });
};

const getClauseList = (userId) => {
    return userId
        ? CLAUSE_LIST
        : CLAUSE_LIST.filter((clause) => !clause.requiresLogIn);
};

const CLAUSE_LIST = [
    {
        type: LABEL_TYPE,
        component: FileName,
        defaultArgs: LABEL_ARGS_DEFAULT,
        requiresLogIn: false,
    },
    {
        type: PATH_TYPE,
        component: Path,
        defaultArgs: PATH_ARGS_DEFAULT,
        requiresLogIn: false,
    },
    {
        type: MODIFIED_TYPE,
        component: Modified,
        defaultArgs: MODIFIED_ARGS_DEFAULT,
        getFormattedValue: formatDateValues,
        requiresLogIn: false,
    },
    {
        type: CREATED_TYPE,
        component: Created,
        defaultArgs: CREATED_ARGS_DEFAULT,
        getFormattedValue: formatDateValues,
        requiresLogIn: false,
    },
    {
        type: SIZE_TYPE,
        component: FileSize,
        defaultArgs: SIZE_ARGS_DEFAULT,
        getFormattedValue: formatFileSizeValues,
        requiresLogIn: false,
    },
    {
        type: METADATA_TYPE,
        component: Metadata,
        defaultArgs: METADATA_ARGS_DEFAULT,
        getFormattedValue: formatMetadataVals,
        requiresLogIn: false,
    },
    {
        type: TAGS_TYPE,
        component: Tags,
        defaultArgs: TAGS_ARGS_DEFAULT,
        getFormattedValue: formatTagVals,
        requiresLogIn: false,
    },
    {
        type: OWNER_TYPE,
        component: Owner,
        defaultArgs: OWNER_ARGS_DEFAULT,
        requiresLogIn: true,
    },
    {
        type: PERMISSIONS_TYPE,
        component: Permissions,
        defaultArgs: PERMISSIONS_ARGS_DEFAULT,
        getFormattedValue: removeEmptyPermissionVals,
        requiresLogIn: true,
    },
];

/**
 * Takes in the list of filled out clauses and will trim out any empty clauses
 * or empty values.  Will also format any clause values as needed.
 * @param values
 * @returns {Clause[]|null}
 */
const clearEmptyValues = (values) => {
    let clauses = [];
    values.forEach((clause) => {
        const clauseDefinition = CLAUSE_LIST.find(
            (item) => item.type === clause.type
        );
        const isInitializedValue =
            JSON.stringify(clause.args) ===
            JSON.stringify(clauseDefinition.defaultArgs);
        if (!isInitializedValue) {
            const clauseVal = clauseDefinition.getFormattedValue
                ? clauseDefinition.getFormattedValue(clause)
                : clause;
            if (clauseVal) {
                clauses.push(clauseVal);
            }
        }
    });

    return clauses;
};

function SearchForm(props) {
    const { open, onClose } = props;
    const { t } = useTranslation("search");
    const router = useRouter();
    const [userProfile] = useUserProfile();

    const clauseList = getClauseList(userProfile?.id);
    const initialValues = initialValue(clauseList);

    const handleSubmit = (values) => {
        const filledInClauses = clearEmptyValues(values);
        if (filledInClauses?.length > 0) {
            const advancedDataQuery = { query: { all: filledInClauses } };
            const href = getSearchLink({ advancedDataQuery });
            router.push(href);
        }
        onClose();
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => (
                <DEDialog
                    baseId={ids.ADVANCED_SEARCH_DLG}
                    title={t("advancedSearch")}
                    open={open}
                    onClose={onClose}
                    maxWidth="md"
                    actions={
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            {t("search")}
                        </Button>
                    }
                >
                    <Grid container alignItems="center" spacing={2}>
                        {clauseList.map((clause, index) => (
                            <GridLabelValue
                                label={t(clause.type)}
                                key={index}
                                wordBreak="unset"
                            >
                                <FastField
                                    parentId={ids.ADVANCED_SEARCH_DLG}
                                    name={`${index}.args`}
                                    component={clause.component}
                                />
                            </GridLabelValue>
                        ))}
                    </Grid>
                </DEDialog>
            )}
        </Formik>
    );
}

export default SearchForm;
export { clearEmptyValues };
