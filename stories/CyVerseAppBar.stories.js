import React from "react";
import { UserProfileProvider } from "../src/contexts/userProfile";
import CyverseAppBar from "../src/components/layout/CyVerseAppBar";
import { mockAxios } from "./axiosMock";
import { NotificationsProvider } from "../src/contexts/pushNotifications";
import notificationsData from "../stories/notifications/notificationsData";
import testConfig from "./configMock";
import {
    FILE_TYPE,
    FOLDER_TYPE,
    ANALYSIS_TYPE,
    APP_TYPE,
} from "../src/components/Bag";

const mockUser = {
    id: "mockUser",
    attributes: {
        credentialType: "UsernamePasswordCredential",
        email: "mockuser@example.org",
        entitlement: ["foo", "bar", "baz"],
        firstName: "Mock",
        lastName: "User",
        name: "Mock User",
    },
};
const bootStrap = {
    user_info: {
        username: "jmittelmeier",
        full_username: "jmittelmeier@iplantcollaborative.org",
        email: "jackmittelmeier@email.arizona.edu",
        first_name: "Jack",
        last_name: "Mittelmeier",
    },
    session: {
        login_time: 1583266197702,
        auth_redirect: {
            agave:
                "https://agave.iplantc.org/oauth2/authorize?client_id=6CtVeTM3OvPnffaFbjo6TqxG5e4a&redirect_uri=https%3A%2F%2Fqa.cyverse.org%2Fde%2Foauth%2Fcallback%2Fagave&response_type=code&state=dd773bf2-75f1-4098-bd0c-b44383d6f439",
        },
    },
    apps_info: {
        webhooks: [
            {
                id: "c5b7c2aa-5d8a-11ea-810a-c2a97b34bb42",
                type: {
                    id: "32aaf1c4-91db-11e9-857c-008cfa5ae621",
                    type: "Custom",
                    template: "",
                },
                url: "https://testing.com",
                topics: ["data", "apps", "analysis", "team", "tool_request"],
            },
        ],
        system_ids: {
            de_system_id: "de",
            all_system_ids: ["interactive", "osg", "de", "agave"],
        },
        workspace: {
            id: "dee2419e-f70f-11e7-ad0d-008cfa5ae621",
            user_id: "debb26d6-f70f-11e7-ad0d-008cfa5ae621",
            root_category_id: "dee274ac-f70f-11e7-ad0d-008cfa5ae621",
            is_public: false,
            new_workspace: true,
        },
    },
    data_info: {
        user_home_path: "/iplant/home/jmittelmeier",
        user_trash_path: "/iplant/trash/home/de-irods/jmittelmeier",
        base_trash_path: "/iplant/trash/home/de-irods",
    },
    preferences: {
        rememberLastPath: false,
        notificationKBShortcut: "N",
        dataKBShortcut: "D",
        lastFolder: "/iplant/home/jmittelmeier",
        enableImportEmailNotification: true,
        enableWaitTimeMessage: true,
        defaultFileSelectorPath: "/iplant/home/jmittelmeier",
        closeKBShortcut: "Q",
        appsKBShortcut: "A",
        system_default_output_dir: {
            id: "/iplant/home/jmittelmeier/analyses_qa",
            path: "/iplant/home/jmittelmeier/analyses_qa",
        },
        default_output_folder: {
            id: "/iplant/home/jmittelmeier/analyses_qa",
            path: "/iplant/home/jmittelmeier/analyses_qa",
        },
        analysisKBShortcut: "Y",
        saveSession: true,
        enableAnalysisEmailNotification: true,
        enableHPCPrompt: true,
    },
};

const bag_data = {
    contents: {
        items: [
            {
                name: "test file 1",
                path: "/test/path/file1",
                type: FILE_TYPE,
            },
            {
                name: "test folder 1",
                path: "/test/folder/folder1",
                type: FOLDER_TYPE,
            },
            {
                name: "test analysis 1",
                type: ANALYSIS_TYPE,
            },
            { name: "test app 1", type: APP_TYPE },
            { name: "test app 2", type: APP_TYPE },
            { name: "test app 3", type: APP_TYPE },
            { name: "test app 4", type: APP_TYPE },
            { name: "test app 5", type: APP_TYPE },
            { name: "test app 6", type: APP_TYPE },
            { name: "test app 7", type: APP_TYPE },
            { name: "test app 8", type: APP_TYPE },
            { name: "test app 9", type: APP_TYPE },
            { name: "test app 10", type: APP_TYPE },
            { name: "test app 11", type: APP_TYPE },
        ],
    },
};

export function AppBarTest() {
    mockAxios.onGet("/api/profile").reply(200, mockUser);
    mockAxios.onGet(/\/api\/bootstrap*/).reply(200, bootStrap);
    mockAxios
        .onGet("/api/notifications/last-ten-messages")
        .reply(200, notificationsData);
    mockAxios.onGet("/api/bags/default").reply(200, bag_data);
    return (
        <UserProfileProvider>
            <NotificationsProvider>
                <CyverseAppBar
                    setAppBarRef={() => {}}
                    clientConfig={testConfig}
                />
            </NotificationsProvider>
        </UserProfileProvider>
    );
}

export default {
    title: "AppBar",
    component: CyverseAppBar,
};
