import React from "react";

import { useTranslation } from "i18n";

import ids from "../ids";
import SimpleExpansionPanel from "components/utils/SimpleExpansionPanel";
import { nonEmptyField } from "components/utils/validations";

import buildID from "components/utils/DebugIDUtil";
import FormTextField from "components/forms/FormTextField";
import getFormError from "components/forms/getFormError";
import { Field } from "formik";

function ContainerImage(props) {
    const {
        isOSGTool,
        parentId,
        field: { name },
        form: { errors, touched },
    } = props;
    const { t } = useTranslation("tools");
    const { t: i18nUtil } = useTranslation("util");

    let hasErrors = !!getFormError(name, touched, errors);
    return (
        <SimpleExpansionPanel
            header={t("containerImage")}
            parentId={buildID(parentId, ids.EDIT_TOOL_DLG.CONTAINER_IMAGE)}
            hasErrors={hasErrors}
        >
            <Field
                name={`${name}.name`}
                label={t("imageName")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.IMAGE_NAME)}
                required
                validate={(value) => nonEmptyField(value, i18nUtil)}
                component={FormTextField}
                helperText={t("imageNameHelp")}
            />
            <Field
                name={`${name}.url`}
                label={t("dockerHubURL")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.DOCKER_URL)}
                component={FormTextField}
            />
            <Field
                name={`${name}.tag`}
                label={t("tag")}
                id={buildID(parentId, ids.EDIT_TOOL_DLG.TAG)}
                required
                validate={(value) => nonEmptyField(value, i18nUtil)}
                component={FormTextField}
            />
            {isOSGTool && (
                <Field
                    name={`${name}.osg_image_path`}
                    label={t("osgImagePath")}
                    required
                    validate={(value) => isOSGTool && nonEmptyField(value, t)}
                    id={buildID(parentId, ids.EDIT_TOOL_DLG.OSG_IMAGE_PATH)}
                    component={FormTextField}
                />
            )}
        </SimpleExpansionPanel>
    );
}

export default ContainerImage;
