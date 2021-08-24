import React from "react";
import TestRenderer from "react-test-renderer";

import { mockAxios } from "../../../stories/axiosMock";
import {
    NewApp,
    KitchenSinkEditor,
} from "../../../stories/apps/Editor.stories";

import { I18nProviderWrapper } from "../../i18n";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("New App renders", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <NewApp />
        </I18nProviderWrapper>
    );
    component.unmount();
});

test("Kitchen Sink Editor renders", () => {
    const component = TestRenderer.create(
        <I18nProviderWrapper>
            <KitchenSinkEditor />
        </I18nProviderWrapper>
    );
    component.unmount();
});
