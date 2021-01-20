import React, { useEffect } from "react";

import { CyVerseAnnouncer } from "@cyverse-de/ui-lib";
import { ThemeProvider } from "@material-ui/core/styles";

import theme from "../src/components/theme/default";

import { AXIOS_DELAY } from "../stories/axiosMock";
import testConfig from "../stories/configMock";
import userProfileMock from "../stories/userProfileMock";
import MockBootstrap from "../stories/preferences/MockBootstrap";

import { ConfigProvider, useConfig } from "../src/contexts/config";
import {
    UserProfileProvider,
    useUserProfile,
} from "../src/contexts/userProfile";
import {
    BootstrapInfoProvider,
    useBootstrapInfo,
} from "../src/contexts/bootstrap";

import { ReactQueryConfigProvider } from "react-query";
import { i18n } from "../src/i18n";
import { I18nextProvider } from "react-i18next";

import { addDecorator } from "@storybook/react";
import { withConsole } from "@storybook/addon-console";
import { withNextRouter } from "storybook-addon-next-router";

function MockUserProfile() {
    const [userProfile, setUserProfile] = useUserProfile();
    useEffect(() => {
        if (!userProfile) {
            setUserProfile(userProfileMock);
        }
    }, [setUserProfile, userProfile]);

    return <div />;
}

function MockBootstrapInfo() {
    const setBootstrapInfo = useBootstrapInfo()[1];
    React.useEffect(() => {
        setBootstrapInfo(MockBootstrap);
    }, [setBootstrapInfo]);

    return <div />;
}

function MockConfig() {
    const setConfig = useConfig()[1];
    React.useEffect(() => {
        setConfig(testConfig);
    }, [setConfig]);

    return <div />;
}

const queryConfig = {
    queries: { refetchOnWindowFocus: false, retry: false },
};

addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(
    withNextRouter({
        path: "/", // defaults to `/`
        asPath: "/", // defaults to `/`
        query: {}, // defaults to `{}`
        push() {}, // defaults to using addon actions integration, can override any method in the router
    })
);

export const decorators = [
    (Story) => (
        <ThemeProvider theme={theme}>
            <ConfigProvider>
                <MockConfig />
                <UserProfileProvider>
                    <ReactQueryConfigProvider config={queryConfig}>
                        <MockUserProfile />
                        <BootstrapInfoProvider>
                            <MockBootstrapInfo />
                            <React.Suspense fallback={"Loading i18n..."}>
                                <I18nextProvider i18n={i18n}>
                                    {Story()}
                                </I18nextProvider>
                            </React.Suspense>
                            <CyVerseAnnouncer />
                        </BootstrapInfoProvider>
                    </ReactQueryConfigProvider>
                </UserProfileProvider>
            </ConfigProvider>
        </ThemeProvider>
    ),
];
export const parameters = {
    chromatic: { delay: AXIOS_DELAY + 500 },
};
