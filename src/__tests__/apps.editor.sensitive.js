import {
    formatSubmission,
    getNewParam,
} from "components/apps/editor/formatters";

import AppParamTypes from "components/models/AppParamTypes";

import React from "react";
import TestRenderer from "react-test-renderer";
import { Formik, Form } from "formik";

jest.mock("i18n", () => ({
    useTranslation: () => ({ t: (key) => key }),
}));

const IsSensitiveField =
    require("components/apps/editor/params/common/IsSensitiveField").default;

describe("apps editor sensitive EnvironmentVariable field", () => {
    test("getNewParam initializes is_sensitive to false for a new EnvironmentVariable param", () => {
        const param = getNewParam(AppParamTypes.ENV_VAR, "New Env Var", "key1");

        expect(param.is_sensitive).toBe(false);
    });

    test("formatSubmission preserves is_sensitive=true for an EnvironmentVariable param", () => {
        const submission = formatSubmission({
            groups: [
                {
                    id: "group1",
                    label: "Group",
                    isVisible: true,
                    parameters: [
                        {
                            id: "param1",
                            type: AppParamTypes.ENV_VAR,
                            name: "API_KEY",
                            label: "API Key",
                            description: "",
                            order: 0,
                            isVisible: true,
                            required: true,
                            omit_if_blank: false,
                            is_sensitive: true,
                            defaultValue: "",
                        },
                    ],
                },
            ],
            tools: [],
        });

        expect(submission.groups[0].parameters[0].is_sensitive).toBe(true);
    });

    test("formatSubmission preserves is_sensitive=false for a non-sensitive EnvironmentVariable param", () => {
        const submission = formatSubmission({
            groups: [
                {
                    id: "group1",
                    label: "Group",
                    isVisible: true,
                    parameters: [
                        {
                            id: "param1",
                            type: AppParamTypes.ENV_VAR,
                            name: "LOG_LEVEL",
                            label: "Log Level",
                            description: "",
                            order: 0,
                            isVisible: true,
                            required: false,
                            omit_if_blank: false,
                            is_sensitive: false,
                            defaultValue: "info",
                        },
                    ],
                },
            ],
            tools: [],
        });

        expect(submission.groups[0].parameters[0].is_sensitive).toBe(false);
    });
});

describe("IsSensitiveField tool type warning", () => {
    const renderField = (isSensitive, toolType) => {
        const component = TestRenderer.create(
            <Formik
                initialValues={{
                    tools: toolType ? [{ type: toolType }] : [],
                    param: { is_sensitive: isSensitive },
                }}
                onSubmit={() => {}}
            >
                <Form>
                    <IsSensitiveField baseId="test" fieldName="param" />
                </Form>
            </Formik>
        );
        const rendered = JSON.stringify(component.toJSON());
        component.unmount();
        return rendered;
    };

    test("shows the standard help text for a sensitive param with an interactive tool", () => {
        const rendered = renderField(true, "interactive");
        expect(rendered).toContain("app_editor_help:IsSensitive");
        expect(rendered).not.toContain("isSensitiveUnsupportedTool");
    });

    test("warns when a sensitive param is used with a non-interactive tool", () => {
        const rendered = renderField(true, "executable");
        expect(rendered).toContain("isSensitiveUnsupportedTool");
    });

    test("does not warn for an unchecked param or before a tool is selected", () => {
        expect(renderField(false, "executable")).not.toContain(
            "isSensitiveUnsupportedTool"
        );
        expect(renderField(true, undefined)).not.toContain(
            "isSensitiveUnsupportedTool"
        );
    });
});
