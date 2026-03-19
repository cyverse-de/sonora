import React from "react";
import TestRenderer from "react-test-renderer";

import { initAppLaunchValues } from "components/apps/launch/formatters";
import validate from "components/apps/launch/validate";

import { mockAxios } from "../../../stories/axiosMock";

import { DEWordCount } from "../../../stories/apps/launch/DEWordCount";
import { TapisWordCount } from "../../../stories/apps/launch/TapisWordCount";
import { DeprecatedParams } from "../../../stories/apps/launch/DeprecatedParamsApp";
import { FlagParams } from "../../../stories/apps/launch/FlagParams";
import { InputParams } from "../../../stories/apps/launch/InputParams";
import { JupyterLabNoParams } from "../../../stories/apps/launch/JupyterLabNoParams";
import { NumberParams } from "../../../stories/apps/launch/NumberParams";
import { OutputParams } from "../../../stories/apps/launch/OutputParams";
import { Pipeline } from "../../../stories/apps/launch/Pipeline";
import { ReferenceGenomeParams } from "../../../stories/apps/launch/ReferenceGenomeParams";
import { SelectParams } from "../../../stories/apps/launch/SelectParams";
import { TextParams } from "../../../stories/apps/launch/TextParams";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { BootstrapInfoProvider } from "contexts/bootstrap";
import { ConfigProvider } from "contexts/config";
import { UserProfileProvider } from "contexts/userProfile";
import { RQWrapper } from "../../__mocks__/RQWrapper";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

const TestProviderWrapper = ({ children }) => (
    <RQWrapper>
        <I18nProviderWrapper>
            <ConfigProvider>
                <UserProfileProvider>
                    <BootstrapInfoProvider>{children}</BootstrapInfoProvider>
                </UserProfileProvider>
            </ConfigProvider>
        </I18nProviderWrapper>
    </RQWrapper>
);

test("App Launch DEWordCount renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <DEWordCount />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch TapisWordCount renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <TapisWordCount />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch DeprecatedParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <DeprecatedParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch FlagParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <FlagParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch InputParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <InputParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch JupyterLabNoParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <JupyterLabNoParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch NumberParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <NumberParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch OutputParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <OutputParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch Pipeline renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <Pipeline />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch ReferenceGenomeParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <ReferenceGenomeParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch SelectParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <SelectParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("App Launch TextParams renders", () => {
    const component = TestRenderer.create(
        <TestProviderWrapper>
            <TextParams />
        </TestProviderWrapper>
    );
    component.unmount();
});

// --- GPU-related unit tests for initAppLaunchValues and validate ---

// Simple translation stub: returns the key (optionally with interpolations)
const t = (key) => key;

// Helper to build a minimal appDescription for initAppLaunchValues
const makeAppDesc = (requirements, groups = []) => ({
    notify: false,
    notifyPeriodic: false,
    periodicPeriod: 0,
    defaultOutputDir: "/iplant/home/testuser/analyses",
    app: {
        id: "app-id",
        version_id: "version-id",
        system_id: "de",
        name: "TestApp",
        requirements,
        groups,
    },
});

// --- initAppLaunchValues GPU tests ---

describe("initAppLaunchValues GPU fields", () => {
    test("first launch uses gpu_models as default_gpu_models", () => {
        const desc = makeAppDesc([
            {
                step_number: 0,
                max_cpu_cores: 4,
                gpu_models: ["Tesla V100", "A100"],
            },
        ]);
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].gpu_models).toEqual([
            "Tesla V100",
            "A100",
        ]);
    });

    test("relaunch uses default_gpu_models over gpu_models", () => {
        const desc = makeAppDesc([
            {
                step_number: 0,
                max_cpu_cores: 4,
                gpu_models: ["Tesla V100", "A100"],
                default_gpu_models: ["A100"],
            },
        ]);
        const result = initAppLaunchValues(t, desc);
        // default_gpu_models takes precedence via destructuring default
        expect(result.requirements[0].gpu_models).toEqual(["A100"]);
    });

    test("no gpu_models and no default_gpu_models defaults to empty array", () => {
        const desc = makeAppDesc([
            {
                step_number: 0,
                max_cpu_cores: 4,
            },
        ]);
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].gpu_models).toEqual([]);
    });

    test("default_gpus maps to max_gpus in output", () => {
        const desc = makeAppDesc([
            {
                step_number: 0,
                max_cpu_cores: 4,
                default_gpus: 2,
            },
        ]);
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].max_gpus).toBe(2);
    });

    test("no GPU fields at all defaults to max_gpus 0 and gpu_models []", () => {
        const desc = makeAppDesc([
            {
                step_number: 0,
                max_cpu_cores: 2,
            },
        ]);
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].max_gpus).toBe(0);
        expect(result.requirements[0].gpu_models).toEqual([]);
    });
});

// --- validate GPU tests ---

describe("validate GPU min/max requirements", () => {
    // validate(t, hasParams) returns a validation function
    const validator = validate(t, true);

    // Helper to build minimal form values with given requirements
    const makeValues = (reqs) => ({
        name: "test_analysis",
        output_dir: "/iplant/home/testuser/analyses",
        requirements: reqs,
        groups: [],
    });

    test("min_gpus > max_gpus produces error", () => {
        const errors = validator(makeValues([{ min_gpus: 4, max_gpus: 2 }]));
        expect(errors.requirements).toBeDefined();
        expect(errors.requirements[0].max_gpus).toBeTruthy();
    });

    test("min_gpus == max_gpus produces no GPU error", () => {
        const errors = validator(makeValues([{ min_gpus: 2, max_gpus: 2 }]));
        // No requirements errors at all, or no max_gpus error
        const gpuErr = errors.requirements?.[0]?.max_gpus;
        expect(gpuErr).toBeFalsy();
    });

    test("min_gpus = 0 skips GPU validation (falsy guard)", () => {
        const errors = validator(makeValues([{ min_gpus: 0, max_gpus: 2 }]));
        const gpuErr = errors.requirements?.[0]?.max_gpus;
        expect(gpuErr).toBeFalsy();
    });

    test("max_gpus = 0 skips GPU validation (falsy guard)", () => {
        const errors = validator(makeValues([{ min_gpus: 4, max_gpus: 0 }]));
        const gpuErr = errors.requirements?.[0]?.max_gpus;
        expect(gpuErr).toBeFalsy();
    });

    test("both min_gpus and max_gpus undefined skips GPU validation", () => {
        const errors = validator(makeValues([{}]));
        const gpuErr = errors.requirements?.[0]?.max_gpus;
        expect(gpuErr).toBeFalsy();
    });
});
