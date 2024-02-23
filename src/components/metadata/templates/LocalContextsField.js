/**
 * This custom metadata template field displays only a Local Contexts Hub
 * project URL field, and auto-populates DataCite metadata and child AVUs using
 * the project ID parsed from the URL and the Local Contexts Hub API response.
 *
 * @author psarando
 */
import React from "react";

import { useQuery } from "react-query";

import { useTranslation } from "i18n";

import LocalContextsLabelDisplay from "../LocalContextsLabelDisplay";

import ErrorTypographyWithDialog from "components/error/ErrorTypographyWithDialog";
import getFormError from "components/forms/getFormError";
import {
    LocalContextsAttrs,
    parseProjectID,
} from "components/models/metadata/LocalContexts";

import {
    LOCAL_CONTEXTS_QUERY_KEY,
    getLocalContextsProject,
} from "serviceFacades/metadata";

import { Skeleton, TextField } from "@mui/material";

const findAVU = (avus, attr) => avus?.find((avu) => avu.attr === attr);

const LocalContextsField = ({
    avu,
    onUpdate,
    helperText,
    form: { setFieldValue, ...form },
    field: { value, onChange, ...field },
    ...props
}) => {
    const { t } = useTranslation("localcontexts");

    const [rightsURIAVU, setRightsURIAVU] = React.useState(
        () =>
            findAVU(avu.avus, LocalContextsAttrs.RIGHTS_URI) || {
                attr: LocalContextsAttrs.RIGHTS_URI,
                value: "",
                unit: "",
            }
    );

    const [projectHubURI, setProjectHubURI] = React.useState(
        rightsURIAVU.value
    );

    const [projectHubError, setProjectHubError] = React.useState();

    const [rightsIDSchemeURIAVU] = React.useState(() => {
        let rightsIDScheme = findAVU(
            avu.avus,
            LocalContextsAttrs.RIGHTS_ID_SCHEME
        );

        if (
            rightsIDScheme?.value !== LocalContextsAttrs.RIGHTS_ID_SCHEME_VALUE
        ) {
            rightsIDScheme = {
                attr: LocalContextsAttrs.RIGHTS_ID_SCHEME,
                value: LocalContextsAttrs.RIGHTS_ID_SCHEME_VALUE,
                unit: "",
            };
        }

        return rightsIDScheme;
    });

    const [schemeURIAVU] = React.useState(() => {
        let schemeURI = findAVU(avu.avus, LocalContextsAttrs.SCHEME_URI);

        if (schemeURI?.value !== LocalContextsAttrs.SCHEME_URI_VALUE) {
            schemeURI = {
                attr: LocalContextsAttrs.SCHEME_URI,
                value: LocalContextsAttrs.SCHEME_URI_VALUE,
                unit: "",
            };
        }

        return schemeURI;
    });

    const projectID = parseProjectID(projectHubURI);

    const { data: project, isFetching } = useQuery({
        queryKey: [LOCAL_CONTEXTS_QUERY_KEY, projectID],
        queryFn: () =>
            getLocalContextsProject({
                projectID,
            }),
        enabled: URL.canParse(projectHubURI),
        onSuccess: (project) => {
            let newValue = avu.value || "";

            const projectLabels = [
                ...(project?.notice?.filter((label) => label?.name) || []),
                ...(project?.bc_labels?.filter((label) => label?.name) || []),
                ...(project?.tk_labels?.filter((label) => label?.name) || []),
            ];

            if (projectLabels.length === 1) {
                newValue =
                    projectLabels[0].label_text ||
                    projectLabels[0].default_text;
            } else {
                newValue = t("localContextsAttrDefaultValue", {
                    projectTitle: project?.title,
                    projectPage: project?.project_page,
                });
            }

            const newLabels = projectLabels.map((label) => label.name);

            let newAVUs = avu.avus || [];

            const currentLabels = newAVUs
                .filter(
                    (childAVU) => childAVU.attr === LocalContextsAttrs.RIGHTS_ID
                )
                ?.map((childAVU) => childAVU.value);

            const missingLabels = newLabels.filter(
                (label) => !currentLabels.includes(label)
            );

            const extraLabels = currentLabels.filter(
                (label) => !newLabels.includes(label)
            );

            const requiresUpdate =
                avu.value !== newValue ||
                missingLabels.length > 0 ||
                extraLabels.length > 0;

            if (requiresUpdate) {
                newAVUs = newAVUs.filter(
                    (childAVU) =>
                        childAVU.attr !== LocalContextsAttrs.RIGHTS_URI &&
                        childAVU.attr !== LocalContextsAttrs.RIGHTS_ID_SCHEME &&
                        childAVU.attr !== LocalContextsAttrs.SCHEME_URI &&
                        (childAVU.attr !== LocalContextsAttrs.RIGHTS_ID ||
                            newLabels.includes(childAVU.value))
                );

                newAVUs = [
                    ...newAVUs,
                    rightsURIAVU,
                    schemeURIAVU,
                    rightsIDSchemeURIAVU,
                    ...missingLabels.map((label) => ({
                        attr: LocalContextsAttrs.RIGHTS_ID,
                        value: label,
                        unit: "",
                    })),
                ];

                onUpdate({ ...avu, value: newValue, avus: newAVUs });
            }
        },
        onError: (error) => {
            setProjectHubError(
                <ErrorTypographyWithDialog
                    errorMessage={t("localContextsHubError")}
                    errorObject={error}
                />
            );
        },
    });

    const updateProjectHubURI = (uri) => {
        setProjectHubURI(uri);
        setProjectHubError(null);

        let newAVUs = avu.avus || [];

        if (rightsURIAVU.value !== uri) {
            const newRightsURIAVU = {
                attr: LocalContextsAttrs.RIGHTS_URI,
                value: uri,
                unit: "",
            };
            setRightsURIAVU(newRightsURIAVU);

            newAVUs = newAVUs.filter(
                (childAVU) =>
                    childAVU.attr !== LocalContextsAttrs.RIGHTS_URI &&
                    childAVU.attr !== LocalContextsAttrs.RIGHTS_ID_SCHEME &&
                    childAVU.attr !== LocalContextsAttrs.SCHEME_URI
            );

            newAVUs = [
                ...newAVUs,
                newRightsURIAVU,
                schemeURIAVU,
                rightsIDSchemeURIAVU,
            ];

            onUpdate({ ...avu, avus: newAVUs });
        }
    };

    const { touched, errors } = form;
    const errorMsg =
        getFormError(field.name, touched, errors) || projectHubError;

    return (
        <>
            <TextField
                error={!!errorMsg}
                helperText={errorMsg || helperText}
                variant="outlined"
                margin="dense"
                size="small"
                fullWidth
                placeholder="https://localcontextshub.org/projects/adcbca87-081a-4e2c-b6af-bff12fe3b7b0/"
                {...field}
                {...props}
                label={t("localContextsHubProjectURI")}
                required
                value={projectHubURI}
                onChange={(event) => updateProjectHubURI(event?.target?.value)}
            />
            {isFetching ? (
                <Skeleton variant="rectangular">
                    <LocalContextsLabelDisplay project={project} />
                </Skeleton>
            ) : (
                <LocalContextsLabelDisplay project={project} />
            )}
        </>
    );
};

export default LocalContextsField;
