import React from "react";
import TestRenderer from "react-test-renderer";

import { buildGpuLimitList } from "components/apps/launch/ResourceRequirements";
import {
    buildDurationLimitList,
    formatDuration,
    formatSubmission,
    initAppLaunchValues,
    shouldShowPreset,
} from "components/apps/launch/formatters";
import validate from "components/apps/launch/validate";

import constants from "../../constants";

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

// --- validate resource requirements tests ---
// Validation checks user-chosen max_cpu_cores / max_gpus / min_memory_limit
// against the tool-provided minimums and maximums from values.limits
// (not the form-level min_cpu_cores / min_gpus, which are submission fields
// overwritten at submit time by formatSubmission).

describe("validate resource requirements against tool limits", () => {
    // defaultMaxCPUCores=8, defaultMaxMemory=16 GiB
    const validator = validate(t, true, undefined, 8, 16 * constants.ONE_GiB);

    const makeValues = (reqs, limits) => ({
        name: "test_analysis",
        output_dir: "/iplant/home/testuser/analyses",
        requirements: reqs,
        limits,
        groups: [],
    });

    // --- lower-bound checks ---

    test("max_cpu_cores below tool min_cpu_cores produces error", () => {
        const errors = validator(
            makeValues(
                [{ max_cpu_cores: 1, max_gpus: 0 }],
                [{ min_cpu_cores: 2 }]
            )
        );
        expect(errors.requirements).toBeDefined();
        expect(errors.requirements[0].max_cpu_cores).toBeTruthy();
    });

    test("max_cpu_cores at tool min_cpu_cores produces no error", () => {
        const errors = validator(
            makeValues(
                [{ max_cpu_cores: 2, max_gpus: 0 }],
                [{ min_cpu_cores: 2 }]
            )
        );
        const cpuErr = errors.requirements?.[0]?.max_cpu_cores;
        expect(cpuErr).toBeFalsy();
    });

    test("max_gpus below tool min_gpus produces error", () => {
        const errors = validator(
            makeValues(
                [{ max_cpu_cores: 4, max_gpus: 1 }],
                [{ min_gpus: 2, max_gpus: 4 }]
            )
        );
        expect(errors.requirements).toBeDefined();
        expect(errors.requirements[0].max_gpus).toBeTruthy();
    });

    test("max_gpus at tool min_gpus produces no error", () => {
        const errors = validator(
            makeValues(
                [{ max_cpu_cores: 4, max_gpus: 2 }],
                [{ min_gpus: 2, max_gpus: 4 }]
            )
        );
        const gpuErr = errors.requirements?.[0]?.max_gpus;
        expect(gpuErr).toBeFalsy();
    });

    // --- upper-bound checks ---

    test("max_cpu_cores above ceiling produces error", () => {
        const errors = validator(
            makeValues(
                [{ max_cpu_cores: 16, max_gpus: 0 }],
                [{ max_cpu_cores: 4 }]
            )
        );
        expect(errors.requirements).toBeDefined();
        expect(errors.requirements[0].max_cpu_cores).toBeTruthy();
    });

    test("max_cpu_cores at ceiling produces no error", () => {
        const errors = validator(
            makeValues(
                [{ max_cpu_cores: 4, max_gpus: 0 }],
                [{ max_cpu_cores: 4 }]
            )
        );
        const cpuErr = errors.requirements?.[0]?.max_cpu_cores;
        expect(cpuErr).toBeFalsy();
    });

    test("max_cpu_cores above config default (no tool limit) produces error", () => {
        const errors = validator(
            makeValues([{ max_cpu_cores: 16, max_gpus: 0 }], [{}])
        );
        expect(errors.requirements).toBeDefined();
        expect(errors.requirements[0].max_cpu_cores).toBeTruthy();
    });

    test("min_memory_limit above ceiling produces error", () => {
        const errors = validator(
            makeValues(
                [
                    {
                        max_cpu_cores: 4,
                        min_memory_limit: 32 * constants.ONE_GiB,
                    },
                ],
                [{ memory_limit: 8 * constants.ONE_GiB }]
            )
        );
        expect(errors.requirements).toBeDefined();
        expect(errors.requirements[0].min_memory_limit).toBeTruthy();
    });

    test("min_memory_limit at ceiling produces no error", () => {
        const errors = validator(
            makeValues(
                [{ max_cpu_cores: 4, min_memory_limit: 8 * constants.ONE_GiB }],
                [{ memory_limit: 8 * constants.ONE_GiB }]
            )
        );
        const memErr = errors.requirements?.[0]?.min_memory_limit;
        expect(memErr).toBeFalsy();
    });

    test("max_gpus above tool max_gpus produces error", () => {
        const errors = validator(
            makeValues([{ max_cpu_cores: 4, max_gpus: 4 }], [{ max_gpus: 2 }])
        );
        expect(errors.requirements).toBeDefined();
        expect(errors.requirements[0].max_gpus).toBeTruthy();
    });

    test("max_gpus at tool max_gpus produces no error", () => {
        const errors = validator(
            makeValues([{ max_cpu_cores: 4, max_gpus: 2 }], [{ max_gpus: 2 }])
        );
        const gpuErr = errors.requirements?.[0]?.max_gpus;
        expect(gpuErr).toBeFalsy();
    });

    // --- edge cases ---

    test("no tool limits produces no error", () => {
        const errors = validator(
            makeValues([{ max_cpu_cores: 1, max_gpus: 0 }], [{}])
        );
        expect(errors.requirements).toBeUndefined();
    });

    test("no limits array produces no error", () => {
        const errors = validator(
            makeValues([{ max_cpu_cores: 1, max_gpus: 0 }], undefined)
        );
        expect(errors.requirements).toBeUndefined();
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
        min_memory_limit: 8 * constants.ONE_GiB,
        max_gpus: 0,
        time_limit_seconds: 7200,
        is_default: true,
        is_enabled: true,
    };

    const gpuPreset = {
        id: "preset-gpu",
        label: "GPU",
        max_cpu_cores: 4,
        min_memory_limit: 16 * constants.ONE_GiB,
        max_gpus: 1,
        time_limit_seconds: null,
        is_default: false,
        is_enabled: true,
    };

    test("applies default preset to compatible step", () => {
        const desc = makePresetAppDesc(
            [
                {
                    step_number: 0,
                    max_cpu_cores: 8,
                    memory_limit: 32 * constants.ONE_GiB,
                },
            ],
            [smallPreset, gpuPreset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBe("preset-small");
        expect(result.requirements[0].max_cpu_cores).toBe(2);
        expect(result.requirements[0].min_memory_limit).toBe(
            8 * constants.ONE_GiB
        );
        expect(result.requirements[0].max_gpus).toBe(0);
    });

    test.each([
        {
            name: "CPU: step ceiling below preset",
            preset: { ...smallPreset, max_cpu_cores: 4 },
            step: {
                step_number: 0,
                max_cpu_cores: 1,
                memory_limit: 34 * constants.ONE_GiB,
            },
            configOverrides: {},
            field: "max_cpu_cores",
            expected: 1,
        },
        {
            name: "Memory: step ceiling below preset",
            preset: smallPreset,
            step: {
                step_number: 0,
                max_cpu_cores: 8,
                memory_limit: 4 * constants.ONE_GiB,
            },
            configOverrides: {},
            field: "min_memory_limit",
            expected: 4 * constants.ONE_GiB,
        },
        {
            name: "Memory: no step ceiling and no config → preset value used",
            preset: smallPreset,
            step: { step_number: 0, max_cpu_cores: 8 },
            configOverrides: {},
            field: "min_memory_limit",
            expected: 8 * constants.ONE_GiB,
        },
        {
            name: "CPU: config default clamps when no step ceiling",
            preset: { ...smallPreset, max_cpu_cores: 12 },
            step: { step_number: 0 },
            configOverrides: { defaultMaxCPUCores: 8 },
            field: "max_cpu_cores",
            expected: 8,
        },
        {
            name: "Memory: config default clamps when no step ceiling",
            preset: {
                ...smallPreset,
                min_memory_limit: 32 * constants.ONE_GiB,
            },
            step: { step_number: 0 },
            configOverrides: { defaultMaxMemory: 16 * constants.ONE_GiB },
            field: "min_memory_limit",
            expected: 16 * constants.ONE_GiB,
        },
        {
            name: "CPU: step ceiling wins over config defaults",
            preset: { ...smallPreset, max_cpu_cores: 6 },
            step: { step_number: 0, max_cpu_cores: 3 },
            configOverrides: {
                defaultMaxCPUCores: 8,
                defaultSelectedMaxCpus: 4,
            },
            field: "max_cpu_cores",
            expected: 3,
        },
    ])(
        "fresh launch clamping: $name",
        ({ preset, step, configOverrides, field, expected }) => {
            const desc = {
                ...makePresetAppDesc([step], [preset]),
                ...configOverrides,
            };
            const result = initAppLaunchValues(t, desc);
            expect(result.requirements[0][field]).toBe(expected);
        }
    );

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
            min_memory_limit: 16 * constants.ONE_GiB,
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
                    memory_limit: 32 * constants.ONE_GiB,
                    default_cpu_cores: 2,
                    default_memory: 16 * constants.ONE_GiB,
                    default_gpus: 0,
                },
            ],
            [preset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBe("preset-medium");
        // Values should be the saved values (relaunch), not the preset's raw values
        expect(result.requirements[0].max_cpu_cores).toBe(2);
        expect(result.requirements[0].min_memory_limit).toBe(
            16 * constants.ONE_GiB
        );
    });

    test("relaunch: no matching preset falls back to Custom", () => {
        const preset = {
            id: "preset-small",
            label: "Small",
            max_cpu_cores: 2,
            min_memory_limit: 8 * constants.ONE_GiB,
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
                    default_memory: 8 * constants.ONE_GiB,
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
            min_memory_limit: 32 * constants.ONE_GiB,
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
                    memory_limit: 64 * constants.ONE_GiB,
                    default_cpu_cores: 2,
                    default_memory: 8 * constants.ONE_GiB,
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
        expect(result.requirements[0].min_memory_limit).toBe(
            8 * constants.ONE_GiB
        );
    });

    test("relaunch: uses defaultMaxCPUCores (not defaultSelectedMaxCpus) for clamping", () => {
        // Preset CPU (6) is between defaultSelectedMaxCpus (4) and
        // defaultMaxCPUCores (8). effectivePresetValues must clamp against
        // defaultMaxCPUCores so the result matches applyPresetValues.
        const preset = {
            id: "preset-6cpu",
            label: "6-CPU",
            max_cpu_cores: 6,
            min_memory_limit: 16 * constants.ONE_GiB,
            max_gpus: 0,
            time_limit_seconds: null,
            is_default: true,
            is_enabled: true,
        };
        const desc = {
            ...makePresetAppDesc(
                [
                    {
                        step_number: 0,
                        default_cpu_cores: 6,
                        default_memory: 16 * constants.ONE_GiB,
                        default_gpus: 0,
                    },
                ],
                [preset]
            ),
            defaultSelectedMaxCpus: 4,
            defaultMaxCPUCores: 8,
        };
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBe("preset-6cpu");
        expect(result.requirements[0].max_cpu_cores).toBe(6);
    });

    test("relaunch: defaultMaxMemory clamps preset memory for matching", () => {
        const preset = {
            id: "preset-highmem",
            label: "HighMem",
            max_cpu_cores: 2,
            min_memory_limit: 32 * constants.ONE_GiB,
            max_gpus: 0,
            time_limit_seconds: null,
            is_default: true,
            is_enabled: true,
        };
        const desc = {
            ...makePresetAppDesc(
                [
                    {
                        step_number: 0,
                        default_cpu_cores: 2,
                        default_memory: 16 * constants.ONE_GiB,
                        default_gpus: 0,
                    },
                ],
                [preset]
            ),
            defaultMaxMemory: 16 * constants.ONE_GiB,
        };
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBe(
            "preset-highmem"
        );
    });

    test("relaunch: matches preset with GPUs when step allows GPUs", () => {
        const preset = {
            id: "preset-gpu2",
            label: "GPU-2",
            max_cpu_cores: 4,
            min_memory_limit: 16 * constants.ONE_GiB,
            max_gpus: 2,
            time_limit_seconds: null,
            is_default: false,
            is_enabled: true,
        };
        // Step supports GPUs (max_gpus: 4), effective GPUs = min(2, 4) = 2.
        const desc = makePresetAppDesc(
            [
                {
                    step_number: 0,
                    max_cpu_cores: 8,
                    memory_limit: 32 * constants.ONE_GiB,
                    max_gpus: 4,
                    default_cpu_cores: 4,
                    default_memory: 16 * constants.ONE_GiB,
                    default_gpus: 2,
                },
            ],
            [preset]
        );
        const result = initAppLaunchValues(t, desc);
        expect(result.requirements[0].resource_preset_id).toBe("preset-gpu2");
        expect(result.requirements[0].max_gpus).toBe(2);
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
                    min_memory_limit: 8 * constants.ONE_GiB,
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
                    min_memory_limit: 16 * constants.ONE_GiB,
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

// --- shouldShowPreset filtering tests ---

describe("shouldShowPreset", () => {
    const basePreset = {
        id: "preset-base",
        label: "Base",
        max_cpu_cores: 4,
        min_memory_limit: 8 * constants.ONE_GiB,
        max_gpus: 0,
        time_limit_seconds: 7200,
        is_default: false,
        is_enabled: true,
    };

    test("hides GPU preset when app has no GPU support (max_gpus absent)", () => {
        const gpuPreset = { ...basePreset, max_gpus: 1 };
        const requirements = { step_number: 0, max_cpu_cores: 8 };
        expect(shouldShowPreset(gpuPreset, requirements, 8, null)).toBe(false);
    });

    test("hides GPU preset when app has max_gpus: 0", () => {
        const gpuPreset = { ...basePreset, max_gpus: 1 };
        const requirements = {
            step_number: 0,
            max_cpu_cores: 8,
            max_gpus: 0,
        };
        expect(shouldShowPreset(gpuPreset, requirements, 8, null)).toBe(false);
    });

    test("shows GPU preset when app supports GPUs", () => {
        const gpuPreset = { ...basePreset, max_gpus: 1 };
        const requirements = {
            step_number: 0,
            max_cpu_cores: 8,
            max_gpus: 2,
        };
        expect(shouldShowPreset(gpuPreset, requirements, 8, null)).toBe(true);
    });

    test("hides preset where both CPU and memory exceed the ceiling", () => {
        const largePreset = {
            ...basePreset,
            max_cpu_cores: 16,
            min_memory_limit: 64 * constants.ONE_GiB,
        };
        const requirements = { step_number: 0 };
        // Config ceiling: CPU=8, Memory=16 GiB. Preset exceeds both.
        expect(
            shouldShowPreset(
                largePreset,
                requirements,
                8,
                16 * constants.ONE_GiB
            )
        ).toBe(false);
    });

    test("shows preset where both CPU and memory equal the ceiling", () => {
        const exactPreset = {
            ...basePreset,
            max_cpu_cores: 8,
            min_memory_limit: 16 * constants.ONE_GiB,
        };
        const requirements = { step_number: 0 };
        // Preset CPU == ceiling, memory == ceiling — still a valid choice
        // (selects the maximum allowed values).
        expect(
            shouldShowPreset(
                exactPreset,
                requirements,
                8,
                16 * constants.ONE_GiB
            )
        ).toBe(true);
    });

    test("shows preset where only CPU exceeds ceiling (memory is below)", () => {
        const cpuHighPreset = {
            ...basePreset,
            max_cpu_cores: 16,
            min_memory_limit: 8 * constants.ONE_GiB,
        };
        const requirements = { step_number: 0 };
        expect(
            shouldShowPreset(
                cpuHighPreset,
                requirements,
                8,
                16 * constants.ONE_GiB
            )
        ).toBe(true);
    });

    test("shows preset where only memory exceeds ceiling (CPU is below)", () => {
        const memHighPreset = {
            ...basePreset,
            max_cpu_cores: 4,
            min_memory_limit: 64 * constants.ONE_GiB,
        };
        const requirements = { step_number: 0 };
        expect(
            shouldShowPreset(
                memHighPreset,
                requirements,
                8,
                16 * constants.ONE_GiB
            )
        ).toBe(true);
    });

    test("shows preset that fits within ceilings", () => {
        const smallPreset = {
            ...basePreset,
            max_cpu_cores: 2,
            min_memory_limit: 4 * constants.ONE_GiB,
        };
        const requirements = { step_number: 0 };
        expect(
            shouldShowPreset(
                smallPreset,
                requirements,
                8,
                16 * constants.ONE_GiB
            )
        ).toBe(true);
    });

    test("uses step max_cpu_cores as ceiling when present", () => {
        // Step has max_cpu_cores: 4, so a preset with 4 CPU hits the ceiling.
        // But memory is below the config ceiling, so it should be shown.
        const preset = {
            ...basePreset,
            max_cpu_cores: 4,
            min_memory_limit: 8 * constants.ONE_GiB,
        };
        const requirements = {
            step_number: 0,
            max_cpu_cores: 4,
            memory_limit: 32 * constants.ONE_GiB,
        };
        expect(shouldShowPreset(preset, requirements, 8, null)).toBe(true);
    });

    test("hides preset when step ceiling is lower and both dimensions hit it", () => {
        const preset = {
            ...basePreset,
            max_cpu_cores: 8,
            min_memory_limit: 16 * constants.ONE_GiB,
        };
        const requirements = {
            step_number: 0,
            max_cpu_cores: 4,
            memory_limit: 8 * constants.ONE_GiB,
        };
        expect(shouldShowPreset(preset, requirements, null, null)).toBe(false);
    });

    test("still applies base compatibility checks (min_gpus)", () => {
        // Preset has 0 GPUs but tool requires min 1
        const requirements = {
            step_number: 0,
            max_cpu_cores: 8,
            min_gpus: 1,
            max_gpus: 4,
        };
        expect(shouldShowPreset(basePreset, requirements, 8, null)).toBe(false);
    });
});
