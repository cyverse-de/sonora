/**
 * A page for displaying the App Editor for creating a new app.
 *
 * @author psarando
 */
import React from "react";

import AppEditor from "components/apps/editor";
import NewAppDefaults from "components/apps/editor/NewAppDefaults";
import ids from "components/apps/editor/ids";

export default function AppCreate() {
    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={NewAppDefaults}
        />
    );
}

AppCreate.getInitialProps = async () => ({
    namespacesRequired: [
        "app_editor",
        "app_editor_help",
        "app_param_types",
        "common",
        "data",
        "launch",
    ],
});
