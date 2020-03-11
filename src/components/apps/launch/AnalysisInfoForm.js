/**
 * @author psarando
 *
 * An App Launch form for collecting top-level analysis info,
 * such as analysis name, comments, and output folder.
 */
import React from "react";

import { FastField } from "formik";

import constants from "../../../constants";
import ids from "./ids";
import messages from "./messages";

import {
    build as buildDebugId,
    FormCheckbox,
    FormMultilineTextField,
    FormTextField,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

const AnalysisInfoForm = ({ formId, appType }) => (
    <>
        <FastField
            id={buildDebugId(
                formId,
                ids.LAUNCH_ANALYSIS_GROUP,
                ids.APP_LAUNCH_NAME
            )}
            label={getMessage("analysisName")}
            required={true}
            name="name"
            component={FormTextField}
            inputProps={{ maxLength: 255 }}
        />
        <FastField
            id={buildDebugId(
                formId,
                ids.LAUNCH_ANALYSIS_GROUP,
                ids.APP_LAUNCH_COMMENTS
            )}
            label={getMessage("comments")}
            name="description"
            component={FormMultilineTextField}
        />
        <FastField
            id={buildDebugId(
                formId,
                ids.LAUNCH_ANALYSIS_GROUP,
                ids.APP_LAUNCH_OUTPUT_FOLDER
            )}
            label={getMessage("outputFolder")}
            required={true}
            name="output_dir"
            component={FormTextField}
        />
        {appType !== constants.APP_TYPE_EXTERNAL && (
            <FastField
                id={buildDebugId(
                    formId,
                    ids.LAUNCH_ANALYSIS_GROUP,
                    ids.APP_LAUNCH_RETAIN_INPUTS
                )}
                label={getMessage("retainInputsLabel")}
                name="debug"
                component={FormCheckbox}
            />
        )}
    </>
);

export default withI18N(AnalysisInfoForm, messages);
