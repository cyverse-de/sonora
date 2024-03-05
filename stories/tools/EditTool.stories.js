import React from "react";
import { mockAxios } from "../axiosMock";
import EditToolDialog from "../../src/components/tools/edit/EditTool";
import { details, toolTypes } from "./ToolMocks";
export default {
    title: "Tools / Edit",
};

export function EditToolTest({ admin, adminPub, newTool }) {
    const tool = {
        id: "5db4e2c7-7a0a-492a-bf79-09cba3801e0d",
    };

    // This story needs to reset mockAxios since a mock in another story
    // is causing all requests for /api/tools to return a listing
    // instead of the following details mock.
    mockAxios.reset();
    mockAxios
        .onGet(new RegExp(`/api/tools/${tool.id}(\\?.*)?`))
        .reply(200, details);
    mockAxios
        .onGet(new RegExp(`/api/admin/tools/${tool.id}(\\?.*)?`))
        .reply(200, details);

    mockAxios.onPatch(/api\/(admin\/)?tools\/*/).reply((config) => {
        const tool = JSON.parse(config.data);
        console.log("Update Tool", config.url, tool);

        return [200, tool];
    });

    mockAxios.onGet("api/apps/elements/tool-types").reply(200, toolTypes);

    const parentId = "editToolDlg";
    const onClose = () => console.log("Dialog closed.");

    if (newTool) {
        return (
            <EditToolDialog
                open={true}
                onClose={onClose}
                isAdmin={!!admin}
                isAdminPublishing={!!adminPub}
                loading={false}
                parentId={parentId}
            />
        );
    } else {
        return (
            <EditToolDialog
                open={true}
                onClose={onClose}
                isAdmin={!!admin}
                isAdminPublishing={!!adminPub}
                loading={false}
                parentId={parentId}
                tool={tool}
            />
        );
    }
}

EditToolTest.argTypes = {
    admin: {
        name: "Admin",
        control: {
            type: "boolean",
        },
    },
    adminPub: {
        name: "Admin Publishing",
        control: {
            type: "boolean",
        },
    },
    newTool: {
        name: "New Tool",
        control: {
            type: "boolean",
        },
    },
};

EditToolTest.args = {
    admin: false,
    adminPub: false,
    newTool: false,
};
