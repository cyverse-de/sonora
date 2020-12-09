import React from "react";

import { useTranslation } from "i18n";

import ids from "../ids";
import SimpleExpansionPanel from "../SimpleExpansionPanel";
import { nonEmptyField } from "./Validations";

import { build, FormTextField, getFormError } from "@cyverse-de/ui-lib";
import { Field } from "formik";

function ContainerImage(props) {
    const {
        isOSGTool,
        parentId,
        field: { name },
        form: { errors, touched },
    } = props;
    const { t } = useTranslation("tools");

    let hasErrors = !!getFormError(name, touched, errors);
    return (
        <SimpleExpansionPanel
            header={t("containerImage")}
            parentId={build(parentId, ids.EDIT_TOOL_DLG.CONTAINER_IMAGE)}
            hasErrors={hasErrors}
        >
            <Field
                name={`${name}.name`}
                label={t("imageName")}
                id={build(parentId, ids.EDIT_TOOL_DLG.IMAGE_NAME)}
                required
                validate={nonEmptyField}
                component={FormTextField}
                helperText={t("imageNameHelp")}
            />
            <Field
                name={`${name}.url`}
                label={t("dockerHubURL")}
                id={build(parentId, ids.EDIT_TOOL_DLG.DOCKER_URL)}
                component={FormTextField}
            />
            <Field
                name={`${name}.tag`}
                label={t("tag")}
                id={build(parentId, ids.EDIT_TOOL_DLG.TAG)}
                required
                validate={nonEmptyField}
                component={FormTextField}
            />
            {isOSGTool && (
                <Field
                    name={`${name}.osg_image_path`}
                    label={t("osgImagePath")}
                    required
                    validate={(value) => isOSGTool && nonEmptyField(value)}
                    id={build(parentId, ids.EDIT_TOOL_DLG.OSG_IMAGE_PATH)}
                    component={FormTextField}
                />
            )}
        </SimpleExpansionPanel>
    );
}

export default ContainerImage;
