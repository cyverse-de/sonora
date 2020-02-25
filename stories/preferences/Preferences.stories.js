import React from "react";
import NavBar from "../../src/components/preferences/NavBar.js";

export const PreferencesTest = () => {
    const props = {
        user_info: {
            username: "jmittelmeier",
            full_username: "jmittelmeier@iplantcollaborative.org",
            email: "jackmittelmeier@email.arizona.edu",
            first_name: "Jack",
            last_name: "Mittelmeier",
        },
        session: {
            login_time: 1582665707490,
            auth_redirect: {
                agave:
                    "https://agave.iplantc.org/oauth2/authorize?client_id=6CtVeTM3OvPnffaFbjo6TqxG5e4a&redirect_uri=https%3A%2F%2Fqa.cyverse.org%2Fde%2Foauth%2Fcallback%2Fagave&response_type=code&state=64352391-19fc-4aae-baba-2d8dce497ebd",
            },
        },
        apps_info: {
            webhooks: [],
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
            enableWaitTimeMessage: false,
            defaultFileSelectorPath: "/iplant/home/jmittelmeier",
            closeKBShortcut: "Q",
            appsKBShortcut: "A",
            default_output_folder: {
                id: "/iplant/home/jmittelmeier/analyses_qa",
                path: "/iplant/home/jmittelmeier/analyses_qa",
            },
            system_default_output_dir: {
                id: "/iplant/home/jmittelmeier/analyses_qa",
                path: "/iplant/home/jmittelmeier/analyses_qa",
            },
            analysisKBShortcut: "Y",
            saveSession: false,
            enableAnalysisEmailNotification: true,
            enableHPCPrompt: false,
        },
    };

    return <NavBar props={props} />;
};

export default { title: "Preferences" };
