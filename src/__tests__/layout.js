import React from "react";
import { render } from "@testing-library/react";
import { NormalView } from "../../stories/AppBar.stories";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { ConfigProvider } from "../contexts/config";
import { BootstrapInfoProvider } from "contexts/bootstrap";
import { RQWrapper } from "../__mocks__/RQWrapper";
import { BagInfoProvider } from "../contexts/bagInfo";
test("App Bar renders", () => {
    const { unmount } = render(
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
    unmount();
});
