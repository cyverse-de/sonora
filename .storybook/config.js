import React, { useEffect, Suspense } from "react";
import { withConsole } from "@storybook/addon-console";
import { addDecorator, addParameters, configure } from "@storybook/react";
import { CyVerseAnnouncer } from "@cyverse-de/ui-lib";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../src/components/theme/default";
import { AXIOS_DELAY } from "../stories/axiosMock";
import {
    UserProfileProvider,
    useUserProfile,
} from "../src/contexts/userProfile";
import { ReactQueryConfigProvider } from "react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/test_i18n";

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
addDecorator((storyFn) => (
    <ThemeProvider theme={theme}>
        <UserProfileProvider>
            <ReactQueryConfigProvider config={queryConfig}>
                <MockUserProfile />
                {storyFn()}
                <CyVerseAnnouncer />
            </ReactQueryConfigProvider>
        </UserProfileProvider>
    </ThemeProvider>
));

//redirect console error / logs / warns to action logger
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

addDecorator((storyFn) => (
    <I18nextProvider i18n={i18n}>
        <Suspense fallback="Loading...">{storyFn()}</Suspense>
    </I18nextProvider>
));

addParameters({ chromatic: { delay: AXIOS_DELAY + 500 } });

configure(require.context("../stories", true, /\.stories\.js$/), module);
