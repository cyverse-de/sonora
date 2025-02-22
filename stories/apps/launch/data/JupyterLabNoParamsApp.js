import constants from "../../../../src/constants";

const JupyterLabNoParamsApp = {
    description:
        "Launches a Jupyter Lab with ScyPy \n\nMaintained here: https://github.com/cyverse-vice/jupyterlab-scipy ",

    requirements: [
        {
            step_number: 0,
            max_cpu_cores: 16,
            memory_limit: 64 * constants.ONE_GiB,
            default_cpu_cores: 8,
            default_memory: 32 * constants.ONE_GiB,
            default_disk_space: 128 * constants.ONE_GiB,
        },
    ],

    deleted: false,
    disabled: false,
    name: "Jupyter Lab no params",
    system_id: "de",
    label: "Jupyter Lab no params",
    id: "4dcda8a6-5761-11ea-bd06-008cfa5ae621",
    app_type: "DE",
    groups: [],
};

export default JupyterLabNoParamsApp;
