import React from "react";
import { render } from "@testing-library/react";
import { SearchField } from "../../stories/search/GlobalSearchField.stories";
import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";
import { UserProfileProvider } from "../contexts/userProfile";
import { RQWrapper } from "../__mocks__/RQWrapper";
import { ConfigProvider } from "contexts/config";
import { ThemeProvider } from "@mui/material/styles";
import theme from "components/theme/default";

test("Search field renders", () => {
    const { unmount } = render(
        <RQWrapper>
            <I18nProviderWrapper>
                <UserProfileProvider>
                    <ConfigProvider>
                        <ThemeProvider theme={theme}>
                            <SearchField />
                        </ThemeProvider>
                    </ConfigProvider>
                </UserProfileProvider>
            </I18nProviderWrapper>
        </RQWrapper>
    );
    unmount();
});
