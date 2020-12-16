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

    mockAxios
        .onGet(`/api/tools/5db4e2c7-7a0a-492a-bf79-09cba3801e0d`)
        .reply(200, details);

    mockAxios.onGet(`api/apps/elements/tool-types`).reply(200, toolTypes);

    const parentId = "editToolDlg";

    if (newTool) {
        return (
            <EditToolDialog
                open={true}
                isAdmin={admin}
                isAdminPublishing={adminPub}
                loading={false}
                parentId={parentId}
            />
        );
    } else {
        return (
            <EditToolDialog
                open={true}
                isAdmin={admin}
                isAdminPublishing={adminPub}
                loading={false}
                parentId={parentId}
                tool={tool}
            />
        );
    }
}
EditToolTest.argTypes = {
    admin: {
        control: {
            type: "boolean",
        },
    },
    adminPub: {
        control: {
            type: "boolean",
        },
    },
    newTool: {
        control: {
            type: "boolean",
        },
    },
};