import React from "react";
import TestRenderer from "react-test-renderer";

import { buildGpuLimitList } from "components/apps/launch/ResourceRequirements";
import {
    buildDurationLimitList,
    formatDuration,
    formatSubmission,
    initAppLaunchValues,
} from "components/apps/launch/formatters";
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

describe("buildGpuLimitList", () => {
    test("includes 0 when min_gpus is 0", () => {
        expect(buildGpuLimitList(0, 8)).toEqual([0, 1, 2, 4, 8]);
    });

    test("excludes 0 when min_gpus is greater than 0", () => {
        expect(buildGpuLimitList(2, 8)).toEqual([2, 4, 8]);
    });

    test("uses min_gpus as only option when min_gpus is above max_gpus", () => {
        expect(buildGpuLimitList(3, 2)).toEqual([3]);
    });
});

// --- buildDurationLimitList unit tests ---

describe("buildDurationLimitList", () => {
    const SECONDS_PER_HOUR = 3600;
    const SECONDS_PER_DAY = 86400;
    const H = (n) => n * SECONDS_PER_HOUR;
    const D = (n) => n * SECONDS_PER_DAY;

    test("365 days max returns the full ladder without duplicates", () => {
        expect(buildDurationLimitList(D(365))).toEqual([
            H(1),
            H(2),
            H(4),
            H(8),
            H(12),
            D(1),
            D(2),
            D(3),
            D(4),
            D(7),
            D(14),
            D(30),
            D(60),
            D(90),
            D(180),
            D(365),
        ]);
    });

    test("7 days max truncates the ladder at 7 days without duplicating it", () => {
        expect(buildDurationLimitList(D(7))).toEqual([
            H(1),
            H(2),
            H(4),
            H(8),
            H(12),
            D(1),
            D(2),
            D(3),
            D(4),
            D(7),
        ]);
    });

    test("45 days max appends the exact max after the ladder", () => {
        expect(buildDurationLimitList(D(45))).toEqual([
            H(1),
            H(2),
            H(4),
            H(8),
            H(12),
            D(1),
            D(2),
            D(3),
            D(4),
            D(7),
            D(14),
            D(30),
            D(45),
        ]);
    });

    test("max below the smallest ladder value returns just the max", () => {
        expect(buildDurationLimitList(H(0.5))).toEqual([H(0.5)]);
    });
});

// --- formatDuration unit tests ---

describe("formatDuration", () => {
    test("1 hour", () => {
        expect(formatDuration(3600)).toBe("1 hour");
    });

    test("12 hours", () => {
        expect(formatDuration(43200)).toBe("12 hours");
    });

    test("1 day", () => {
        expect(formatDuration(86400)).toBe("1 day");
    });

    test("365 days", () => {
        expect(formatDuration(31536000)).toBe("365 days");
    });

    test("falsey input returns an empty string", () => {
        expect(formatDuration(0)).toBe("");
        expect(formatDuration(null)).toBe("");
    });
});

// --- Resource Preset unit tests ---

