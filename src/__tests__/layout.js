import React from "react";
import preloadAll from "jest-next-dynamic";
import renderer from "react-test-renderer";
import { NormalView } from "../../stories/AppBar.stories";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { ConfigProvider } from "../contexts/config";
import { BootstrapInfoProvider } from "contexts/bootstrap";
import { RQWrapper } from "../__mocks__/RQWrapper";
import { BagInfoProvider } from "../contexts/bagInfo";
beforeAll(async () => {
    await preloadAll();
});

test("App Bar renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <I18nProviderWrapper>
                <BootstrapInfoProvider>
                    <ConfigProvider>
                        <BagInfoProvider>
                            <NormalView />
                        </BagInfoProvider>
                    </ConfigProvider>
                </BootstrapInfoProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
