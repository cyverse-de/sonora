import React from "react";
import { mockAxios } from "../axiosMock";
import EditAddonDialog from "components/subscriptions/addons/edit/EditAddon";

import { resourceTypes, availableAddons } from "./SubscriptionAddonsMocks";

export default {
    title: "Subscriptions/Addons",
};

export function EditAddonTest({ updateAddon }) {
    mockAxios.onGet("api/qms/resource-types").reply(200, resourceTypes);
    mockAxios.onPost("api/admin/qms/addons").reply((config) => {
        const submission = JSON.parse(config.data);
        console.log("Add-on created", config.url, submission);
        return [200, submission];
    });
    mockAxios.onPut("api/admin/qms/addons").reply((config) => {
        const submission = JSON.parse(config.data);
        console.log("Add-on updated", config.url, submission);
        return [200, submission];
    });
    const addon = availableAddons.addons[1];
    return (
        <EditAddonDialog
            open={true}
            onClose={() => console.log("Dialog closed.")}
            parentId="editAddonTest"
            addon={updateAddon && addon}
        />
    );
}

EditAddonTest.argTypes = {
    updateAddon: {
        name: "Update an Addon",
        control: {
            type: "boolean",
        },
    },
};

EditAddonTest.args = {
    updateAddon: true,
};