describe("initAppLaunchValues resource presets", () => {
    const makePresetAppDesc = (requirements, resourcePresets) => ({
        notify: false,
        notifyPeriodic: false,
        periodicPeriod: 0,
        defaultOutputDir: "/iplant/home/testuser/analyses",
        resourcePresets,
        app: {
            id: "app-id",
            version_id: "version-id",
            system_id: "de",
            name: "TestApp",
            requirements,
            groups: [],
        },
    });

    const smallPreset = {
        id: "preset-small",
        label: "Small",
        max_cpu_cores: 2,
        min_memory_limit: 8589934592, // 8 GiB
        max_gpus: 0,
        time_limit_seconds: 7200,
        is_default: true,
        is_enabled: true,
    };

    const gpuPreset = {
        id: "preset-gpu",
        label: "GPU",
        max_cpu_cores: 4,
        min_memory_limit: 17179869184, // 16 GiB
        max_gpus: 1,
        time_limit_seconds: null,
        is_default: false,
        is_enabled: true,
    };

    test("applies default preset to compatible step", () => {
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 8, memory_limit: 34359738368 }],
            [smallPreset, gpuPreset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBe("preset-small");
        expect(result.requirements[0].max_cpu_cores).toBe(2);
        expect(result.requirements[0].min_memory_limit).toBe(8589934592);
        expect(result.requirements[0].max_gpus).toBe(0);
    });

    test("clamps preset CPU to tool ceiling", () => {
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 1, memory_limit: 34359738368 }],
            [smallPreset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].max_cpu_cores).toBe(1);
    });

    test("clamps preset memory to tool ceiling", () => {
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 8, memory_limit: 4294967296 }], // 4 GiB ceiling
            [smallPreset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].min_memory_limit).toBe(4294967296);
    });

    test("does not clamp memory when tool has no memory_limit", () => {
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 8 }],
            [smallPreset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].min_memory_limit).toBe(8589934592);
    });

    test("does not apply incompatible preset (tool requires GPUs)", () => {
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 8, min_gpus: 1, max_gpus: 4 }],
            [smallPreset] // smallPreset has max_gpus: 0
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBeNull();
    });

    test("does not apply preset when it exceeds tool max_gpus", () => {
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 8, max_gpus: 0 }],
            [gpuPreset] // gpuPreset has max_gpus: 1
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBeNull();
    });

    test("sets time_limit_seconds from default preset when compatible", () => {
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 8 }],
            [smallPreset]
        );
        desc.app.max_time_limit_seconds = 86400;
        desc.app.overall_job_type = "interactive";
        const result = initAppLaunchValues(t, desc);
        expect(result.time_limit_seconds).toBe(7200);
    });

    test("clamps preset time_limit_seconds to max_time_limit_seconds", () => {
        const bigTimePreset = {
            ...smallPreset,
            time_limit_seconds: 172800, // 48 hours
        };
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 8 }],
            [bigTimePreset]
        );
        desc.app.max_time_limit_seconds = 86400; // 24 hours
        desc.app.overall_job_type = "interactive";
        const result = initAppLaunchValues(t, desc);
        expect(result.time_limit_seconds).toBe(86400);
    });

    test("no default preset falls back to empty time_limit_seconds", () => {
        const nonDefaultPreset = { ...smallPreset, is_default: false };
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 8 }],
            [nonDefaultPreset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBeNull();
        expect(result.time_limit_seconds).toBe("");
    });

    test("empty resourcePresets array produces null resource_preset_id", () => {
        const desc = makePresetAppDesc(
            [{ step_number: 0, max_cpu_cores: 4 }],
            []
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBeNull();
    });

    test("relaunch: matches saved values to a preset by effective values", () => {
        const preset = {
            id: "preset-medium",
            label: "Medium",
            max_cpu_cores: 4,
            min_memory_limit: 17179869184, // 16 GiB
            max_gpus: 0,
            time_limit_seconds: null,
            is_default: true,
            is_enabled: true,
        };
        // Relaunch: tool ceiling is 2 cores, so effective CPU for the preset
        // would be min(4, 2) = 2. The saved values match that effective output.
        const desc = makePresetAppDesc(
            [
                {
                    step_number: 0,
                    max_cpu_cores: 2,
                    memory_limit: 34359738368,
                    default_cpu_cores: 2,
                    default_memory: 17179869184,
                    default_gpus: 0,
                },
            ],
            [preset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBe("preset-medium");
        // Values should be the saved values (relaunch), not the preset's raw values
        expect(result.requirements[0].max_cpu_cores).toBe(2);
        expect(result.requirements[0].min_memory_limit).toBe(17179869184);
    });

    test("relaunch: no matching preset falls back to Custom", () => {
        const preset = {
            id: "preset-small",
            label: "Small",
            max_cpu_cores: 2,
            min_memory_limit: 8589934592, // 8 GiB
            max_gpus: 0,
            time_limit_seconds: null,
            is_default: true,
            is_enabled: true,
        };
        // Saved values don't match the preset (user used 3 cores custom)
        const desc = makePresetAppDesc(
            [
                {
                    step_number: 0,
                    max_cpu_cores: 8,
                    default_cpu_cores: 3,
                    default_memory: 8589934592,
                    default_gpus: 0,
                },
            ],
            [preset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBeNull();
        expect(result.requirements[0].max_cpu_cores).toBe(3);
    });

    test("relaunch: does not apply default preset over saved values", () => {
        const preset = {
            id: "preset-large",
            label: "Large",
            max_cpu_cores: 8,
            min_memory_limit: 34359738368, // 32 GiB
            max_gpus: 0,
            time_limit_seconds: null,
            is_default: true,
            is_enabled: true,
        };
        // Saved values are 2 cores / 8 GiB — don't match the Large preset
        const desc = makePresetAppDesc(
            [
                {
                    step_number: 0,
                    max_cpu_cores: 16,
                    memory_limit: 68719476736,
                    default_cpu_cores: 2,
                    default_memory: 8589934592,
                    default_gpus: 0,
                },
            ],
            [preset]
        );
        const result = initAppLaunchValues(t, desc);
        // Should NOT select the default preset since saved values don't match
        expect(result.requirements[0].resource_preset_id).toBeNull();
        // Should use the saved values
        expect(result.requirements[0].max_cpu_cores).toBe(2);
        expect(result.requirements[0].min_memory_limit).toBe(8589934592);
    });
});

describe("formatSubmission strips resource_preset_id", () => {
    test("resource_preset_id is not present in formatted requirements", () => {
        const values = {
            notify: false,
            notifyPeriodic: false,
            periodicPeriod: 0,
            debug: false,
            name: "test_analysis",
            description: "",
            output_dir: "/iplant/home/testuser/analyses",
            system_id: "de",
            app_id: "app-id",
            app_version_id: "version-id",
            mount_data_store: true,
            time_limit_seconds: 7200,
            requirements: [
                {
                    step_number: 0,
                    max_cpu_cores: 2,
                    min_memory_limit: 8589934592,
                    max_gpus: 0,
                    gpu_models: [],
                    resource_preset_id: "preset-small",
                },
            ],
            groups: [],
        };
        const result = formatSubmission(
            "/iplant/home/testuser/analyses",
            values
        );
        expect(result.requirements[0].resource_preset_id).toBeUndefined();
        expect(result.requirements[0].max_cpu_cores).toBe(2);
        expect(result.requirements[0].min_cpu_cores).toBe(2);
    });

    test("submission works with null resource_preset_id (custom mode)", () => {
        const values = {
            notify: false,
            notifyPeriodic: false,
            periodicPeriod: 0,
            debug: false,
            name: "test_analysis",
            description: "",
            output_dir: "/iplant/home/testuser/analyses",
            system_id: "de",
            app_id: "app-id",
            app_version_id: "version-id",
            mount_data_store: true,
            time_limit_seconds: "",
            requirements: [
                {
                    step_number: 0,
                    max_cpu_cores: 4,
                    min_memory_limit: 17179869184,
                    max_gpus: 1,
                    gpu_models: ["A100"],
                    resource_preset_id: null,
                },
            ],
            groups: [],
        };
        const result = formatSubmission(
            "/iplant/home/testuser/analyses",
            values
        );
        expect(result.requirements[0].resource_preset_id).toBeUndefined();
        expect(result.requirements[0].max_cpu_cores).toBe(4);
        expect(result.requirements[0].gpu_models).toEqual(["A100"]);
    });
});
