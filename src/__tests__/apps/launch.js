import React from "react";
import TestRenderer from "react-test-renderer";

import { mockAxios } from "../../../stories/axiosMock";

import { DEWordCount } from "../../../stories/apps/launch/DEWordCount.stories";
import { AgaveWordCount } from "../../../stories/apps/launch/AgaveWordCount.stories";
import { DeprecatedParams } from "../../../stories/apps/launch/DeprecatedParamsApp.stories";
import { FlagParams } from "../../../stories/apps/launch/FlagParams.stories";
import { InputParams } from "../../../stories/apps/launch/InputParams.stories";
import { JupyterLabNoParams } from "../../../stories/apps/launch/JupyterLabNoParams.stories";
import { NumberParams } from "../../../stories/apps/launch/NumberParams.stories";
import { OutputParams } from "../../../stories/apps/launch/OutputParams.stories";
import { Pipeline } from "../../../stories/apps/launch/Pipeline.stories";
import { ReferenceGenomeParams } from "../../../stories/apps/launch/ReferenceGenomeParams.stories";
import { SelectParams } from "../../../stories/apps/launch/SelectParams.stories";
import { TextParams } from "../../../stories/apps/launch/TextParams.stories";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("App Launch DEWordCount renders", () => {
    const component = TestRenderer.create(<DEWordCount />);
    component.unmount();
});

test("App Launch AgaveWordCount renders", () => {
    const component = TestRenderer.create(<AgaveWordCount />);
    component.unmount();
});

test("App Launch DeprecatedParams renders", () => {
    const component = TestRenderer.create(<DeprecatedParams />);
    component.unmount();
});

test("App Launch FlagParams renders", () => {
    const component = TestRenderer.create(<FlagParams />);
    component.unmount();
});

test("App Launch InputParams renders", () => {
    const component = TestRenderer.create(<InputParams />);
    component.unmount();
});

test("App Launch JupyterLabNoParams renders", () => {
    const component = TestRenderer.create(<JupyterLabNoParams />);
    component.unmount();
});

test("App Launch NumberParams renders", () => {
    const component = TestRenderer.create(<NumberParams />);
    component.unmount();
});

test("App Launch OutputParams renders", () => {
    const component = TestRenderer.create(<OutputParams />);
    component.unmount();
});

test("App Launch Pipeline renders", () => {
    const component = TestRenderer.create(<Pipeline />);
    component.unmount();
});

test("App Launch ReferenceGenomeParams renders", () => {
    const component = TestRenderer.create(<ReferenceGenomeParams />);
    component.unmount();
});

test("App Launch SelectParams renders", () => {
    const component = TestRenderer.create(<SelectParams />);
    component.unmount();
});

test("App Launch TextParams renders", () => {
    const component = TestRenderer.create(<TextParams />);
    component.unmount();
});
