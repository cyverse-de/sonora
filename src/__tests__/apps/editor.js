import React from "react";
import TestRenderer from "react-test-renderer";
import { RQWrapper } from "../../__mocks__/RQWrapper";
import { mockAxios } from "../../../stories/axiosMock";
import {
    NewApp,
    KitchenSinkEditor,
} from "../../../stories/apps/Editor.stories";

import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";

beforeEach(() => {
    mockAxios.reset();
});

afterEach(() => {
    mockAxios.reset();
});

test("New App renders", () => {
    const component = TestRenderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <NewApp />
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});

test("Kitchen Sink Editor renders", () => {
    const component = TestRenderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <KitchenSinkEditor />
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
