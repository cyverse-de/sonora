import React from "react";
import { render } from "@testing-library/react";
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
    const { unmount } = render(
        <RQWrapper>
            <I18nProviderWrapper>
                <NewApp />
            </I18nProviderWrapper>
        </RQWrapper>
    );
    unmount();
});

test("Kitchen Sink Editor renders", () => {
    const { unmount } = render(
        <RQWrapper>
            <I18nProviderWrapper>
                <KitchenSinkEditor />
            </I18nProviderWrapper>
        </RQWrapper>
    );
    unmount();
});
