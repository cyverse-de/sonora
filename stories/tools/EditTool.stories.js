import React from "react";
<<<<<<< HEAD
import { mockAxios } from "../axiosMock";
import EditToolDialog from "../../src/components/tools/edit/EditTool";
import { details, toolTypes } from "./ToolMocks";
=======
import EditToolDialog from "../../src/components/tools/edit/EditTool";
>>>>>>> 3171764... Formik forms for Add / Edit tool.
export default {
    title: "Tools / Edit",
};

export function EditToolTest({ admin, adminPub, newTool }) {
    const tool = {
<<<<<<< HEAD
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
=======
        description:
            "Cyverse Jupyter Lab beta with updated iJab plugin and jupyterlab_irods",
        permission: "read",
        interactive: true,
        name: "jupyter-lab",
        type: "interactive",
        restricted: false,
        is_public: true,
        id: "5db4e2c7-7a0a-492a-bf79-09cba3801e0d",
        container: {
            interactive_apps: {
                id: "89e442ee-f1cf-11e8-99d0-008cfa5ae621",
                image: "discoenv/cas-proxy",
                name: "cas-proxy",
                cas_url: "https://olson.cyverse.org/cas",
                cas_validate: "validate",
            },
            max_cpu_cores: 2,
            container_ports: [
                {
                    id: "89e4b440-f1cf-11e8-99d0-008cfa5ae621",
                    container_port: 8888,
                    bind_to_host: false,
                },
            ],
            min_cpu_cores: 0.1,
            uid: 1000,
            working_directory: "/home/jovyan/vice",
            skip_tmp_mount: true,
            id: "89e3f186-f1cf-11e8-99d0-008cfa5ae621",
            memory_limit: 4000000000,
            network_mode: "bridge",
            image: {
                name: "gims.cyverse.org:5000/jupyter-lab",
                id: "89e3c5f8-f1cf-11e8-99d0-008cfa5ae621",
                tag: "1.0",
                deprecated: false,
            },
        },
        version: "0.0.3",
        implementation: {
            implementor: "Upendra Kumar Devisetty",
            implementor_email: "upendra@cyverse.org",
            test: {
                input_files: [],
                output_files: [],
            },
        },
        time_limit_seconds: 0,
    };

    const parentId = "editToolDlg";

    const toolTypes = ["executable", "interactive", "osg"];

    const maxCPUCore = 8;

    const maxMemory = 17179869184;

    const maxDiskSpace = 549755813888;

    return (
        <EditToolDialog
            open={true}
            isAdmin={admin}
            isAdminPublishing={adminPub}
            loading={false}
            parentId={parentId}
            tool={newTool ? null : tool}
            toolTypes={toolTypes}
            maxCPUCore={maxCPUCore}
            maxMemory={maxMemory}
            maxDiskSpace={maxDiskSpace}
        />
    );
>>>>>>> 3171764... Formik forms for Add / Edit tool.
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
