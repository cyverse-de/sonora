import React from "react";

import CreateSavedLaunchDialog from "../../../src/components/apps/savedLaunch/CreateSavedLaunchDialog";

export const CreateDialog = () => {
    const createdSavedLaunch = (
        name,
        description,
        isPublic,
        onSuccess,
        onError
    ) => {
        setTimeout(() => {
            console.log("Create Saved Launch", name, description, isPublic);
            onError("save success!");
        }, 1000);
    };

    const onHide = () => {
        console.log("Close Saved Launch Dialog");
    };

    return (
        <CreateSavedLaunchDialog
            appName="All new word count"
            dialogOpen={true}
            createSavedLaunch={createdSavedLaunch}
            onHide={onHide}
        />
    );
};

export default { title: "Apps / Saved Launch / Create" };
