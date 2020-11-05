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
import { i18n } from "../src/i18n";
import { I18nextProvider } from "react-i18next";

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
                    <MockUserProfile />
                    <PreferencesProvider>
                        <React.Suspense fallback={"Loading i18n..."}>
                            <I18nextProvider i18n={i18n}>
                                {Story()}
                            </I18nextProvider>
                        </React.Suspense>
                        <CyVerseAnnouncer />
                    </PreferencesProvider>
                </ReactQueryConfigProvider>
            </UserProfileProvider>
        </ThemeProvider>
    ),
];
export const parameters = {
    chromatic: { delay: AXIOS_DELAY + 500 },
};
