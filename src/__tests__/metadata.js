import React from "react";

import renderer from "react-test-renderer";

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
    const component = renderer.create(
        <TestProviderWrapper>
            <MetadataView />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("ReadOnlyMetadata renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <ReadOnlyMetadata />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("DataCiteMetadataView renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <DataCiteMetadataView />
        </TestProviderWrapper>
    );
    component.unmount();
});

test("EmptyMetadata renders", () => {
    const component = renderer.create(
        <TestProviderWrapper>
            <EmptyMetadata />
        </TestProviderWrapper>
    );
    component.unmount();
});
