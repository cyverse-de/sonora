/**
 * @author sriram
 *
 * A view that helps users to automatically create a path list file using regex pattern and/or infotypes as filter
 *
 */
import React, { useEffect, useState } from "react";
import { queryCache, useQuery } from "react-query";
import { Field, Form, Formik, FastField } from "formik";
import { useTranslation } from "i18n";
import { useMutation } from "react-query";

import { FormTextField } from "@cyverse-de/ui-lib";

import { validateDiskResourceName } from "./utils";
import {
    getInfoTypes,
    pathListCreator,
    INFO_TYPES_QUERY_KEY,
} from "serviceFacades/filesystem";
import ResourceTypes from "components/models/ResourceTypes";
import InputSelector from "components/apps/launch/InputSelector";
import MultiInputSelector from "components/apps/launch/MultiInputSelector";

import {
    Button,
    Checkbox,
    Grid,
    Paper,
    FormControlLabel,
    Switch,
    List,
    Typography,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";

export default function PathListAutomation(props) {
    const [foldersOnly, setFoldersOnly] = useState(false);
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

    const [createPathListFile] = useMutation(pathListCreator, {
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

    const validate = ({ fileName }) => {
        const validationError = validateDiskResourceName(fileName, t);
        return validationError ? { fileName: validationError } : {};
    };

    const handlePathListCreation = ({
        multiInputSelector,
        pattern,
        path,
        fileName,
    }) => {
        console.log(
            multiInputSelector +
                "" +
                path +
                " " +
                fileName +
                " " +
                pattern +
                " " +
                foldersOnly +
                " " +
                selectedInfoTypes
        );
        //createPathListFile({});
    };

    return (
        <Formik
            enableReinitialize
            validate={validate}
            onSubmit={handlePathListCreation}
        >
            {({ handleSubmit, validateForm }) => {
                return (
                    <Form>
                        <Grid container spacing={1} direction="column">
                            <Grid item xs>
                                <Field
                                    id={"multi-input-selector"}
                                    name="multiInputSelector"
                                    required={true}
                                    label={"Select file(s) / folder(s)"}
                                    component={MultiInputSelector}
                                    helperText={""}
                                />
                            </Grid>
                            <Grid item xs>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={foldersOnly}
                                            onChange={(event) => {
                                                setFoldersOnly(
                                                    event.target.checked
                                                );
                                            }}
                                            name="foldersOnly"
                                            color="primary"
                                        />
                                    }
                                    label="Include only folder path(s) in my analysis path list file"
                                />
                            </Grid>
                            <Grid item xs>
                                <Field
                                    id={"pattern"}
                                    name="pattern"
                                    label={
                                        " Include only paths when file / folder name matches this pattern"
                                    }
                                    component={FormTextField}
                                    placeholder="e.g: \.csv$"
                                    variant="outlined"
                                    fullWidth
                                    dense
                                    helperText={""}
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
                        </Grid>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs>
                                <FastField
                                    label={
                                        "where should the path list file will be saved?"
                                    }
                                    required={true}
                                    name="path"
                                    component={FormTextField}
                                />
                            </Grid>
                            <Grid item xs>
                                <Button variant="outlined">Save As</Button>
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
