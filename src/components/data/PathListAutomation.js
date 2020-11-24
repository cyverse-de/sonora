/**
 * @author sriram
 *
 * A view that helps users to automatically create a pathlist file using regex pattern and/or infotypes as filter
 *
 */
import React, { useEffect, useState } from "react";
import { queryCache, useQuery } from "react-query";
import { Field, Form, Formik, FastField } from "formik";

import { getInfoTypes, INFO_TYPES_QUERY_KEY } from "serviceFacades/filesystem";
import ResourceTypes from "components/models/ResourceTypes";
import InputSelector from "components/apps/launch/InputSelector";
import MultiInputSelector from "components/apps/launch/MultiInputSelector";

import {
    Checkbox,
    Grid,
    Paper,
    FormControlLabel,
    Switch,
    TextField,
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

    return (
        <Formik>
            {({ handleSubmit, validateForm }) => {
                return (
                    <Form>
                        <Paper style={{ padding: 8 }}>
                            <Grid container spacing={1} direction="column">
                                <Grid item xs>
                                    <Field
                                        id={"multi-input-selector"}
                                        name="name"
                                        required={true}
                                        label={"Select file(s) / folder(S)"}
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
                                    <Typography>
                                        Include only file / folder path(s) when
                                        file / folder name matches this:
                                    </Typography>
                                    <TextField
                                        placeholder="e.g: \.csv$"
                                        variant="outlined"
                                        fullWidth
                                        dense
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Typography>
                                        Include only file path(s) whose
                                        infoType(s) match:
                                    </Typography>
                                    <List
                                        style={{
                                            maxHeight: 300,
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
                                </Grid>
                                <Grid item xs>
                                    <FastField
                                        label={
                                            "Select a destination where the path list file will be saved"
                                        }
                                        required={true}
                                        name="output_dir"
                                        component={InputSelector}
                                        acceptedType={ResourceTypes.FOLDER}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Typography>
                                        Enter a file name to use to save this
                                        file:
                                    </Typography>
                                    <TextField
                                        placeholder="file name"
                                        variant="outlined"
                                        fullWidth
                                        dense
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Form>
                );
            }}
        </Formik>
    );
}
