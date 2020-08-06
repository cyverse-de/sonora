import React, { useEffect } from "react";
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
addDecorator((storyFn) => (
    <ThemeProvider theme={theme}>
        <UserProfileProvider>
            <ReactQueryConfigProvider config={queryConfig}>
                <I18nProviderWrapper>
                    <MockUserProfile />
                    {storyFn()}
                    <CyVerseAnnouncer />
                </I18nProviderWrapper>
            </ReactQueryConfigProvider>
        </UserProfileProvider>
    </ThemeProvider>
));

//redirect console error / logs / warns to action logger
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

addParameters({ chromatic: { delay: AXIOS_DELAY + 500 } });

configure(require.context("../stories", true, /\.stories\.js$/), module);
