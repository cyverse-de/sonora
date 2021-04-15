import React from "react";

import { queryCache, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/utils/error/withErrorAnnouncer";

import {
    createDefaultsMapping,
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
    IconButton,
} from "@material-ui/core";

import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";

import { useTranslation } from "i18n";
import { useFormik } from "formik";

const useStyles = makeStyles((theme) => ({
    title: {
        paddingTop: theme.spacing(2),
    },
    text: {
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    sectionTitle: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(2),
    },
    flexContainer: {
        marginTop: 0,
        marginLeft: theme.spacing(1),
        marginBottom: theme.spacing(4),
        marginRight: theme.spacing(2),
        display: "flex",

        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            minWidth: "25ch",
        },
    },
    flexItem: {
        marginTop: 0,
        marginBottom: 0,
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    submitButton: {
        height: theme.spacing(5),
    },
}));

const AddMappingForm = ({ t, handleSubmit, instantlaunches }) => {
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            mappingName: "",
            patternKind: "",
            pattern: "",
            instantLaunch: "",
        },
        onSubmit: handleSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} className={classes.flexContainer}>
            <TextField
                id="mappingName"
                name="mappingName"
                label={t("common:name")}
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
                <MenuItem value="glob" key="glob">
                    {t("glob")}
                </MenuItem>
                <MenuItem value="infoType" key="infoType">
                    {t("infoType")}
                </MenuItem>
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
                value={formik.values.instantLaunch}
                onChange={formik.handleChange}
                id="instantLaunch"
                name="instantLaunch"
                label={t("instantLaunch")}
                className={classes.flexItem}
                select
            >
                {instantlaunches.map((il, index) => {
                    return (
                        <MenuItem value={index} key={il.id}>
                            {il.quick_launch_name}
                        </MenuItem>
                    );
                })}
            </TextField>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                className={`${classes.submitButton} ${classes.flexItem}`}
            >
                {t("common:add")}
            </Button>
        </form>
    );
};

const InstantLaunchMappingEditor = ({ showErrorAnnouncer }) => {
    const baseID = "instantLaunchMappingEditor";

    const classes = useStyles();

    const { t } = useTranslation(["instantlaunches", "common"]);

    const defaultsMapping = useQuery(
        DEFAULTS_MAPPING_QUERY_KEY,
        getDefaultsMapping
    );

    const instantlaunches = useQuery(
        ALL_INSTANT_LAUNCHES_KEY,
        listFullInstantLaunches
    );

    const handleDelete = async (index) => {
        const newEntries = Object.entries(defaultsMapping.data.mapping);
        newEntries.splice(index, 1);
        const newObj = Object.fromEntries(newEntries);
        return await updateDefaultsMapping(newObj);
    };

    const [deleteEntry] = useMutation(handleDelete, {
        onSuccess: () =>
            queryCache.invalidateQueries(DEFAULTS_MAPPING_QUERY_KEY),
        onError: (error) =>
            showErrorAnnouncer(t("deleteMappingEntryError"), error),
    });

    const [updateMapping] = useMutation(updateDefaultsMapping, {
        onSuccess: () =>
            queryCache.invalidateQueries(DEFAULTS_MAPPING_QUERY_KEY),
        onError: (error) => showErrorAnnouncer(t("updateMappingError"), error),
    });

    const [createMapping] = useMutation(createDefaultsMapping, {
        onSuccess: () =>
            queryCache.invalidateQueries(DEFAULTS_MAPPING_QUERY_KEY),
        onError: (error) => showErrorAnnouncer(t("createMappingError"), error),
    });

    const [doCreate, setDoCreate] = React.useState(false);

    React.useEffect(() => {
        if (defaultsMapping.isError) {
            if (defaultsMapping.error.response.status === 404) {
                defaultsMapping.data = {};
                defaultsMapping.isError = false;
                setDoCreate(true);
            }
        }
        return () => {};
    }, [defaultsMapping]);

    const handleSubmit = (values) => {
        // We're storing the index into the instantlaunches Array in the formik Values,
        // so we have to get it from the list.
        const selectedIL =
            instantlaunches.data.instant_launches[values.instantLaunch];

        // The selected instant launch may have extra fields depending on where it came
        // from, so filter out the unnecessary stuff.
        const filteredIL = {
            id: selectedIL.id,
            quick_launch_id: selectedIL.quick_launch_id,
            added_on: selectedIL.added_on,
            added_by: selectedIL.added_by,
        };

        // The full mapping.
        const m = {
            ...defaultsMapping.data.mapping,
            [values.mappingName]: {
                pattern: values.pattern,
                kind: values.patternKind,
                default: filteredIL,
                compatible: [],
            },
        };

        // Create the mapping if we got a 404 when grabbing the values.
        if (doCreate) {
            return createMapping(m);
        }
        return updateMapping(m);
    };

    const isLoading = defaultsMapping.isLoading || instantlaunches.isLoading;
    const isError = defaultsMapping.isError || instantlaunches.isError;

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
                <Paper>
                    <Typography
                        variant="h5"
                        className={`${classes.title} ${classes.text}`}
                    >
                        {t("dataMapping")}
                    </Typography>

                    <Typography variant="body2" className={classes.text}>
                        {t("mappingDescription")}
                    </Typography>

                    <Typography
                        variant="h6"
                        className={`${classes.sectionTitle} ${classes.text}`}
                    >
                        {t("addToMapping")}
                    </Typography>

                    <AddMappingForm
                        handleSubmit={handleSubmit}
                        mapping={defaultsMapping}
                        instantlaunches={instantlaunches.data.instant_launches}
                        t={t}
                    />

                    <Typography
                        variant="h6"
                        className={`${classes.sectionTitle} ${classes.text}`}
                    >
                        {t("displayMapping")}
                    </Typography>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("common:name")}</TableCell>
                                    <TableCell>{t("patternKind")}</TableCell>
                                    <TableCell>{t("pattern")}</TableCell>
                                    <TableCell>{t("quickLaunch")}</TableCell>
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
                                                    <IconButton
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            event.preventDefault();

                                                            deleteEntry(index);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </div>
    );
};

export default withErrorAnnouncer(InstantLaunchMappingEditor);
