import React from "react";

import renderer from "react-test-renderer";

import { I18nProviderWrapper } from "../i18n";

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
        <RQWrapper>
            <TestProviderWrapper>
                <MetadataView />
            </TestProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});

test("ReadOnlyMetadata renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <TestProviderWrapper>
                <ReadOnlyMetadata />
            </TestProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});

test("DataCiteMetadataView renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <TestProviderWrapper>
                <DataCiteMetadataView />
            </TestProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});

test("EmptyMetadata renders", () => {
    const component = renderer.create(
        <RQWrapper>
            <TestProviderWrapper>
                <EmptyMetadata />
            </TestProviderWrapper>
        </RQWrapper>
    );
    component.unmount();
});
