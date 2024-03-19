import React from "react";

import { useQueryClient, useMutation, useQuery } from "react-query";

import withErrorAnnouncer from "components/error/withErrorAnnouncer";

import {
    createDefaultsMapping,
    ALL_INSTANT_LAUNCHES_KEY,
    DEFAULTS_MAPPING_QUERY_KEY,
    LIST_PUBLIC_SAVED_LAUNCHES_KEY,
    getPublicSavedLaunches,
    getDefaultsMapping,
    listFullInstantLaunches,
    updateDefaultsMapping,
} from "serviceFacades/instantlaunches";

import { getInfoTypes, INFO_TYPES_QUERY_KEY } from "serviceFacades/filesystem";

import WrappedErrorHandler from "components/error/WrappedErrorHandler";

import { Skeleton } from "@mui/material";

import ids from "components/instantlaunches/ids";

import buildID from "components/utils/DebugIDUtil";

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
    MenuItem,
    Typography,
    IconButton,
} from "@mui/material";

import { makeStyles } from "tss-react/mui";

import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

import { useTranslation } from "i18n";
import { useFormik } from "formik";

const useStyles = makeStyles()((theme) => ({
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
        flexWrap: "wrap",

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

const initialValues = {
    mappingName: "",
    patternKind: "",
    pattern: "",
    instantLaunch: "",
};

const AddMappingForm = ({ t, handleSubmit, instantlaunches, infoTypes }) => {
    const baseID = buildID(ids.BASE, ids.MAPPING, ids.ADD, ids.FORM);
    const { classes } = useStyles();

    const formik = useFormik({
        initialValues,
        onSubmit: handleSubmit,
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className={classes.flexContainer}
            id={baseID}
        >
            <TextField
                variant="standard"
                id={buildID(baseID, ids.NAME)}
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
                variant="standard"
                value={formik.values.patternKind}
                onChange={formik.handleChange}
                id={buildID(baseID, ids.PATTERN, ids.KIND, ids.MENU)}
                name="patternKind"
                label={t("patternKind")}
                className={classes.flexItem}
                select
            >
                <MenuItem
                    value="glob"
                    key="glob"
                    id={buildID(
                        baseID,
                        ids.PATTERN,
                        ids.KIND,
                        ids.MENU,
                        ids.GLOB
                    )}
                >
                    {t("glob")}
                </MenuItem>

                <MenuItem
                    value="infoType"
                    key="infoType"
                    id={buildID(
                        baseID,
                        ids.PATTERN,
                        ids.KIND,
                        ids.MENU,
                        ids.INFO_TYPE
                    )}
                >
                    {t("infoType")}
                </MenuItem>
            </TextField>

            {formik.values.patternKind === "infoType" ? (
                <TextField
                    variant="standard"
                    id={buildID(baseID, ids.INFO_TYPE, ids.MENU)}
                    name="pattern"
                    label={t("infoType")}
                    className={classes.flexItem}
                    value={formik.values.pattern}
                    onChange={formik.handleChange}
                    select
                >
                    {infoTypes.map((infoType) => (
                        <MenuItem
                            value={infoType}
                            key={infoType}
                            id={buildID(
                                baseID,
                                ids.INFO_TYPE,
                                ids.MENU,
                                infoType
                            )}
                        >
                            {infoType}
                        </MenuItem>
                    ))}
                </TextField>
            ) : (
                <TextField
                    variant="standard"
                    id={buildID(baseID, ids.PATTERN)}
                    name="pattern"
                    label={t("pattern")}
                    value={formik.values.pattern}
                    onChange={formik.handleChange}
                    className={classes.flexItem}
                    error={formik.touched.pattern && formik.errors.pattern}
                    helperText={formik.touched.pattern && formik.errors.pattern}
                />
            )}

            <TextField
                variant="standard"
                id={buildID(baseID, ids.BASE, ids.MENU)}
                value={formik.values.instantLaunch}
                onChange={formik.handleChange}
                name="instantLaunch"
                label={t("instantLaunch")}
                className={classes.flexItem}
                select
            >
                {instantlaunches.map((il, index) => {
                    return (
                        <MenuItem
                            value={index}
                            key={il.id}
                            id={buildID(baseID, ids.BASE, ids.MENU, index)}
                        >
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
                id={buildID(baseID, ids.ADD, ids.BUTTON)}
            >
                {t("common:add")}
            </Button>
        </form>
    );
};

const InstantLaunchMappingEditor = ({ showErrorAnnouncer }) => {
    const baseID = buildID(ids.BASE, ids.MAPPING, ids.EDITOR);

    const { classes } = useStyles();

    const { t } = useTranslation(["instantlaunches", "common"]);

    const defaultsMapping = useQuery(
        DEFAULTS_MAPPING_QUERY_KEY,
        getDefaultsMapping
    );

    const instantlaunches = useQuery(
        ALL_INSTANT_LAUNCHES_KEY,
        listFullInstantLaunches
    );

    const allQL = useQuery(
        LIST_PUBLIC_SAVED_LAUNCHES_KEY,
        getPublicSavedLaunches
    );

    // Get QueryClient from the context
    const queryClient = useQueryClient();

    const infoTypes = useQuery(INFO_TYPES_QUERY_KEY, getInfoTypes);

    const handleDelete = async (mappingName) => {
        const { [mappingName]: _, ...newMapping } =
            defaultsMapping.data.mapping;
        return await updateDefaultsMapping(newMapping);
    };

    const { mutate: deleteEntry } = useMutation(handleDelete, {
        onSuccess: () =>
            queryClient.invalidateQueries(DEFAULTS_MAPPING_QUERY_KEY),
        onError: (error) =>
            showErrorAnnouncer(t("deleteMappingEntryError"), error),
    });

    const { mutate: updateMapping } = useMutation(updateDefaultsMapping, {
        onSuccess: () =>
            queryClient.invalidateQueries(DEFAULTS_MAPPING_QUERY_KEY),
        onError: (error) => showErrorAnnouncer(t("updateMappingError"), error),
    });

    const { mutate: createMapping } = useMutation(createDefaultsMapping, {
        onSuccess: () =>
            queryClient.invalidateQueries(DEFAULTS_MAPPING_QUERY_KEY),
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
    }, [defaultsMapping]);

    const handleSubmit = (values, { resetForm }) => {
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
            return createMapping(m).then((_) => resetForm(initialValues));
        }
        return updateMapping(m).then((_) => resetForm(initialValues));
    };

    const isLoading =
        defaultsMapping.isLoading ||
        instantlaunches.isLoading ||
        allQL.isLoading ||
        infoTypes.isLoading;

    const isError =
        defaultsMapping.isError ||
        instantlaunches.isError ||
        allQL.isError ||
        infoTypes.isError;

    return (
        <div>
            {isLoading ? (
                <Skeleton
                    variant="rectangular"
                    animation="wave"
                    height={300}
                    width="100%"
                    id={buildID(baseID, ids.SKELETON)}
                />
            ) : isError ? (
                <WrappedErrorHandler
                    errorObject={
                        defaultsMapping.error ||
                        instantlaunches.error ||
                        allQL.error ||
                        infoTypes.error
                    }
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
                        infoTypes={infoTypes.data.types}
                        t={t}
                    />

                    <Typography
                        variant="h6"
                        className={`${classes.sectionTitle} ${classes.text}`}
                    >
                        {t("displayMapping")}
                    </Typography>

                    <TableContainer>
                        <Table id={buildID(baseID, ids.TABLE)}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("common:name")}</TableCell>
                                    <TableCell>{t("patternKind")}</TableCell>
                                    <TableCell>{t("pattern")}</TableCell>
                                    <TableCell>{t("savedLaunch")}</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {defaultsMapping?.data?.mapping &&
                                    Object.entries(
                                        defaultsMapping.data.mapping
                                    ).map(([name, patternObj], index) => {
                                        const rowID = buildID(
                                            baseID,
                                            ids.TABLE,
                                            ids.ROW,
                                            index
                                        );
                                        const foundQL = allQL.data.find(
                                            (ql) =>
                                                ql.id ===
                                                patternObj.default
                                                    .quick_launch_id
                                        );
                                        const qlLabel =
                                            foundQL?.name ||
                                            patternObj.default.quick_launch_id;
                                        return (
                                            <TableRow key={index} id={rowID}>
                                                <TableCell>{name}</TableCell>

                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.PATTERN,
                                                        ids.KIND
                                                    )}
                                                >
                                                    {patternObj.kind}
                                                </TableCell>

                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.PATTERN
                                                    )}
                                                >
                                                    {patternObj.pattern}
                                                </TableCell>

                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.PATTERN,
                                                        ids.NAME
                                                    )}
                                                >
                                                    {qlLabel}
                                                </TableCell>

                                                <TableCell
                                                    id={buildID(
                                                        rowID,
                                                        ids.DELETE
                                                    )}
                                                >
                                                    <IconButton
                                                        id={buildID(
                                                            rowID,
                                                            ids.DELETE,
                                                            ids.BUTTON
                                                        )}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            event.preventDefault();

                                                            deleteEntry(name);
                                                        }}
                                                        size="large"
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
