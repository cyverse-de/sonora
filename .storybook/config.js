import React, { useEffect } from "react";
import { withConsole } from "@storybook/addon-console";
import { addDecorator, configure } from "@storybook/react";
import { CyVerseAnnouncer } from "@cyverse-de/ui-lib";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../src/components/theme/default";
import {
    UserProfileProvider,
    useUserProfile,
} from "../src/contexts/userProfile";
import { ReactQueryConfigProvider } from "react-query";

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
    refetchOnWindowFocus: false,
    retry: false,
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

configure(require.context("../stories", true, /\.stories\.js$/), module);
