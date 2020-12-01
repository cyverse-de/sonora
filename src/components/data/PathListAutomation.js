/**
 * @author sriram
 *
 * A view that helps users to automatically create a path list file using regex pattern and/or info-types as filter
 *
 */
import React, { useEffect, useState } from "react";
import { queryCache, useQuery } from "react-query";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "i18n";
import { useMutation } from "react-query";

import { FormTextField } from "@cyverse-de/ui-lib";

import SaveAsField from "./SaveAsField";

import { validateDiskResourceName, parseNameFromPath } from "./utils";
import {
    getInfoTypes,
    pathListCreator,
    INFO_TYPES_QUERY_KEY,
} from "serviceFacades/filesystem";

import MultiInputSelector from "components/apps/launch/MultiInputSelector";
import constants from "../../constants";
import {
    Button,
    Checkbox,
    CircularProgress,
    Grid,
    Paper,
    Switch,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
    grid: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
            margin: theme.spacing(0.1),
        },
    },
});

const useStyles = makeStyles(styles);

export default function PathListAutomation(props) {
    const { requestedInfoType } = props;
    const classes = useStyles();

    const [infoTypes, setInfoTypes] = useState([]);
    const [selectedInfoTypes, setSelectedInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    useQuery({
        queryKey: INFO_TYPES_QUERY_KEY,
        queryFn: getInfoTypes,
        config: {
            enabled: infoTypesQueryEnabled,
            onSuccess: (resp) => setInfoTypes(resp.types),
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                console.log("unable to get info type=>" + e);
            },
        },
    });

    const [createPathListFile, { status }] = useMutation(pathListCreator, {
        onSuccess: (data, { resetForm }) => {
            console.log("created pathlist");
        },
        onError: (error) => {
            console.log("error creating file");
        },
    });

    useEffect(() => {
        if (!infoTypesCache || infoTypesCache.length === 0) {
            setInfoTypesQueryEnabled(true);
        } else {
            if (infoTypes === null || infoTypes.length === 0) {
                setInfoTypes(infoTypesCache.types);
            }
        }
    }, [infoTypes, infoTypesCache]);

    const handleToggle = (value) => () => {
        const currentIndex = selectedInfoTypes.indexOf(value);
        const newChecked = [...selectedInfoTypes];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedInfoTypes(newChecked);
    };

    const handlePathListCreation = (values, actions) => {
        const { selectedPaths, pattern, dest, foldersOnly } = values;
        actions.setSubmitting(true);
        console.log(
            selectedPaths +
                "" +
                dest +
                " " +
                pattern +
                " " +
                foldersOnly +
                " " +
                selectedInfoTypes
        );
        createPathListFile({
            paths: selectedPaths,
            dest,
            pattern,
            foldersOnly,
            recursive: true,
            requestedInfoType,
            selectedInfoTypes,
        });
    };

    const onSwitchChange = (setFieldValue, fieldName) => (event, checked) => {
        setFieldValue(fieldName, checked);
    };

    const FormSwitch = ({
        field: { value, onChange, ...field },
        form: { setFieldValue },
        ...custom
    }) => (
        <Switch
            checked={!!value}
            onChange={onSwitchChange(setFieldValue, field.name)}
            {...custom}
        />
    );

    const validate = (values) => {
        const { selectedPaths, dest } = values;
        const errors = {};
        if (!selectedPaths || selectedPaths.length === 0) {
            errors.selectedPaths = "Required";
        }

        if (!dest) {
            errors.dest = "Required";
        }
        return errors;
    };

    return (
        <Formik
            onSubmit={handlePathListCreation}
            validate={validate}
            initialValues={{ selectedPaths: [], dest: "" }}
        >
            {({ handleSubmit }) => {
                return (
                    <Form>
                        {status === constants.LOADING && (
                            <CircularProgress
                                size={30}
                                thickness={5}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                }}
                            />
                        )}

                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="stretch"
                            spacing={3}
                        >
                            <Grid item xs>
                                <Typography>
                                    Select folder(s) whose contents will be
                                    processed into the path list file contents.
                                    Individual file(s) may also be selected.
                                </Typography>
                                <Field
                                    id={"multi-input-selector"}
                                    name="selectedPaths"
                                    required={true}
                                    component={MultiInputSelector}
                                    height="30vh"
                                    label={"Select file(s) / folder(s)"}
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography>
                                    Include only folder path(s) in my analysis
                                    path list file:
                                </Typography>
                                <Field
                                    component={FormSwitch}
                                    name="foldersOnly"
                                    color="primary"
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography>
                                    Include only paths when file / folder name
                                    matches this pattern:
                                </Typography>

                                <Field
                                    id={"pattern"}
                                    name="pattern"
                                    component={FormTextField}
                                    placeholder="e.g: \.csv$"
                                    variant="outlined"
                                    dense
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography>
                                    Include only file path(s) whose infoType(s)
                                    match:
                                </Typography>
                                <Paper>
                                    <List
                                        style={{
                                            maxHeight: 150,
                                            overflow: "auto",
                                        }}
                                    >
                                        {infoTypes &&
                                            infoTypes.length > 0 &&
                                            infoTypes.map((type) => {
                                                const labelId = `checkbox-list-label-${type}`;
                                                return (
                                                    <ListItem
                                                        key={type}
                                                        dense
                                                        button
                                                        onClick={handleToggle(
                                                            type
                                                        )}
                                                    >
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={
                                                                    selectedInfoTypes.indexOf(
                                                                        type
                                                                    ) !== -1
                                                                }
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{
                                                                    "aria-labelledby": labelId,
                                                                }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            id={labelId}
                                                            primary={type}
                                                        />
                                                    </ListItem>
                                                );
                                            })}
                                    </List>
                                </Paper>
                            </Grid>
                            <Grid item xs>
                                <Typography>
                                    Select a destination where the path list
                                    file will be saved:
                                </Typography>
                                <Field
                                    id={"save-as"}
                                    name="dest"
                                    required={true}
                                    component={SaveAsField}
                                    label={"Select 'Save as' button to pick file destination"}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-end"
                        >
                            <Grid item>
                                <Button
                                    onClick={() => console.log("cancelled")}
                                >
                                    {i18nCommon("cancel")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    color="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    {i18nCommon("save")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
}
