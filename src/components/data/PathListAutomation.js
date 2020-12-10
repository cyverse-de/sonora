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

import {
    build as buildId,
    FormTextField,
    FormSwitch,
} from "@cyverse-de/ui-lib";

import SaveAsField from "./SaveAsField";
import ids from "./ids";
import { validateDiskResourceName } from "./utils";
import ResourceTypes from "components/models/ResourceTypes";
import InputSelector from "components/apps/launch/InputSelector";

import {
    getInfoTypes,
    pathListCreator,
    INFO_TYPES_QUERY_KEY,
} from "serviceFacades/filesystem";
import MultiInputSelector from "components/apps/launch/MultiInputSelector";
import ExternalLink from "components/utils/ExternalLink";
import ErrorTypographyWithDialog from "components/utils/error/ErrorTypographyWithDialog";
import constants from "../../constants";
import { ERROR_CODES, getErrorCode } from "../utils/error/errorCode";

import {
    Button,
    Checkbox,
    CircularProgress,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from "@material-ui/core";

import Skeleton from "@material-ui/lab/Skeleton";

export default function PathListAutomation(props) {
    const {
        baseId,
        requestedInfoType,
        onCreatePathList,
        onCancel,
        startingPath,
    } = props;

    const theme = useTheme();

    const [infoTypes, setInfoTypes] = useState([]);
    const [selectedInfoTypes, setSelectedInfoTypes] = useState([]);
    const [infoTypesQueryEnabled, setInfoTypesQueryEnabled] = useState(false);
    const [createPathListError, setCreatePathListError] = useState();
    const [errorMsg, setErrorMsg] = useState();
    const [infoTypeError, setInfoTypeError] = useState();

    const { t } = useTranslation("data");
    const { t: i18nCommon } = useTranslation("common");

    let infoTypesCache = queryCache.getQueryData(INFO_TYPES_QUERY_KEY);

    const { isFetching } = useQuery({
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
            onError: setInfoTypeError,
        },
    });

    const [createPathListFile, { status }] = useMutation(
        ({ submission }) => pathListCreator(submission),
        {
            onSuccess: (data) => {
                setCreatePathListError(null);
                onCreatePathList(data.file.id, data.file.path);
            },
            onError: (error, { onError }) => {
                let errMsg = null;
                const err_code = getErrorCode(error);
                switch (err_code) {
                    case ERROR_CODES.ERR_EXISTS:
                        errMsg = t("pathListExistError");
                        onError(err_code);
                        break;

                    case ERROR_CODES.ERR_NOT_FOUND:
                        errMsg = t("pathListNoMatchError");
                        onError();
                        break;

                    default:
                        errMsg = t("pathListCreateError");
                        onError();
                }
                setCreatePathListError(error);
                setErrorMsg(errMsg);
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
        const { selectedPaths, pattern, dest, fileName, foldersOnly } = values;

        const submission = {
            paths: selectedPaths,
            dest: `${dest}/${fileName}`,
            pattern,
            foldersOnly: foldersOnly || false,
            recursive: true,
            requestedInfoType,
            selectedInfoTypes,
        };

        const onError = (err_code) => {
            if (err_code === ERROR_CODES.ERR_EXISTS) {
                actions.setFieldError("dest", t("pathListExistError"));
            }
        };
        if (status !== constants.LOADING) {
            createPathListFile({
                submission,
                onError,
            });
        }
    };

    const validate = (values) => {
        const { selectedPaths, dest, fileName } = values;
        const errors = {};
        if (!selectedPaths || selectedPaths.length === 0) {
            errors.selectedPaths = i18nCommon("required");
        }

        if (!fileName) {
            errors.fileName = i18nCommon("required");
        } else {
            const invalidName = validateDiskResourceName(fileName, t);
            if (invalidName) {
                errors.fileName = invalidName;
            }
        }

        if (!dest) {
            errors.dest = i18nCommon("required");
        }
        return errors;
    };

    return (
        <Formik
            onSubmit={handlePathListCreation}
            validate={validate}
            initialValues={{
                selectedPaths: [],
                dest: startingPath,
                fileName: "",
                pattern: "",
                foldersOnly: false,
            }}
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
                            spacing={1}
                        >
                            {createPathListError && (
                                <Grid item xs>
                                    <ErrorTypographyWithDialog
                                        baseId={baseId}
                                        errorMessage={errorMsg}
                                        errorObject={createPathListError}
                                    />
                                </Grid>
                            )}
                            <Grid item xs>
                                <Typography variant="body2">
                                    {t("pathListInputLbl")}
                                </Typography>
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
                                    height="25vh"
                                    label={t("suggestionSelection_any_plural")}
                                />
                            </Grid>
                            <Grid item xs>
                                <Field
                                    id={buildId(
                                        baseId,
                                        ids.PATH_LIST_AUTO_FOLDERS_ONLY_SWITCH
                                    )}
                                    component={FormSwitch}
                                    name="foldersOnly"
                                    color="primary"
                                    label={
                                        <Typography variant="body2">
                                            {t("pathListFoldersOnlyLbl")}
                                        </Typography>
                                    }
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body2">
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
                                <Typography variant="body2">
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
                                        {isFetching && (
                                            <Skeleton
                                                variant="rect"
                                                height={150}
                                            />
                                        )}
                                        {!isFetching &&
                                            infoTypes &&
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
                                <Paper style={{ padding: theme.spacing(1) }}>
                                    <Field
                                        startingPath={startingPath}
                                        name="dest"
                                        id={buildId(
                                            baseId,
                                            ids.PATH_LIST_AUTO_DEST_FIELD
                                        )}
                                        acceptedType={ResourceTypes.FOLDER}
                                        label={t("pathListDestLbl")}
                                        component={InputSelector}
                                        required={true}
                                    />
                                    <Field
                                        id={buildId(
                                            baseId,

                                            ids.PATH_LIST_AUTO_FILE_NAME_FIELD
                                        )}
                                        name="fileName"
                                        required={true}
                                        label={t("fileName")}
                                        component={SaveAsField}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="flex-end"
                            spacing={1}
                        >
                            {createPathListError && (
                                <Grid item xs>
                                    <ErrorTypographyWithDialog
                                        baseId={baseId}
                                        errorMessage={errorMsg}
                                        errorObject={createPathListError}
                                    />
                                </Grid>
                            )}
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
