import React from "react";
import { mockAxios } from "../axiosMock";

import Preferences from "../../src/components/preferences/Preferences";
import { ConfigProvider } from "../../src/contexts/config";
import testConfig from "../configMock";

const props = {
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
            new_workspace: false,
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

export const PreferencesTest = () => {
    mockAxios.onGet(/\/api\/bootstrap*/).reply(200, props);
    return (
        <ConfigProvider config={testConfig}>
            <Preferences baseId="preferences" />
        </ConfigProvider>
    );
};

export default { title: "Preferences" };
