import React, { useEffect } from "react";
import { withConsole } from "@storybook/addon-console";
import { addDecorator, configure } from "@storybook/react";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../src/components/theme/default";
import {
    UserProfileProvider,
    useUserProfile,
} from "../src/contexts/userProfile";

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
    }, [setUserProfile]);

    return <div />;
}

addDecorator((storyFn) => (
    <ThemeProvider theme={theme}>
        <UserProfileProvider>
            <MockUserProfile />
            {storyFn()}
        </UserProfileProvider>
    </ThemeProvider>
));

//redirect console error / logs / warns to action logger
addDecorator((storyFn, context) => withConsole()(storyFn)(context));

configure(require.context("../stories", true, /\.stories\.js$/), module);
