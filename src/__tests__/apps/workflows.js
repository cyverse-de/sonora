import React from "react";
import TestRenderer from "react-test-renderer";

import { mockAxios } from "../../../stories/axiosMock";
import {
    DeprecatedToolsPipeline,
    NewWorkflow,
    SimplePipeline,
} from "../../../stories/apps/Workflow.stories";

import { I18nProviderWrapper } from "../../i18n";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("New Workflow renders", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <NewWorkflow />
        </I18nProviderWrapper>
    );
    component.unmount();
});

test("Simple Pipeline renders", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <SimplePipeline />
        </I18nProviderWrapper>
    );
    component.unmount();
});

test("Deprecated Tools Pipeline renders", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <DeprecatedToolsPipeline />
        </I18nProviderWrapper>
    );
    component.unmount();
});
