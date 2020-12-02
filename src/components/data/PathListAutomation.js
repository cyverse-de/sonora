/**
 * @author sriram
 *
 * A view that helps users to automatically create a path list file using regex
 * pattern and/or info-types as filter
 *
 */
import React, { useEffect, useState } from "react";

import { queryCache, useQuery } from "react-query";
import { Field, Form, Formik } from "formik";
import { useTranslation } from "i18n";
import { Trans } from "react-i18next";
import { useMutation } from "react-query";

import { build as buildId, FormTextField } from "@cyverse-de/ui-lib";

import SaveAsField from "./SaveAsField";
import ids from "./ids";

import {
    getInfoTypes,
    pathListCreator,
    INFO_TYPES_QUERY_KEY,
} from "serviceFacades/filesystem";
import MultiInputSelector from "components/apps/launch/MultiInputSelector";
import ExternalLink from "components/utils/ExternalLink";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
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

export default function PathListAutomation(props) {
    const {
        baseId,
        requestedInfoType,
        onCreatePathList,
        onCancel,
        startingPath,
    } = props;

    const [infoTypes, setInfoTypes] = useState([]);
    const [selectedInfoTypes, setSelectedInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [createPathListError, setCreatePathListError] = useState();
    const [infoTypeError, setInfoTypeError] = useState();

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    useQuery({
        queryKey: INFO_TYPES_QUERY_KEY,
        queryFn: getInfoTypes,
        config: {
            enabled: infoTypesQueryEnabled,
            onSuccess: (resp) => {
                setInfoTypeError(null);
                setInfoTypes(resp.types);
            },
            staleTime: Infinity,
            cacheTime: Infinity,
            onError: (e) => {
                setInfoTypeError(e);
            },
        },
    });

    const [createPathListFile, { status }] = useMutation(
        ({ submission }) => pathListCreator(submission),
        {
            onSuccess: (data, { onSuccess }) => {
                onSuccess();
                setCreatePathListError(null);
                onCreatePathList(data.file.id, data.file.path);
            },
            onError: (error, { onError }) => {
                onError();
                setCreatePathListError(error);
            },
        }
    );

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

        const submission = {
            paths: selectedPaths,
            dest,
            pattern,
            foldersOnly: foldersOnly || false,
            recursive: true,
            requestedInfoType,
            selectedInfoTypes,
        };
        const onSuccess = () => {
            actions.setSubmitting(false);
        };
        const onError = () => {
            actions.setSubmitting(false);
        };
        createPathListFile({
            submission,
            onSuccess,
            onError,
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
                            {createPathListError && (
                                <Grid item xs>
                                    <ErrorTypographyWithDialog
                                        baseId={baseId}
                                        errorMessage={t("pathListCreateError")}
                                        errorObject={createPathListError}
                                    />
                                </Grid>
                            )}
                            <Grid item xs>
                                <Typography>{t("pathListInputLbl")}</Typography>
                                {infoTypeError && (
                                    <ErrorTypographyWithDialog
                                        baseId={baseId}
                                        errorMessage={t("infoTypeFetchError")}
                                        errorObject={infoTypeError}
                                    />
                                )}
                                <Field
                                    id={buildId(
                                        baseId,
                                        ids.PATH_LIST_AUTO_INPUTS
                                    )}
                                    name="selectedPaths"
                                    required={true}
                                    component={MultiInputSelector}
                                    height="30vh"
                                    label={t("suggestionSelection_any_plural")}
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography>
                                    {t("pathListFoldersOnlyLbl")}
                                </Typography>
                                <Field
                                    id={buildId(
                                        baseId,
                                        ids.PATH_LIST_AUTO_FOLDERS_ONLY_SWITCH
                                    )}
                                    component={FormSwitch}
                                    name="foldersOnly"
                                    color="primary"
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography>
                                    <Trans
                                        t={t}
                                        i18nKey="pathListPatternMatchLbl"
                                        components={{
                                            pattern: (
                                                <ExternalLink
                                                    href={
                                                        constants.JAVA_PATTERN_DOC
                                                    }
                                                />
                                            ),
                                        }}
                                    />
                                </Typography>

                                <Field
                                    id={buildId(
                                        baseId,
                                        ids.PATH_LIST_AUTO_MATCH_PATTERN
                                    )}
                                    name="pattern"
                                    component={FormTextField}
                                    placeholder="e.g: \.csv$"
                                    variant="outlined"
                                    dense
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography>
                                    {t("pathListInfoTypeLbl")}
                                </Typography>
                                <Paper>
                                    <List
                                        style={{
                                            maxHeight: 150,
                                            overflow: "auto",
                                        }}
                                        id={buildId(
                                            baseId,
                                            ids.PATH_LIST_AUTO_MATCH_INFO_TYPES
                                        )}
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
                                <Typography>{t("pathListDestLbl")}</Typography>
                                <Field
                                    id={buildId(
                                        baseId,
                                        ids.PATH_LIST_AUTO_DEST_FIELD
                                    )}
                                    name="dest"
                                    required={true}
                                    component={SaveAsField}
                                    label={t("pathListSaveLbl")}
                                    startingPath={startingPath}
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
                                    id={buildId(
                                        baseId,
                                        ids.PATH_LIST_AUTO_CANCEL_BTN
                                    )}
                                    onClick={onCancel}
                                >
                                    {i18nCommon("cancel")}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    id={buildId(
                                        baseId,
                                        ids.PATH_LIST_AUTO_DONE_BTN
                                    )}
                                    color="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    {i18nCommon("done")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                );
            }}
        </Formik>
    );
}
