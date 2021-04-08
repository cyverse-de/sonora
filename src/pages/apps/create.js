/**
 * A page for displaying the App Editor for creating a new app.
 *
 * @author psarando
 */
import React from "react";

import AppEditor from "components/apps/editor";
import NewAppDefaults from "components/apps/editor/NewAppDefaults";
import ids from "components/apps/editor/ids";

import { signInErrorResponse } from "components/utils/error/errorCode";

import { useUserProfile } from "contexts/userProfile";

export default function AppCreate() {
    const [userProfile] = useUserProfile();
    const [loadingError, setLoadingError] = React.useState(null);

    React.useEffect(() => {
        if (userProfile?.id) {
            setLoadingError(null);
        } else {
            setLoadingError(signInErrorResponse);
        }
    }, [userProfile]);

    return (
        <AppEditor
            baseId={ids.APP_EDITOR_VIEW}
            appDescription={NewAppDefaults}
            loadingError={loadingError}
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
