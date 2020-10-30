import React, { useEffect } from "react";
import { CyVerseAnnouncer } from "@cyverse-de/ui-lib";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../src/components/theme/default";
import { AXIOS_DELAY } from "../stories/axiosMock";
import {
    UserProfileProvider,
    useUserProfile,
} from "../src/contexts/userProfile";
import { PreferencesProvider } from "../src/contexts/userPreferences";
import { ReactQueryConfigProvider } from "react-query";
import { I18nProviderWrapper } from "../src/i18n";

function MockUserProfile() {
    const [userProfile, setUserProfile] = useUserProfile();
    useEffect(() => {
        if (!userProfile) {
            setUserProfile({
                id: "ipcdev",
                attributes: {
                    email: "ipcdev@cyverse.org",
                    entitlement: ["some-entitlement"],
                    firstName: "Iplant",
                    lastName: "Dev",
                    name: "Iplant Dev",
                },
            });
        }
    }, [setUserProfile, userProfile]);

    return <div />;
}

const queryConfig = {
    queries: { refetchOnWindowFocus: false, retry: false },
};

export const decorators = [
    (Story) => (
        <ThemeProvider theme={theme}>
            <UserProfileProvider>
                <ReactQueryConfigProvider config={queryConfig}>
                    <I18nProviderWrapper>
                        <MockUserProfile />
                        <PreferencesProvider>
                            {Story()}
                            <CyVerseAnnouncer />
                        </PreferencesProvider>
                    </I18nProviderWrapper>
                </ReactQueryConfigProvider>
            </UserProfileProvider>
        </ThemeProvider>
    ),
];
export const parameters = {
    chromatic: { delay: AXIOS_DELAY + 500 },
};
