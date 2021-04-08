import React from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import {
    DEFAULTS_MAPPING_QUERY_KEY,
    getDefaultsMapping,
    updateDefaultsMapping,
} from "serviceFacades/instantlaunches";

import WrappedErrorHandler from "components/utils/error/WrappedErrorHandler";

import { Skeleton } from "@material-ui/lab";

import uuid from "uuid";

import {
    Button,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
} from "@material-ui/core";
import { useTranslation } from "i18n";

const InstantLaunchMappingEditor = ({ showErrorAnnouncer }) => {
    const baseID = "instantLaunchMappingEditor";

    const { t } = useTranslation("instantlaunches");

    const defaultsMapping = useQuery(
        DEFAULTS_MAPPING_QUERY_KEY,
        getDefaultsMapping
    );

    const isLoading = defaultsMapping.isLoading;
    const isError = defaultsMapping.isError;

    const handleDelete = async (index) => {
        const newEntries = Object.entries(defaultsMapping.data.mapping);
        newEntries.splice(index, 1);
        const newObj = Object.fromEntries(newEntries);
        console.log(JSON.stringify(newObj, null, 2));
        return await updateDefaultsMapping(newObj);
    };

    const [deleteEntry] = useMutation(handleDelete, {
        onSuccess: () =>
            queryCache.invalidateQueries(DEFAULTS_MAPPING_QUERY_KEY),
        onError: (error) =>
            showErrorAnnouncer(t("deleteMappingEntryError"), error),
    });

    return (
        <div>
            {isLoading ? (
                <Skeleton
                    variant="rect"
                    animation="wave"
                    height={300}
                    width="100%"
                />
            ) : isError ? (
                <WrappedErrorHandler
                    errorObject={defaultsMapping.error}
                    baseId={baseID}
                />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("name")}</TableCell>
                                <TableCell>{t("patternKind")}</TableCell>
                                <TableCell>{t("pattern")}</TableCell>
                                <TableCell>{t("quicklaunch")}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {defaultsMapping?.data?.mapping &&
                                Object.entries(
                                    defaultsMapping.data.mapping
                                ).map(([name, patternObj], index) => {
                                    return (
                                        <TableRow key={uuid.v4()}>
                                            <TableCell>{name}</TableCell>
                                            <TableCell>
                                                {patternObj.kind}
                                            </TableCell>
                                            <TableCell>
                                                {patternObj.pattern}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    patternObj.default
                                                        .quick_launch_id
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        event.preventDefault();

                                                        deleteEntry(index);
                                                    }}
                                                >
                                                    {t("delete")}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default withErrorAnnouncer(InstantLaunchMappingEditor);
