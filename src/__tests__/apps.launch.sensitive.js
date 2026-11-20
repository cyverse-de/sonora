import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Formik, Form, FastField } from "formik";

import Text from "components/apps/launch/params/Text";

jest.mock("i18n", () => ({
    useTranslation: () => ({ t: (key) => key }),
    Trans: ({ children }) => children || null,
}));

const { ParamsReview } = require("components/apps/launch/ParamGroups");
const { formatSubmission } = require("components/apps/launch/formatters");
const {
    appUnavailable,
    hasSensitiveParams,
    sensitiveParamsUnsupported,
} = require("components/apps/utils");

describe("sensitive EnvironmentVariable launch rendering", () => {
    test("Text renders a password-masked input when param.is_sensitive is true", () => {
        const param = {
            label: "API Key",
            description: "",
            required: true,
            is_sensitive: true,
        };

        const component = TestRenderer.create(
            <Formik initialValues={{ value: "" }} onSubmit={() => {}}>
                <Form>
                    <FastField name="value" component={Text} param={param} />
                </Form>
            </Formik>
        );

        const input = component.root.findByType("input");
        expect(input.props.type).toBe("password");
        expect(input.props.autoComplete).toBe("new-password");
        component.unmount();
    });

    test("Text renders a plain text input when param.is_sensitive is false", () => {
        const param = {
            label: "Log Level",
            description: "",
            required: false,
            is_sensitive: false,
        };

        const component = TestRenderer.create(
            <Formik initialValues={{ value: "" }} onSubmit={() => {}}>
                <Form>
                    <FastField name="value" component={Text} param={param} />
                </Form>
            </Formik>
        );

        const input = component.root.findByType("input");
        expect(input.props.type).toBe("text");
        expect(input.props.autoComplete).toBeUndefined();
        component.unmount();
    });

    test("ParamsReview masks the value of a sensitive parameter", () => {
        const groups = [
            {
                label: "Group",
                parameters: [
                    {
                        id: "param1",
                        type: "EnvironmentVariable",
                        label: "API Key",
                        isVisible: true,
                        is_sensitive: true,
                        value: "super-secret-value",
                    },
                ],
            },
        ];

        let component;
        act(() => {
            component = TestRenderer.create(
                <ParamsReview
                    baseId="review"
                    errors={{}}
                    groups={groups}
                    showAll={true}
                    setShowAll={() => {}}
                />
            );
        });

        const rendered = JSON.stringify(component.toJSON());
        expect(rendered).not.toContain("super-secret-value");
        expect(rendered).toContain(
            "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
        );
        component.unmount();
    });
});

describe("sensitive parameter launch submission", () => {
    const formValues = {
        name: "analysis",
        output_dir: "/iplant/home/ipcdev/analyses",
        requirements: [],
        groups: [
            {
                parameters: [
                    {
                        id: "step_secret",
                        type: "EnvironmentVariable",
                        is_sensitive: true,
                        value: "super-secret-value",
                    },
                    {
                        id: "step_plain",
                        type: "EnvironmentVariable",
                        is_sensitive: false,
                        value: "info",
                    },
                ],
            },
        ],
    };

    test("formatSubmission includes sensitive values by default (for launching)", () => {
        const submission = formatSubmission("/default", formValues);

        expect(submission.config).toEqual({
            step_secret: "super-secret-value",
            step_plain: "info",
        });
    });

    test("formatSubmission omits sensitive values when omitSensitive is set (for saved launches)", () => {
        const submission = formatSubmission("/default", formValues, {
            omitSensitive: true,
        });

        expect(submission.config).toEqual({ step_plain: "info" });
        expect(JSON.stringify(submission)).not.toContain("super-secret-value");
    });
});

describe("sensitive parameters are only launchable in VICE apps", () => {
    const sensitiveGroups = [
        { parameters: [{ id: "p1", is_sensitive: true }] },
    ];
    const plainGroups = [
        { parameters: [{ id: "p1", is_sensitive: false }, { id: "p2" }] },
    ];

    test("hasSensitiveParams", () => {
        expect(hasSensitiveParams(sensitiveGroups)).toBe(true);
        expect(hasSensitiveParams(plainGroups)).toBe(false);
        expect(hasSensitiveParams([{ label: "no params" }])).toBe(false);
        expect(hasSensitiveParams(undefined)).toBe(false);
    });

    test("sensitiveParamsUnsupported", () => {
        expect(sensitiveParamsUnsupported("interactive", sensitiveGroups)).toBe(
            false
        );
        expect(sensitiveParamsUnsupported("executable", sensitiveGroups)).toBe(
            true
        );
        expect(sensitiveParamsUnsupported("osg", sensitiveGroups)).toBe(true);
        expect(sensitiveParamsUnsupported(undefined, sensitiveGroups)).toBe(
            true
        );
        expect(sensitiveParamsUnsupported("executable", plainGroups)).toBe(
            false
        );
    });

    test("appUnavailable rejects non-VICE apps with sensitive params", () => {
        expect(
            appUnavailable({
                overall_job_type: "executable",
                groups: sensitiveGroups,
            })
        ).toBeTruthy();
        expect(
            appUnavailable({
                overall_job_type: "interactive",
                groups: sensitiveGroups,
            })
        ).toBeFalsy();
        expect(
            appUnavailable({
                overall_job_type: "executable",
                groups: plainGroups,
            })
        ).toBeFalsy();
    });
});
