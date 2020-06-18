import React, { Component } from "react";
import CreateQuickLaunchDialog from "../../../src/components/apps/quickLaunch/CreateQuickLaunchDialog";

class CreateQuickLaunchDialogTest extends Component {
    render() {
        const presenter = {
            createQuickLaunch: (name, description, isPublic) => {
                console.log("Create Quick Launch", name, description, isPublic);
            },
            onHideCreateQuickLaunchRequestDialog: () => {
                console.log("Close Quick Launch Dialog");
            },
        };
        return (
            <CreateQuickLaunchDialog
                appName="All new word count"
                dialogOpen={true}
                isOwner={true}
                presenter={presenter}
            />
        );
    }
}

export default CreateQuickLaunchDialogTest;
