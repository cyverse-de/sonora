import React from "react";

import { Button, Grid } from "@material-ui/core";
import { Field, Formik } from "formik";

import DEDialog from "components/utils/DEDialog";
import GridLabelValue from "components/utils/GridLabelValue";
import {
    Created,
    CREATED_ARGS_DEFAULT,
    CREATED_TYPE,
    Modified,
    MODIFIED_ARGS_DEFAULT,
    MODIFIED_TYPE,
    formatDateValues,
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
import Tags, { TAGS_ARGS_DEFAULT, TAGS_TYPE } from "./clauses/Tags";
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

const initialValue = () => {
    return CLAUSE_LIST.map((clause) => {
        return {
            type: clause.type,
            args: clause.defaultArgs,
        };
    });
};

const CLAUSE_LIST = [
    {
        type: LABEL_TYPE,
        component: FileName,
        defaultArgs: LABEL_ARGS_DEFAULT,
    },
    {
        type: PATH_TYPE,
        component: Path,
        defaultArgs: PATH_ARGS_DEFAULT,
    },
    {
        type: MODIFIED_TYPE,
        component: Modified,
        defaultArgs: MODIFIED_ARGS_DEFAULT,
        getFormattedValue: formatDateValues,
    },
    {
        type: CREATED_TYPE,
        component: Created,
        defaultArgs: CREATED_ARGS_DEFAULT,
        getFormattedValue: formatDateValues,
    },
    {
        type: SIZE_TYPE,
        component: FileSize,
        defaultArgs: SIZE_ARGS_DEFAULT,
        getFormattedValue: formatFileSizeValues,
    },
    {
        type: METADATA_TYPE,
        component: Metadata,
        defaultArgs: METADATA_ARGS_DEFAULT,
        getFormattedValue: formatMetadataVals,
    },
    {
        type: TAGS_TYPE,
        component: Tags,
        defaultArgs: TAGS_ARGS_DEFAULT,
    },
    {
        type: OWNER_TYPE,
        component: Owner,
        defaultArgs: OWNER_ARGS_DEFAULT,
    },
    {
        type: PERMISSIONS_TYPE,
        component: Permissions,
        defaultArgs: PERMISSIONS_ARGS_DEFAULT,
        getFormattedValue: removeEmptyPermissionVals,
    },
];

/**
 *
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

    const handleSubmit = (values, { resetForm }) => {
        const filledInClauses = clearEmptyValues(values);
        if (filledInClauses?.length > 0) {
            const advancedDataQuery = { query: { all: filledInClauses } };
            const href = getSearchLink({ advancedDataQuery });
            router.push(href);
        }
        resetForm();
        onClose();
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValue()}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => (
                <DEDialog
                    baseId={ids.ADVANCED_SEARCH_DLG}
                    title={t("advancedSearch")}
                    open={open}
                    onClose={onClose}
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
                        {CLAUSE_LIST.map((clause, index) => (
                            <GridLabelValue label={t(clause.type)} key={index}>
                                <Field
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
