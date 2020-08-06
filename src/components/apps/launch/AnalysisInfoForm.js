/**
 * @author psarando, sriram
 *
 * An App Launch form for collecting top-level analysis info,
 * such as analysis name, comments, and output folder.
 */
import React from "react";

import { FastField } from "formik";

import ResourceTypes from "../../models/ResourceTypes";

import ids from "./ids";
import messages from "./messages";

import InputSelector from "./InputSelector";

import {
    build as buildDebugId,
    FormMultilineTextField,
    FormTextField,
    getMessage,
    withI18N,
} from "@cyverse-de/ui-lib";

const AnalysisInfoForm = ({ formId, appType, startingPath }) => (
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
            size="small"
            helperText={getMessage("analysisNameHelp")}
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
            component={InputSelector}
            startingPath={startingPath}
            acceptedType={ResourceTypes.FOLDER}
        />
    </>
);

export default withI18N(AnalysisInfoForm, messages);
