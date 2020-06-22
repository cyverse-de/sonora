import React from "react";

import CreateQuickLaunchDialog from "../../../src/components/apps/quickLaunch/CreateQuickLaunchDialog";

export const CreateDialog = () => {
    const createQuickLaunch = (
        name,
        description,
        isPublic,
        onSuccess,
        onError
    ) => {
        setTimeout(() => {
            console.log("Create Quick Launch", name, description, isPublic);
            onError("save success!");
        }, 1000);
    };

    const onHide = () => {
        console.log("Close Quick Launch Dialog");
    };

    return (
        <CreateQuickLaunchDialog
            appName="All new word count"
            dialogOpen={true}
            createQuickLaunch={createQuickLaunch}
            onHide={onHide}
        />
    );
};

export default { title: "Apps / Quick Launch" };
