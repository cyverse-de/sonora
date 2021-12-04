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
} from "./clauses/Date";
import { useTranslation } from "i18n";
import FileName, { LABEL_ARGS_DEFAULT, LABEL_TYPE } from "./clauses/FileName";
import Path, { PATH_ARGS_DEFAULT, PATH_TYPE } from "./clauses/Path";
import FileSize, { SIZE_ARGS_DEFAULT, SIZE_TYPE } from "./clauses/FileSize";
import Metadata, {
    METADATA_ARGS_DEFAULT,
    METADATA_TYPE,
} from "./clauses/Metadata";
import Tags, { TAGS_ARGS_DEFAULT, TAGS_TYPE } from "./clauses/Tags";
import Owner, { OWNER_ARGS_DEFAULT, OWNER_TYPE } from "./clauses/Owner";
import Permissions, {
    PERMISSIONS_ARGS_DEFAULT,
    PERMISSIONS_TYPE,
} from "./clauses/Permissions";
import ids from "./ids";
import { getSearchLink } from "../utils";
import { useRouter } from "next/router";

const initialValue = () => {
    return {
        query: {
            all: CLAUSE_LIST.map((clause) => {
                return {
                    type: clause.type,
                    args: clause.defaultArgs,
                };
            }),
        },
    };
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
    },
    {
        type: CREATED_TYPE,
        component: Created,
        defaultArgs: CREATED_ARGS_DEFAULT,
    },
    {
        type: SIZE_TYPE,
        component: FileSize,
        defaultArgs: SIZE_ARGS_DEFAULT,
    },
    {
        type: METADATA_TYPE,
        component: Metadata,
        defaultArgs: METADATA_ARGS_DEFAULT,
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
    },
];

function SearchForm(props) {
    const { open, onClose } = props;
    const { t } = useTranslation("search");
    const router = useRouter();

    const clearEmptyValues = (values) => {
        const clauses = values.query.all;

        const updatedClauses = clauses.filter((clause, index) => {
            return (
                JSON.stringify(clause.args) !==
                JSON.stringify(CLAUSE_LIST[index].defaultArgs)
            );
        });

        return updatedClauses?.length > 0
            ? { query: { all: updatedClauses } }
            : null;
    };

    const handleSubmit = (values) => {
        const filledInValues = clearEmptyValues(values);
        const href = getSearchLink({ advancedDataQuery: filledInValues });
        router.push(href);
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
                                    name={`query.all.${index}.args`}
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
