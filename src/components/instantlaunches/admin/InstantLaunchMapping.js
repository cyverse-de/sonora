import React from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import {
    ALL_INSTANT_LAUNCHES_KEY,
    DEFAULTS_MAPPING_QUERY_KEY,
    getDefaultsMapping,
    listFullInstantLaunches,
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
    TextField,
    makeStyles,
    MenuItem,
    Typography,
} from "@material-ui/core";
import { useTranslation } from "i18n";
import { useFormik } from "formik";

const useStyles = makeStyles((theme) => ({
    title: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },
    flexContainer: {
        margin: `0 5px 20px 5px`,
        display: "flex",

        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            minWidth: "25ch",
        },
    },
    flexItem: {
        margin: `0 10px`,
    },
}));

const AddMappingForm = ({ t, mapping, instantlaunches }) => {
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            mappingName: "",
            patternKind: "",
            pattern: "",
            quicklaunch: "",
        },
        onSubmit: (values) => {
            console.log(JSON.stringify(values, null, 2));
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={classes.flexContainer}>
            <TextField
                id="mappingName"
                name="mappingName"
                label={t("name")}
                className={classes.flexItem}
                value={formik.values.mappingName}
                onChange={formik.handleChange}
                error={formik.touched.mappingName && formik.errors.mappingName}
                helperText={
                    formik.touched.mappingName && formik.errors.mappingName
                }
            />

            <TextField
                value={formik.values.patternKind}
                onChange={formik.handleChange}
                id="patternKind"
                name="patternKind"
                label={t("patternKind")}
                className={classes.flexItem}
                select
            >
                <MenuItem value="glob">{t("glob")}</MenuItem>
                <MenuItem value="infoType">{t("infoType")}</MenuItem>
            </TextField>

            <TextField
                id="pattern"
                name="pattern"
                label={t("pattern")}
                value={formik.values.pattern}
                onChange={formik.handleChange}
                className={classes.flexItem}
                error={formik.touched.pattern && formik.errors.pattern}
                helperText={formik.touched.pattern && formik.errors.pattern}
            />

            <TextField
                value={formik.values.quicklaunch}
                onChange={formik.handleChange}
                id="quicklaunch"
                name="quicklaunch"
                label={t("quickLaunch")}
                className={classes.flexItem}
                select
            >
                {instantlaunches.map((il, index) => {
                    return (
                        <MenuItem value={index}>
                            {il.quick_launch_name}
                        </MenuItem>
                    );
                })}
            </TextField>

            <Button type="submit" variant="contained" color="primary">
                {t("addMapping")}
            </Button>
        </form>
    );
};

const InstantLaunchMappingEditor = ({ showErrorAnnouncer }) => {
    const baseID = "instantLaunchMappingEditor";

    const classes = useStyles();

    const { t } = useTranslation("instantlaunches");

    const defaultsMapping = useQuery(
        DEFAULTS_MAPPING_QUERY_KEY,
        getDefaultsMapping
    );

    const instantlaunches = useQuery(
        ALL_INSTANT_LAUNCHES_KEY,
        listFullInstantLaunches
    );

    const isLoading = defaultsMapping.isLoading || instantlaunches.isLoading;
    const isError = defaultsMapping.isError || instantlaunches.isLoading;

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
                    errorObject={defaultsMapping.error || instantlaunches.error}
                    baseId={baseID}
                />
            ) : (
                <div>
                    <Typography variant="h4" className={classes.title}>
                        {t("addToMapping")}
                    </Typography>
                    <AddMappingForm
                        mapping={defaultsMapping}
                        instantlaunches={instantlaunches.data.instant_launches}
                        t={t}
                    />

                    <Typography variant="h4" className={classes.title}>
                        {t("displayMapping")}
                    </Typography>
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
                                                        variant="contained"
                                                        color="primary"
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
                </div>
            )}
        </div>
    );
};

export default withErrorAnnouncer(InstantLaunchMappingEditor);
