import React from "react";

import { render } from "@testing-library/react";

import { I18nProviderWrapper } from "__mocks__/i18nProviderWrapper";

import { ConfigProvider } from "../contexts/config";
import { BootstrapInfoProvider } from "../contexts/bootstrap";
import { UserProfileProvider } from "../contexts/userProfile";
import { RQWrapper } from "../__mocks__/RQWrapper";

import {
    MetadataView,
    ReadOnlyMetadata,
    DataCiteMetadataView,
    EmptyMetadata,
} from "../../stories/metadata/MetadataForm.stories";

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

test("MetadataView renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <MetadataView />
        </TestProviderWrapper>
    );
    unmount();
});

test("ReadOnlyMetadata renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <ReadOnlyMetadata />
        </TestProviderWrapper>
    );
    unmount();
});

test("DataCiteMetadataView renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <DataCiteMetadataView />
        </TestProviderWrapper>
    );
    unmount();
});

test("EmptyMetadata renders", () => {
    const { unmount } = render(
        <TestProviderWrapper>
            <EmptyMetadata />
        </TestProviderWrapper>
    );
    unmount();
});
